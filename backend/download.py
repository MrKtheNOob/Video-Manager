import random
from urllib.parse import urlparse
from pydantic import BaseModel
import yt_dlp
import os


class VideoMetaData(BaseModel):
    title: str
    link: str
    platform: str
    uploader: str
    thumbnail_url: str
    duration: float = 0  # default if not present
    view_count: int = 0  # default if not present


def get_video_metadata(url):
    """
    Extracts video metadata without downloading the video.
    Returns a VideoMetaData instance.
    """
    print(f"Extracting metadata for URL: {url}")
    # Get the video platform
    domain = urlparse(url).netloc.lower()  # "www.tiktok.com"

    ydl_opts = {
        "quiet": True,
        "simulate": True,
        "skip_download": True,
    }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info_dict = ydl.extract_info(url, download=False)

            # Map the fields we care about
            data = {
                "title": info_dict.get("title", ""),
                "uploader": info_dict.get("uploader", "Unknown"),
                "thumbnail_url": info_dict.get("thumbnail", ""),
                "duration": info_dict.get("duration", 0),
                "view_count": info_dict.get("view_count", 0),
            }
            if domain == "www.instagram.com":
                print("this is an instagram link")
                data["title"] = info_dict["description"]
                data["uploader"] = info_dict["channel"]
                data["thumbnail_url"] = random.choice(info_dict["thumbnails"])["url"]
            print(data)
            return VideoMetaData(platform=domain, link=url, **data)

    except Exception as e:
        print(f"An error occurred: {e}")
        return None


# Replace with the actual video URL
# video_url = "YOUR_VIDEO_URL_HERE"

# metadata = get_video_metadata(video_url)

# if metadata:
#     # Common fields you can extract
#     title = metadata.get("title")
#     uploader = metadata.get("uploader")
#     thumbnail_url = metadata.get("thumbnail")  # URL of the video thumbnail
#     duration = metadata.get("duration")
#     view_count = metadata.get("view_count")

#     print("--- Video Metadata ---")
#     print(f"Title: {title}")
#     print(f"Uploader: {uploader}")
#     print(f"Duration (seconds): {duration}")
#     print(f"View Count: {view_count}")
#     print(f"Thumbnail URL: {thumbnail_url}")
#     # The entire metadata is a large dictionary, `info_dict`,
#     # which contains all available information.


def video_progress_hook(download):
    # 'd' is the status dictionary passed by yt-dlp

    if download["status"] == "downloading":
        # Convert bytes to megabytes for a cleaner display
        downloaded_mb = download["downloaded_bytes"] / (1024 * 1024)
        total_mb = download["total_bytes"] / (1024 * 1024)

        # Format the percentage and ETA
        percent = download["_percent_str"]
        speed = download["_speed_str"]
        eta = download["_eta_str"]

        print(
            f"Downloading: {percent} of {downloaded_mb:.2f}/{total_mb:.2f}MB at {speed}, ETA: {eta}",
            end="\r",
        )

    elif download["status"] == "finished":
        filename = download["filename"]
        print(f"\n✅ Done downloading! File saved as: {filename}")

    elif download["status"] == "error":
        print("\n❌ An error occurred during download!")


async def download_video(video_url, save_path="downloads"):
    """Downloads a video in the best available quality."""

    # 1. Ensure the save directory exists
    os.makedirs(save_path, exist_ok=True)

    # 2. Define download options (ydl_opts)
    ydl_opts = {
        # Select best video and best audio and merge them
        "format": "bestvideo+bestaudio/best",
        # Merge the video and audio into a single MP4 file
        "merge_output_format": "mp4",
        # Set the output file path and name template
        "outtmpl": f"{save_path}/%(title)s.%(ext)s",
        # Print download progress to the console
        "verbose": False,
        "progress_hooks": [video_progress_hook],
    }

    try:
        print(f"Attempting to download: {video_url}...")

        # 3. Create the YoutubeDL instance and start the download
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([video_url])

        print(f"Video downloaded successfully to: {save_path}")

    except Exception as e:
        print(f"An error occurred during download: {e}")


# --- Example Usage ---
if __name__ == "__main__":
    # Replace with the URL you want to download
    example_url = "https://www.tiktok.com/@uad_bambey/video/7553676159716822284?_r=1&_t=ZN-8zzwBlUUdqI"

    # Download the video to a folder named 'my_videos'
    download_video(example_url)
