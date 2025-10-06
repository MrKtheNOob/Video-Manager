from http.client import HTTPException
import os
from typing import List
from fastapi import FastAPI, Request, Response
from fastapi.staticfiles import StaticFiles
import requests

from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel
from db import get_all_videos, save_video_data
from download import get_video_metadata, VideoMetaData

app = FastAPI()
load_dotenv()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class UploadPayload(BaseModel):
    link: str


@app.post("/api/videos/upload", response_class=JSONResponse)
async def upload_video(payload: UploadPayload):
    link = payload.link
    metadata: VideoMetaData | None = get_video_metadata(link)
    if not metadata:
        return JSONResponse(
            status_code=400, content={"error": "Failed to extract metadata."}
        )
    try:
        await save_video_data(metadata)
    except Exception as e:
        return JSONResponse(
            status_code=500, content={"error": f"Failed to save metadata: {e}"}
        )

    return JSONResponse(
        status_code=201,
        content={"link": link, "data": metadata.model_dump()},  # convert to dict
    )


# custom upload
@app.post("/api/upload")
async def custom_upload(link: str):
    metadata: VideoMetaData | None = get_video_metadata(link)
    if not metadata:
        return JSONResponse(
            status_code=400, content={"error": "Failed to extract metadata."}
        )
    try:
        await save_video_data(metadata)
    except Exception as e:
        return JSONResponse(
            status_code=500, content={"error": f"Failed to save metadata: {e}"}
        )

    return JSONResponse(
        status_code=201,
        content={"link": link, "data": metadata.model_dump()},  # convert to dict
    )


@app.get("/api/videos", response_class=JSONResponse)
async def get_videos():
    videos: List[VideoMetaData] = get_all_videos()
    return {"data": videos}


@app.get("/api/videos/search", response_class=JSONResponse)
async def search_videos(query: str):
    videos: List[VideoMetaData] = get_all_videos()
    filtered_videos = [
        video for video in videos if query.lower() in video.title.lower()
    ]
    return {"data": filtered_videos}


@app.get("/api/proxy-image/")
async def proxy_image(url: str):
    """Proxies an image URL to avoid CORS issues."""
    print(url)
    print(url)
    print(url)
    print(url)
    print(url)
    print(url)
    print(url)
    print(url)
    response = requests.get(url)
    return Response(content=response.content, media_type="image/jpeg")


# Path to Vite build directory
react_build_dir = os.path.join("./dist")
app.mount("/", StaticFiles(directory=react_build_dir, html=True), name="frontend")
