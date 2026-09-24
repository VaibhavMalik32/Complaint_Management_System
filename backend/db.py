#for connecting fastapi to mysql
from sqlalchemy import create_engine #to create connection mechanism between sqlalchemy and mysql database
from sqlalchemy.orm import sessionmaker, declarative_base #to create db sessions(object through which python talks to db)
import os #to acess environment variables
from dotenv import load_dotenv

load_dotenv() #for reading the .env file

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL) # to create a connection to the db

SessionLocal = sessionmaker( #creates an object for taking to the db
    autocommit=False,
    autoflush=False, #sqlalchemy won't automatically send pending changes to the database before every query
    bind=engine
)

Base = declarative_base() #creates a base class for sqlalchemy models

def get_db(): #dependency that supplies a db session
    db = SessionLocal() #creates a new db session
    try:
        yield db #gives the session to API endpoint
    finally:
        db.close()