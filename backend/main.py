from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from db import Base, engine
import auth
import complaints

Base.metadata.create_all(bind=engine) #sqlalchemy checks the models and creates the corresponding database tables if they don't already exist.

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], #to allow requests from frontend
    allow_credentials=True, #to allow credentials
    allow_methods=["*"], #to allow http methods
    allow_headers=["*"], #to allow http headers
)
app.mount( #makes uploaded files accessible /uploads
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads"
)
app.include_router(auth.router) #adds all authentication routes
app.include_router(complaints.router) #adds all complaint routes

@app.get("/")
def root():
    return {"message": "Complaint Management API is running"}