from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import timedelta, datetime
from pydantic import BaseModel
import hashlib
import secrets
from jose import jwt, JWTError

from database import get_db
import models
from . import utils as auth_utils
from email_service import send_verify_email, send_reset_email

router = APIRouter(prefix="/auth", tags=["Authentication"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

# Pydantic Models
class UserCreate(BaseModel):
    email: str
    password: str
    role: str = "citizen"  # Default role

class EmailOnly(BaseModel):
    email: str

class VerifyEmail(BaseModel):
    email: str
    otp: str

class CompleteSignup(BaseModel):
    password: str
    role: str = "citizen"

class ResetPassword(BaseModel):
    password: str
    password_confirm: str

class Token(BaseModel):
    access_token: str
    token_type: str

# Helper function to get current user from token
async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, auth_utils.SECRET_KEY, algorithms=[auth_utils.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    
    user = db.query(models.User).filter(models.User.email == email).first()
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return user

# NEW: Start Signup - Send OTP
@router.post("/start-signup")
async def start_signup(data: EmailOnly, db: Session = Depends(get_db)):
    """Start signup process by sending OTP to email"""
    # Check if user already exists with completed signup
    existing_user = db.query(models.User).filter(models.User.email == data.email).first()
    if existing_user and existing_user.signup_completed:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Generate 6-digit OTP
    otp = str(secrets.randbelow(900000) + 100000)
    otp_hash = hashlib.sha256(otp.encode()).hexdigest()
    
    if not existing_user:
        # Create new user entry
        new_user = models.User(
            email=data.email,
            register_otp=otp_hash,
            register_otp_expires=datetime.utcnow() + timedelta(minutes=10)
        )
        db.add(new_user)
    else:
        # Update existing incomplete signup
        existing_user.register_otp = otp_hash
        existing_user.register_otp_expires = datetime.utcnow() + timedelta(minutes=10)
    
    db.commit()
    
    # Send OTP via email
    try:
        await send_verify_email(data.email, otp)
    except Exception as e:
        print(f"Email sending failed: {e}")
        # For development, print OTP to console
        print(f"🔐 OTP for {data.email}: {otp}")
    
    return {"status": "success", "message": "Verification code sent to email"}

# NEW: Verify Email
@router.post("/verify-email", response_model=Token)
async def verify_email(data: VerifyEmail, db: Session = Depends(get_db)):
    """Verify OTP and return temporary signup token"""
    user = db.query(models.User).filter(
        models.User.email == data.email,
        models.User.register_otp_expires > datetime.utcnow()
    ).first()
    
    if not user:
        raise HTTPException(status_code=400, detail="OTP expired or invalid")
    
    # Verify OTP
    otp_hash = hashlib.sha256(data.otp.encode()).hexdigest()
    if otp_hash != user.register_otp:
        raise HTTPException(status_code=400, detail="Incorrect verification code")
    
    # Mark email as verified
    user.is_email_verified = True
    user.register_otp = None
    user.register_otp_expires = None
    db.commit()
    
    # Issue temporary signup token (short expiry)
    access_token_expires = timedelta(minutes=15)
    access_token = auth_utils.create_access_token(
        data={"sub": user.email, "role": user.role or "citizen"}, 
        expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

# NEW: Complete Signup
@router.post("/complete-signup", response_model=Token)
async def complete_signup(
    data: CompleteSignup, 
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Complete signup after email verification"""
    if not current_user.is_email_verified:
        raise HTTPException(status_code=401, detail="Email not verified")
    
    if current_user.signup_completed:
        raise HTTPException(status_code=400, detail="Signup already completed")
    
    # Set password and complete signup
    current_user.hashed_password = auth_utils.get_password_hash(data.password)
    current_user.role = data.role
    current_user.signup_completed = True
    db.commit()
    
    # Issue final access token
    access_token_expires = timedelta(minutes=auth_utils.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth_utils.create_access_token(
        data={"sub": current_user.email, "role": current_user.role}, 
        expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

# NEW: Forgot Password
@router.post("/forgot-password")
async def forgot_password(data: EmailOnly, db: Session = Depends(get_db)):
    """Send password reset email"""
    user = db.query(models.User).filter(models.User.email == data.email).first()
    if not user:
        # Don't reveal if email exists
        return {"status": "success", "message": "If email exists, reset link has been sent"}
    
    # Generate reset token
    reset_token = user.get_reset_password_token()
    db.commit()
    
    # Create reset URL (frontend URL)
    reset_url = f"http://localhost:3000/reset-password/{reset_token}"
    
    # Send reset email
    try:
        await send_reset_email(data.email, reset_url)
    except Exception as e:
        print(f"Email sending failed: {e}")
        # For development, print reset URL to console
        print(f"🔗 Reset URL for {data.email}: {reset_url}")
    
    return {"status": "success", "message": "Reset email sent successfully"}

# NEW: Reset Password
@router.post("/reset-password/{token}")
async def reset_password(token: str, data: ResetPassword, db: Session = Depends(get_db)):
    """Reset password using reset token"""
    # Hash the token to compare with stored hash
    hashed_token = hashlib.sha256(token.encode()).hexdigest()
    
    user = db.query(models.User).filter(
        models.User.password_reset_token == hashed_token,
        models.User.password_reset_token_expires > datetime.utcnow()
    ).first()
    
    if not user:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")
    
    # Verify passwords match
    if data.password != data.password_confirm:
        raise HTTPException(status_code=400, detail="Passwords do not match")
    
    # Update password
    user.hashed_password = auth_utils.get_password_hash(data.password)
    user.clear_reset_token()
    db.commit()
    
    # Issue access token (auto-login)
    access_token_expires = timedelta(minutes=auth_utils.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth_utils.create_access_token(
        data={"sub": user.email, "role": user.role}, 
        expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

# EXISTING: Legacy signup endpoint (for backward compatibility)
@router.post("/signup", response_model=Token)
async def signup(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = auth_utils.get_password_hash(user.password)
    new_user = models.User(
        email=user.email, 
        hashed_password=hashed_password, 
        role=user.role,
        is_email_verified=True,  # Skip verification for legacy endpoint
        signup_completed=True
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Auto-login after signup
    access_token_expires = timedelta(minutes=auth_utils.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth_utils.create_access_token(
        data={"sub": new_user.email, "role": new_user.role}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# EXISTING: Login endpoint
@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # OAuth2PasswordRequestForm expects 'username', but we use 'email'. 
    # Frontend must send email in the 'username' field.
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not auth_utils.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=auth_utils.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth_utils.create_access_token(
        data={"sub": user.email, "role": user.role}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

