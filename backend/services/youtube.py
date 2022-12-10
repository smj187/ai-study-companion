import yt_dlp
import re
from pytube import YouTube 

def youtube_video_download(url: str):
    ydl_opts = {
        'verbose': False,
        'format': 'm4a/bestaudio/best',
        # ℹ️ See help(yt_dlp.postprocessor) for a list of available Postprocessors and their arguments
        'postprocessors': [{  # Extract audio using ffmpeg
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'm4a',
        }],
        'outtmpl': './assets/%(id)s.%(ext)s'
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        error_code = ydl.download(url)
        print(error_code)

    match = re.search(r"youtube\.com/.*v=([^&]*)", url)
    if match:
        result = match.group(1)
        return f"./assets/{result}.m4a"
    return ydl_opts

def get_video_information(url: str) -> dict[str, str]:
    yt = YouTube(url)

    print(yt.title)
    print(yt.thumbnail_url)

    return { "title": yt.title, "thumbnail": yt.thumbnail_url }