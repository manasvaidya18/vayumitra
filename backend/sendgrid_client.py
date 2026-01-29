import os
from sendgrid import SendGridAPIClient

# Initialize SendGrid client
sg = SendGridAPIClient(os.getenv('SENDGRID_API_KEY'))

def get_sendgrid_client():
    """Get SendGrid client instance"""
    return sg
