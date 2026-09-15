from pydantic import BaseModel, EmailStr
from datetime import datetime

class UserBase(BaseModel):
    username: str
    email: EmailStr
    full_name: str


class UserCreate(UserBase):
    password: str


class UserResponse(UserBase):
    user_id: int
    disabled: bool
    role:str

    class Config:
        from_attributes = True


class ComplaintCreate(BaseModel):
    title: str
    description: str
    category: str


class ComplaintResponse(BaseModel):
    complaint_id: int
    user_id: int
    title: str
    description: str
    category: str
    status: str
    created_at: datetime
    updated_at: datetime 

    class Config:
        from_attributes = True

class ComplaintStatusUpdate(BaseModel):
    status: str