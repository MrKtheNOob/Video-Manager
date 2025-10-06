import os
from dotenv import load_dotenv
from fastapi import HTTPException
from psycopg2 import IntegrityError
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import sessionmaker, declarative_base

from download import VideoMetaData

load_dotenv()
# Database credentials
USERNAME = os.getenv("DB_USER")
PASSWORD = os.getenv("PASSWORD")
HOST = os.getenv("DB_HOST")
PORT = os.getenv("DB_PORT")
DATABASE_NAME = "videos"


Base = declarative_base()


class Video(Base):
    __tablename__ = "videos"
    id = Column(Integer, primary_key=True, index=True)
    link = Column(String)
    title = Column(String)
    platform = Column(String, index=True, nullable=True)
    uploader = Column(String)
    thumbnail_url = Column(String)
    duration = Column(Integer, default=0)
    view_count = Column(Integer, default=0)


# Create the engine
DATABASE_URI = f"postgresql://{USERNAME}:{PASSWORD}@{HOST}:{PORT}/{DATABASE_NAME}"
engine = create_engine(DATABASE_URI)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
# The engine is created, but a connection isn't established until a task is run.
# You can test the connection by connecting and closing:
try:
    with engine.connect() as connection:
        print("Connected to PostgreSQL successfully!")
except Exception as e:
    print(f"Connection failed: {e}")


async def save_video_data(video: VideoMetaData):
    print("Saving video data to the database...")
    video_data = video.model_dump()  # Pydantic -> dict
    data = Video(**video_data)

    db = SessionLocal()
    try:
        db.add(data)
        db.commit()
        db.refresh(data)
        print(f"Video data saved with ID: {data.id}")
        return data
    except IntegrityError:
        db.rollback()
        print("Video already exists in the database.")
        raise HTTPException(status_code=409)
    finally:
        db.close()


def get_all_videos():
    db = SessionLocal()
    videos = db.query(Video).all()
    db.close()
    return videos
