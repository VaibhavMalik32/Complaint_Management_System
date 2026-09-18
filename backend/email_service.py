from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from pydantic import EmailStr
from dotenv import load_dotenv
import os
load_dotenv()

print("MAIL_USERNAME:", os.getenv("MAIL_USERNAME"))
print("MAIL_PASSWORD EXISTS:", bool(os.getenv("MAIL_PASSWORD")))

conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv("MAIL_USERNAME"),
    MAIL_PASSWORD=os.getenv("MAIL_PASSWORD"),
    MAIL_FROM=os.getenv("MAIL_USERNAME"),
    MAIL_PORT=587,
    MAIL_SERVER="smtp.gmail.com",
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
)

async def send_otp_email(
    email: EmailStr,
    otp: str
):
    message = MessageSchema(
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
        subtype="plain",
    )
    fm = FastMail(conf)
    await fm.send_message(message)