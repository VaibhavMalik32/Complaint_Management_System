from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Literal #lets to restrict a field to specific values

#basic user schema
class UserBase(BaseModel):
    username: str
    email: EmailStr
    full_name: str

#create user schema
class UserCreate(UserBase):
    password: str

#user response schema
class UserResponse(UserBase):
    user_id: int
    disabled: bool
    role:str
    class Config: #config tells pydantic how it should behave
        from_attributes = True #it tells pydantic that it can read values from object's attributes

#create complaint schema
class ComplaintCreate(BaseModel):
    title: str
    description: str
    category: str

#complaint response schema
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

#complaint update history schema
class ComplaintUpdateResponse(BaseModel):
    update_id: int
    complaint_id: int
    updated_by: int
    old_status: str
    new_status: str
    updated_at: datetime
    class Config:
        from_attributes = True

#changing a complaint's status schema
class ComplaintStatusUpdate(BaseModel):
    status: Literal[ #the value must be one of these
        "In Review",
        "In Progress",
        "Resolved",
        "Rejected"
    ]