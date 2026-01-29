def reset_password_template(reset_url):
    """HTML template for password reset"""
    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }}
            .container {{
                max-width: 600px;
                margin: 50px auto;
                background-color: #ffffff;
                padding: 40px;
                border-radius: 10px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }}
            .header {{
                text-align: center;
                margin-bottom: 30px;
            }}
            .logo {{
                font-size: 32px;
                font-weight: bold;
                background: linear-gradient(to right, #10b981, #4f46e5);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }}
            .button {{
                display: inline-block;
                padding: 15px 30px;
                background: linear-gradient(135deg, #10b981 0%, #4f46e5 100%);
                color: white;
                text-decoration: none;
                border-radius: 8px;
                font-weight: bold;
                margin: 20px 0;
            }}
            .content {{
                color: #333;
                line-height: 1.6;
            }}
            .footer {{
                margin-top: 30px;
                text-align: center;
                color: #666;
                font-size: 12px;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">VayuMitra</div>
                <p style="color: #666;">Password Reset Request</p>
            </div>
            
            <div class="content">
                <h2 style="color: #333;">Reset Your Password</h2>
                <p>We received a request to reset your password. Click the button below to create a new password:</p>
                
                <div style="text-align: center;">
                    <a href="{reset_url}" class="button">Reset Password</a>
                </div>
                
                <p>This link will expire in <strong>1 hour</strong> for security reasons.</p>
                
                <p style="color: #666; font-size: 14px;">Or copy and paste this link into your browser:</p>
                <p style="background-color: #f4f4f4; padding: 10px; border-radius: 5px; word-break: break-all; font-size: 12px;">
                    {reset_url}
                </p>
                
                <p style="color: #e53e3e; margin-top: 20px;">
                    <strong>⚠️ If you didn't request this password reset, please ignore this email or contact support if you're concerned about your account security.</strong>
                </p>
            </div>
            
            <div class="footer">
                <p>&copy; 2026 VayuMitra. AI-powered urban air quality intelligence.</p>
            </div>
        </div>
    </body>
    </html>
    """
