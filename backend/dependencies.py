from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from db import get_db
from models import User
from security import SECRET_KEY, ALGORITHM

oauth2_scheme = OAuth2PasswordBearer( #tells fastapi that authentication uses a bearer token
    tokenUrl="/auth/login" #tells fastapi that your authentication uses an OAuth2 bearer-token flow and that /auth/login is the token endpoint
)

def get_current_user(
    token: str = Depends(oauth2_scheme), #gets the token from the request
    db: Session = Depends(get_db)
):
    credentials_exception = HTTPException( #standard authentication error
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode( #checks that the token was signed using the correct secret key and algorithm
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        username = payload.get("sub")

        if username is None:
            raise credentials_exception

    except JWTError:
        raise credentials_exception

    user = db.query(User).filter(User.username == username).first()

    if user is None:
        raise credentials_exception

    return user