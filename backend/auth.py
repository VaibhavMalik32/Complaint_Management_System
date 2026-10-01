from datetime import timedelta,datetime
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from db import get_db
from models import User,EmailOTP
from email_service import send_otp_email
from schema import UserCreate, UserResponse
from security import (
    verify_password,
    get_password_hash,
    create_access_token
)
from dependencies import(
    get_current_user
)
from pydantic import BaseModel
import secrets
import re

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

def generate_otp(): #generates a random six-digit number
    return str(secrets.randbelow(900000)+100000)


def validate_username(username: str):
    if not re.fullmatch(r"^(?=.*#!$%[A-Za-z0-9])[A-Za-z0-9._@-]+$", username):
        raise HTTPException(
            status_code=400,
            detail="Username can contain letters, numbers, ., _, @ and -, and must contain at least one letter or number."
        )

def validate_password(password: str):
    if len(password) < 8:
        raise HTTPException(
            status_code=400,
            detail="Password must be at least 8 characters long."
        )

    if not re.search(r"[A-Z]", password):
        raise HTTPException(
            status_code=400,
            detail="Password must contain at least one uppercase letter."
        )

    if not re.search(r"[a-z]", password):
        raise HTTPException(
            status_code=400,
            detail="Password must contain at least one lowercase letter."
        )

    if not re.search(r"[^A-Za-z0-9]", password):
        raise HTTPException(
            status_code=400,
            detail="Password must contain at least one special character."
        )

@router.post("/register", response_model=UserResponse)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    validate_username(user_data.username)
    validate_password(user_data.password)
    existing_user = db.query(User).filter(User.username == user_data.username).first()
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Username already exists"
        )
    existing_email = db.query(User).filter(User.email == user_data.email).first()
    if existing_email:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )
    
    verified_otp = db.query(EmailOTP).filter(EmailOTP.email == user_data.email,EmailOTP.verified == True,EmailOTP.used == False).order_by(EmailOTP.created_at.desc()).first()

    if not verified_otp:
        raise HTTPException(
            status_code=400,
            detail="Please verify your email before registering"
        )
    new_user = User(
        username=user_data.username,
        email=user_data.email,
        full_name=user_data.full_name,
        phone=user_data.phone,
        address=user_data.address,
        city=user_data.city,
        state=user_data.state,
        hashed_password=get_password_hash(user_data.password),
        disabled=False,
        role="user",
        is_email_verified=True
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    verified_otp.user_id = new_user.user_id
    verified_otp.used = True

    db.commit()
    return new_user

@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(), #fastapi receives username and password using the oauth2 form format
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.username == form_data.username).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )

    if not verify_password(
        form_data.password,
        user.hashed_password
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )

    if not user.is_email_verified:
        raise HTTPException(
            status_code=403,
            detail="Please verify your email before logging in"
        )

    access_token_expires = timedelta(minutes=30)

    access_token = create_access_token(
        data={"sub": user.username},
        expires_delta=access_token_expires
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role":user.role
    }

@router.post("/logout")
def logout():
    return {"message": "Successfully logged out"}

class OTPVerify(BaseModel):
    email: str
    otp: str

@router.post("/verify-otp")
def verify_otp(
    otp_data: OTPVerify,
    db: Session = Depends(get_db)
):
    otp_record = db.query(EmailOTP).filter(
        EmailOTP.email == otp_data.email,
        EmailOTP.otp == otp_data.otp,
        EmailOTP.verified == False,
        EmailOTP.used == False
    ).order_by(
        EmailOTP.created_at.desc()
    ).first()

    if not otp_record:
        raise HTTPException(
            status_code=400,
            detail="Invalid OTP"
        )

    if datetime.utcnow() > otp_record.expires_at:
        raise HTTPException(
            status_code=400,
            detail="OTP has expired"
        )

    otp_record.verified = True

    db.commit()

    return {
        "message": "Email verified successfully"
    }

class SendOTPRequest(BaseModel):
    email: str

@router.post("/send-otp")
async def send_otp(
    otp_data: SendOTPRequest,
    db: Session = Depends(get_db)
):
    # Check whether email is already registered
    existing_user = db.query(User).filter(
        User.email == otp_data.email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email is already registered"
        )

    # Generate OTP
    otp = generate_otp()

    # Save OTP
    otp_record = EmailOTP(
        email=otp_data.email,
        otp=otp,
        expires_at=datetime.utcnow() + timedelta(minutes=10),
        verified=False,
        used=False
    )

    db.add(otp_record)
    db.commit()

    # Send OTP
    await send_otp_email(
        otp_data.email,
        otp
    )

    return {
        "message": "OTP sent successfully"
    }

@router.get("/me", response_model=UserResponse)
def get_me(
    current_user: User = Depends(get_current_user)
):
    return current_user