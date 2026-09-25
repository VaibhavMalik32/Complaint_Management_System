#this file defines the format of API data
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
    username: str
    full_name: str
    email: EmailStr
    password: str
    phone: str
    address: str
    city: str
    state: str

#user response schema
class UserResponse(UserBase):
    user_id: int
    disabled: bool
    role:str
    department: str
    post: str
    class Config: #config tells pydantic how it should behave
        from_attributes = True #it tells pydantic that it can read values from object's attributes

#create complaint schema
class ComplaintCreate(BaseModel):
    title: str
    description: str
    category: str

class ComplaintImageResponse(BaseModel):
    image_id: int
    image_path: str
    class Config:
        from_attributes = True

#complaint response schema
class ComplaintResponse(BaseModel):
    complaint_id: int
    user_id: int
    employee_id: int | None = None
    title: str
    description: str
    category: str
    location: str
    status: str
    created_at: datetime | None = None
    updated_at: datetime | None = None
    images: list[ComplaintImageResponse] = []
    class Config:
        from_attributes = True

#complaint update history schema
class ComplaintUpdateResponse(BaseModel):
    update_id: int
    complaint_id: int
    employee_id: int
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

class ComplaintAssign(BaseModel):
    employee_id: int

class StaffCreate(BaseModel):
    username: str
    full_name: str
    email: EmailStr
    password: str
    phone: str
    address: str
    city: str
    state: str
    department: str
    post: str

class StaffTransfer(BaseModel):
    address: str
    city: str
    state: str
    department: str
    post: str