from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from db import Base, engine
import models
import auth
import complaints

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(complaints.router)

@app.get("/")
def root():
    return {"message": "Complaint Management API is running"}