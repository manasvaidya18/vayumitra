from sqlalchemy import Column, Integer, String, Boolean, DateTime
from database import Base
import hashlib
import secrets
from datetime import datetime, timedelta

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String, nullable=True)
    role = Column(String) # 'citizen' or 'policymaker'
    
    # Email verification fields
    is_email_verified = Column(Boolean, default=False)
    signup_completed = Column(Boolean, default=False)
    register_otp = Column(String, nullable=True)
    register_otp_expires = Column(DateTime, nullable=True)
    
    # Password reset fields
    password_reset_token = Column(String, nullable=True)
    password_reset_token_expires = Column(DateTime, nullable=True)
    
    def get_reset_password_token(self):
        """Generate password reset token"""
        reset_token = secrets.token_urlsafe(32)
        self.password_reset_token = hashlib.sha256(reset_token.encode()).hexdigest()
        self.password_reset_token_expires = datetime.utcnow() + timedelta(hours=1)
        return reset_token
    
    def clear_reset_token(self):
        """Clear password reset token"""
        self.password_reset_token = None
        self.password_reset_token_expires = None

