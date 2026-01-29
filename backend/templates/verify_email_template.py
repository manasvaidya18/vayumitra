def verify_email_template(otp):
    """HTML template for email verification"""
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
            .otp-box {{
                background: linear-gradient(135deg, #10b981 0%, #4f46e5 100%);
                color: white;
                font-size: 36px;
                font-weight: bold;
                text-align: center;
                padding: 20px;
                border-radius: 10px;
                letter-spacing: 8px;
                margin: 30px 0;
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
                <p style="color: #666;">Email Verification</p>
            </div>
            
            <div class="content">
                <h2 style="color: #333;">Verify Your Email Address</h2>
                <p>Thank you for signing up with VayuMitra! Please use the following verification code to complete your registration:</p>
                
                <div class="otp-box">{otp}</div>
                
                <p>This code will expire in <strong>10 minutes</strong>.</p>
                
                <p>If you didn't request this verification code, please ignore this email.</p>
            </div>
            
            <div class="footer">
                <p>&copy; 2026 VayuMitra. AI-powered urban air quality intelligence.</p>
            </div>
        </div>
    </body>
    </html>
    """
