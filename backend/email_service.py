from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from pydantic import EmailStr
from dotenv import load_dotenv
import os
load_dotenv()

conf = ConnectionConfig( #creates the gmail smtp configuration(how the application connects to the email server)
    MAIL_USERNAME=os.getenv("MAIL_USERNAME"),
    MAIL_PASSWORD=os.getenv("MAIL_PASSWORD"),
    MAIL_FROM=os.getenv("MAIL_USERNAME"),
    MAIL_PORT=587, #gmail smtp port
    MAIL_SERVER="smtp.gmail.com", #gmail smtp server
    MAIL_STARTTLS=True, #STARTTLS tells the SMTP connection to upgrade to an encrypted TLS connection
    MAIL_SSL_TLS=False, #doesn't use direct SSL/TLS mode
    USE_CREDENTIALS=True, #tells fastapi-mail to authenticate using the configured credentials
)

async def send_otp_email(
    email: EmailStr,
    otp: str
):
    message = MessageSchema( #defines the email itself
        subject="Complaint Management System - Email Verification",
        recipients=[email],
        body=f"""
Hello,

Your OTP for email verification is:

{otp}

This OTP is valid for 10 minutes.

If you did not create an account, please ignore this email.

Regards,
Complaint Management System
""",
        subtype="plain", #tells the email library what type of content the body contains
    )
    fm = FastMail(conf) #object that actually handles sending the email using your configured email server
    await fm.send_message(message)