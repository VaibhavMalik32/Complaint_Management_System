from datetime import datetime, timedelta, timezone #timedelta represents a time duration
from jose import jwt, JWTError #jwt creates jwt tokens and jwterror for handlind jwt related errors
from passlib.context import CryptContext
import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))
pwd_context = CryptContext( #creates the password hashing configuration
    schemes=["bcrypt"],
    deprecated="auto" #to automatically handle the deprecation status of password-hashing schemes
)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(
        plain_password,
        hashed_password
    )

def get_password_hash(password):
    return pwd_context.hash(password) #creates a bcrypt hash

def create_access_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy() #copy of data is made
    expire = datetime.now(timezone.utc) + expires_delta #calculates when the token should expire
    to_encode.update({ #adds the expiration time to the JWT payload
        "exp": expire
    })
    encoded_jwt = jwt.encode( #creates the JWT using payload, secret key, algorithm
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )
    return encoded_jwt #returns the generated token