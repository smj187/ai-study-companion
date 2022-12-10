from fastapi import FastAPI, File, UploadFile, WebSocket, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from revChatGPT.revChatGPT import Chatbot
from typing import Dict
from pydantic import BaseModel, Field
from deepgram import Deepgram

from services.assemblyai import upload_local_file, get_transcription, process_assembly_realtime
from services.youtube import youtube_video_download 
from services.deepgram import process_audio
from configure import ASSEMBLY_AI_KEY, OPEN_AI_EMAIL, OPEN_AI_PASSWORD, DEEPGRAM_KEY

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


# templates = Jinja2Templates(directory="./bla/templates")

@app.get("/", response_class=HTMLResponse)
def get(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.websocket("/listen")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()

    try:
        dg_client = Deepgram(DEEPGRAM_KEY)
        deepgram_socket = await process_audio(websocket, dg_client) 

        while True:
            data = await websocket.receive_bytes()
            deepgram_socket.send(data)
    except Exception as e:
        raise Exception(f'Could not process audio: {e}')
    finally:
        await websocket.close()

'''@app.websocket("/listen")
async def realtime_websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        process_assembly_realtime(websocket, ASSEMBLY_AI_KEY)
    except Exception as e:
        raise Exception(f'Could not process audio: {e}')
    finally:
        await websocket.close()'''
    


@app.get("/")
async def root():
    return {"message": "Hello World"}