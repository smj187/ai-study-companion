import requests
import time
from typing import Dict
import base64
import json
import websockets
import asyncio 

from fastapi import FastAPI, Request, WebSocket


UPLOAD_ENDPOINT = "https://api.assemblyai.com/v2/upload"
TRANSCRIPTION_ENDPOINT = "https://api.assemblyai.com/v2/transcript"
REALTIME_ENDPOINT = "wss://api.assemblyai.com/v2/realtime/ws?sample_rate=16000"
CHUNK_SIZE = 5_242_880  # 5MB


# upload local file to assembly ai backend
# https://www.assemblyai.com/docs/walkthroughs#uploading-local-files-for-transcription
def upload_local_file(file: any, x_api_key: str) -> str:
    headers = { "authorization" : x_api_key }

    upload_response = requests.post(UPLOAD_ENDPOINT, headers = headers, data = file)
    return upload_response.json()["upload_url"]


# upload a file from a remote URL
def upload_remote_url(audio_url: str, x_api_key: str) -> str:
    headers = { "authorization" : x_api_key }
    body = {
        "audio_url": audio_url
    }

    upload_response = requests.post(UPLOAD_ENDPOINT, headers= headers, json = body)
    return upload_response.json()["upload_url"]


# do the actual transcription
# https://www.assemblyai.com/docs/walkthroughs#submitting-files-for-transcription
def transcribe(audio_url: str, request_body: Dict[str, str | bool], x_api_key: str) -> str:
    headers = { 
        "authorization" : x_api_key,
        "content-type": "application/json"
    }
    # summarization
    # body = {
    #     "audio_url" : audio_url,
    #     "summarization": True,
    #     "summary_model": "informative",
    #     "summary_type": "bullets",
    # }

    # # auto chapters
    # body = {
    #     "audio_url" : audio_url,
    #     "auto_highlights": True,
    #     "iab_categories": True,
    #     "sentiment_analysis": True,
    #     'auto_chapters': True,
    #     "entity_detection": True,
    #     "content_safety": True,
    #     "filter_profanity": True,
    #     "disfluencies": True, # filler words
    #     "speaker_labels": True,
    #     "language_detection": True,
    #     "punctuate": False,
    #     "format_text": False
    # }

    # custom vocabulary
    # body = {
    #     "audio_url" : audio_url,
    #     "word_boost": ["javascript"],
    #     "boost_param": "high"
    # }

    body = { "audio_url": audio_url, **request_body  }

    transcript_response = requests.post(TRANSCRIPTION_ENDPOINT, json = body, headers = headers)
    print("\n\n")
    print(transcript_response.json())
    print("\n\n")
    return transcript_response.json()["id"]


# check if transcription is complete
# https://github.com/AssemblyAI-Examples/python-speech-recognition-course/blob/main/02-simple-speech-recognition/api_02.py
def poll(transcript_id: str, x_api_key: str):
    headers = {
        "authorization" : x_api_key,
        "content-type": "application/json"
    }

    polling_response = requests.get(f"{TRANSCRIPTION_ENDPOINT}/{transcript_id}", headers = headers)
    return polling_response.json()

# returns the result
def get_transcription(url: str, request_body: Dict[str, str | bool], x_api_key: str):
    transcribe_id = transcribe(url, request_body, x_api_key)
    while True:
        data = poll(transcribe_id, x_api_key)
        print(data)
        if data["status"] == "completed":
            sentence_response = requests.get(f"{TRANSCRIPTION_ENDPOINT}/{transcribe_id}/sentences")
            paragraphs_response = requests.get(f"{TRANSCRIPTION_ENDPOINT}/{transcribe_id}/sentences")
            print(f"{TRANSCRIPTION_ENDPOINT}/{transcribe_id}/sentences")
            print(f"{TRANSCRIPTION_ENDPOINT}/{transcribe_id}/paragraphs")
            return data, None, sentence_response.json(), paragraphs_response.json()
        elif data["status"] == "error":
            return data, data["error"]
            
        print("waiting for 3 seconds")
        time.sleep(3)


async def forward(ws_a: WebSocket, ws_b: websockets.WebSocketClientProtocol):
    while True:
        stream = await ws_a.receive_bytes()
        data = base64.b64encode(stream)
        print(data)
        json_data = json.dumps({"audio_data":str(stream)})
        await ws_b.send(json_data)
        await asyncio.sleep(0.01)


async def reverse(ws_a: WebSocket, ws_b: websockets.WebSocketClientProtocol):
    while True:
        data = await ws_b.recv()
        print("assembly:", data)
        data = json.loads(data)
        if 'text' in data:
            result = data['text']

            if json.loads(data)['message_type'] == 'FinalTranscript':
                await ws_a.send_text(result)


async def process_assembly_realtime(ws_a: WebSocket, key):
    async with websockets.connect(
        REALTIME_ENDPOINT,
        extra_headers=(("Authorization", key),),
        ping_interval=5,
        ping_timeout=20
    ) as _ws:
        fwd_task = asyncio.create_task(forward(ws_a, _ws))
        rev_task = asyncio.create_task(reverse(ws_a, _ws))
        await asyncio.gather(fwd_task, rev_task)