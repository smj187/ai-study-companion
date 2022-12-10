from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from revChatGPT.revChatGPT import Chatbot
from typing import Dict
from pydantic import BaseModel, Field

from services.assemblyai import upload_local_file, get_transcription
from services.youtube import youtube_video_download 
from configure import ASSEMBLY_AI_KEY, OPEN_AI_EMAIL, OPEN_AI_PASSWORD

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class DownloadYouTubeVideoRequest(BaseModel):
    url: str

@app.get("/youtube")
async def download_youtube_video(yt_url: str):
    local_file_path = youtube_video_download(yt_url)
    return local_file_path


@app.get("/assembly/youtube")
async def process_assembly_youtube(yt_url: str):
    local_file_path = youtube_video_download(yt_url)
    with open(local_file_path, mode='rb') as file:
        assembly_request_body: Dict[str, str | bool] = {
            "auto_chapters": True
        }

        uploaded_file_url = upload_local_file(file, ASSEMBLY_AI_KEY)
        data, err, sentences, paragraphs = get_transcription(uploaded_file_url, assembly_request_body, ASSEMBLY_AI_KEY)
        return data


@app.post("/assembly")
async def process_assembly_file(file: UploadFile = File(...)):
    # https://www.assemblyai.com/docs/audio-intelligence#summarization

    # summary_model           summary_type
    # informative -> supports: bullets,bullets_verbose,headline,paragraph
    # conversational -> supports: bullets,bullets_verbose,headline,paragraph
    # catchy -> supports: headline,gist
    
    assembly_request_body: Dict[str, str | bool] = {
        #"summarization": True,
        #"summary_model": "informative",
        #"summary_type": "bullets_verbose",
        #"speaker_labels": True
        "auto_chapters": True
    }



    uploaded_file_url = upload_local_file(file.file, ASSEMBLY_AI_KEY)
    data, err, sentences, paragraphs = get_transcription(uploaded_file_url, assembly_request_body, ASSEMBLY_AI_KEY)
    return data


@app.get("/chatgpt")
async def process_chatgpt(input_text: str, generate_question: bool):
    config = {
        "email": OPEN_AI_EMAIL,
        "password": OPEN_AI_PASSWORD,
        #"session_token": "<SESSION_TOKEN>", # Deprecated. Use only if you encounter captcha with email/password
        #"proxy": "<HTTP/HTTPS_PROXY>"
    }

    chatbot = Chatbot(config, conversation_id=None)
    if generate_question:
        input_text = "give a detailed question for the following information\n" + input_text
    print(input_text)
    response = chatbot.get_chat_response(input_text, output="text")
    print(response) 
    return response


@app.get("/")
async def root():
    return {"message": "Hello World"}