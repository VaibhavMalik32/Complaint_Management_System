from sqlalchemy import Column,Integer,String,Boolean,ForeignKey,Text,DateTime
from sqlalchemy.sql import func
from db import Base

class User(Base):
    __tablename__ = "users"
    user_id = Column(Integer,primary_key=True,index=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(100), unique=True, nullable=False)
    full_name = Column(String(100), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    disabled = Column(Boolean, default=False)
    role = Column(String(20),default="user",nullable=False)

class Complaint(Base):
    __tablename__ = "complaints"
    complaint_id = Column(Integer,primary_key=True,index=True)
    user_id = Column(Integer,ForeignKey("users.user_id"),nullable=False)
    title = Column(String(200),nullable = False)
    description = Column(Text,nullable = False)
    category = Column(String(100), nullable=False)
    status = Column(String(50),default="In Review",nullable=False)
    created_at = Column(DateTime,server_default=func.now())
    updated_at = Column(DateTime,server_default=func.now(),onupdate=func.now())