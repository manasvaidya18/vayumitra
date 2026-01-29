import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from templates.verify_email_template import verify_email_template
from templates.reset_password_template import reset_password_template

async def send_verify_email(email: str, otp: str):
    """Send email verification OTP"""
    print(f"🔐 OTP for {email}: {otp}")
    
    # Try to send via SendGrid if configured
    api_key = os.getenv('SENDGRID_API_KEY')
    from_email = os.getenv('EMAIL')
    
    if not api_key or not from_email:
        print("⚠️ SendGrid not configured, OTP printed to console only")
        return
    
    try:
        sg = SendGridAPIClient(api_key)
        message = Mail(
            from_email=from_email,
            to_emails=email,
            subject='Verify Your Email - VayuMitra',
            html_content=verify_email_template(otp)
        )
        response = sg.send(message)
        print(f"✅ Email sent successfully to {email}")
        return response
    except Exception as e:
        print(f"❌ Error sending verification email: {e}")
        print(f"🔐 OTP (fallback): {otp}")
        # Don't raise exception, just print OTP
        return None

async def send_reset_email(email: str, reset_url: str):
    """Send password reset email"""
    print(f"🔗 Reset URL for {email}: {reset_url}")
    
    # Try to send via SendGrid if configured
    api_key = os.getenv('SENDGRID_API_KEY')
    from_email = os.getenv('EMAIL')
    
    if not api_key or not from_email:
        print("⚠️ SendGrid not configured, reset link printed to console only")
        return
    
    try:
        sg = SendGridAPIClient(api_key)
        message = Mail(
            from_email=from_email,
            to_emails=email,
            subject='Reset Your Password - VayuMitra',
            html_content=reset_password_template(reset_url)
        )
        response = sg.send(message)
        print(f"✅ Email sent successfully to {email}")
        return response
    except Exception as e:
        print(f"❌ Error sending reset email: {e}")
        print(f"🔗 Reset URL (fallback): {reset_url}")
        # Don't raise exception, just print URL
        return None
