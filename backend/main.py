from fastapi import FastAPI, File, UploadFile, WebSocket, Request, Header, Body
from fastapi.middleware.cors import CORSMiddleware
from revChatGPT.revChatGPT import Chatbot
from typing import Dict, Union
from pydantic import BaseModel, Field
import nltk
import requests
import time
from pyChatGPT import ChatGPT
from services.youtube import youtube_video_download, get_video_information
from configure import ASSEMBLY_AI_KEY, OPEN_AI_EMAIL, OPEN_AI_PASSWORD
from services.assemblyai import upload_local_file, get_transcription, process_assembly_realtime
from services.youtube import youtube_video_download 
from configure import ASSEMBLY_AI_KEY, OPEN_AI_EMAIL, OPEN_AI_PASSWORD

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "https://localhost:8080", "https://professor-ai.azurewebsites.net"],
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



class YouTubeMetaRequest(BaseModel):
    url: str

@app.post("/youtube/meta")
async def youtube_meta_download(request: YouTubeMetaRequest):
    meta = get_video_information(request.url)
    return meta



@app.post("/assembly/file")
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



class RemoteFileRequest(BaseModel):
    remote_audio_url: str = Field()

@app.post("/assembly/remote")
async def remote_assembly_file(body: RemoteFileRequest = Body()):
    assembly_request_body: Dict[str, str | bool] = {
        "auto_chapters": True
    }

    data, err, sentences, paragraphs = get_transcription(body.remote_audio_url, assembly_request_body, ASSEMBLY_AI_KEY)
    return data



@app.get("/chatgpt")
async def process_chatgpt(input_text: str, generate_question: bool):
    # OpenAI.Auth(email_address="braucheaccount@protonmail.com", password="4$7$$w8&5YA4#@f5@z*#nQsAm*w$994c")#.save_access_token(access_token="", expiry=time.time() + 3600)

    # session_token = 'eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..Y075UXPI1XoUr_A3.V5r2gygHOJ7GrED6SbgSAF4yYSovggri73IBlGH-mSDVuYhhNbLEVWYDKLN_D3VP_hH80oMsPeNJV6YmNoCPLd9nAe-yXD6Cb4dPyaU_jd3gxO2LjhZ4yFPolckCfNY1pHe4V23LjhzHsc70RmaUiUeaXS47xdorL8Ss9HxJa-ixKRpJ2aiAJSdo7neHQ-ZcbeZiTO6n4b_TaAbwCNLVDOgl-hm7NKgUJvGjboSh4bF8rNW1YfnSsgr0e8WJCFpePdRsri3NXfX5hlefy4s3rom_RLeM5HqzzGAwOjvSQccVvYNBofEWIHWP-iV3kaU-ydtj3Rn9CDhZp_b1mrvy19qarSr_eyx5T4mPr9ZR1KBICAlo0vma2eN0kC1N-hJ26WOUovLh_MUaPTh0Q1jYuya22jtFCbL4JsBEiZmzgZcqSoF64eldfVjPjyo4JBdkOqPs_PQjbdI6yc52GA-PTMIVYUIlp7FgAsox45BFU4Yh79T1svI5HcBIsQ2b3AIcvbSVFEFXtMJmsWcBVB3T26S3b4-nXuZ9UGEa5bW63zCqEtqXeTyW_AWSFcbHuu-Ds8RNHNuzi4Zja8FXzrnjt2zV_IUZm80b6rTjgPiBIWnJLc_eAsFumGd_R4L5VZg9bkiFY8BZ9r0Nxi21bUz6CKf_36o4lMLLbsXpIAJhnaXWErteam5caBH01_FM6LuiShF-kbEvEJ6dRiXdyhJDljhTzteN4Nrs_CGnsmPDFfc_u3o96LxMeqmanwNJYdnaKU9KShgJpyxB8yymfCqpqpbDjib5PC0nk5xxfmOo5koFEn96qcfS-0Ono5dVP1uqn6EXvns2GZB8zTgkM5uQjYnmJcz_7U59keq0zvZqvYH57QDs2zlZSXG3RYUkaVNMW8H9iLUolWluh_fxRsNAl22qKqOLzWmVgXH4Wg8clDAy4H6Q8j9oTUeLzu18Ukdfag49Tgb5al2GQXviDC3K-mTplQeqtbLqly43mGWB0X95yrjkAV_2pCpNeaD4Vv8-n8CHppDQHmyVnLjWQztelRVVd9thTktRk3YqbntT-7zXQxHb-t1FaqmLnxMrXrR3F6qrZZzu07sa29oPdTd6jE7hUmn9Ya1Kku3VUgudEIfHqFj_6IdFvzZB81jHoW-csrK2k9kAmhImZUwPS7WQJOKanY-FXjoGjHByLeIOcAZhTmW22mbbE16jsFoXcexq2j-TXMmYWGs7A3ALOXuaSg3uz5UUGv0SnlOX-6YKa7fk1v60fgPP_ajz5a8xW0SAnjSMOzsVfybgP2ygjvs4q5kiz6mqny0aNd4pJn8gYcyk6OE2-pD68cPBcysaoHJnMjyCPOmUTWACWZbuKwP575dfua4kJqoVzQucmcb6re5PGTUF4htBs3mQY2QFbdIzv5HKtY8ThekYwjbBoqWsePcCAucQdTaYawzPcm4-aX2XSZWGGpsFy9WmZDpA1d8fCy1T-KrxWsDMfkNTVdTvSyDuGFc6HVmYeUa_6Gv24nzBLvhiLeDaAx0_s2_62Fqrq3Uph7Eq0Q300__pIDi_xSORE5C7hkPRYDFwB9b0zybq9ynMAPQ0fOCIs3BpbsGB0LxFUN3iNWGQiGXCNaCOGBJ8lJqf9HPgpFGoQqu2aQ4BKx3fpUdWImszR7TexeOb-h2H1vO9Eoo0wwWH12BVlqQXrsEP9FCiljnClHe7pjRGfAcPkkw0iD8bJXJo7Dxd5CeB6WFR4SsXPD4aV7lC7FTA4M6jiM21cAyU1kn-Sm7-hyqZFmiGvkdtXky6PPjtAl984XO3B0ydPiT8C5nldyYC_gZHD3TCB4QAJM-GmVj8ELuwakyxrS_oEFMKvoftynjmYHKUfhY9cHeFRpdlPvNJVOjElI7la_yJgWyD7AhJj9LzVWiF9bNGM-izpvs2V4Gh17b2FuGsEz89NBjZik9JxvNIwBqA_RnmlAFavhmOE9xgemIiJgEY-27WTrAJxb5B_PMXj2TeE9NtA6jD7EdEegWG0ukUxjT9WksWDZ488GRCv2Z4w3f66SB4tZBYrWUGF4DOtNzOZlC2GfAOaaRVv7eswyPHncpxUSZ-Qrjoe-_XrEcSkLqdgJ86p8xIm3VYkBtvO276YlcowvR6GD3hCmLbDhWPEwx8yji9X2PQ_zZTUnCi9jHs2ZBN_Jxf9_3Sv23anU2RLsL-JO_BjUO_5Bm4iMDLD7tbBYREEn9Bg1zpTwOhulR-6Cjy55smTAqckXrpImvTYeK5BSHb3a8kyVz8HfX-2iSdrOHbVz0vcRlIghv_oHcMf-gJzGFJcvdmcwJdqqj-Pkrk1w4GhLN4mmN0JyiGgPcpeB8w4t2OnF-qdgqKBXAaYc5lCjfKN9s1fcYY5xlD6ZNKiBk4GHA.8Wrs3mki6nAKTL1906StKw'  # `__Secure-next-auth.session-token` cookie from https://chat.openai.com/chat
    # api = ChatGPT(session_token)  # auth with session token
    # api2 = ChatGPT(session_token, conversation_id='some-random-uuid', parent_id='another-random-uuid')  # specify a conversation
    # api3 = ChatGPT(session_token, proxy='http://proxy.example.com:8080')  # specify proxy

    # resp = api.send_message('Hello, world!')
    # print(resp['message'])
    # api.refresh_auth()  # refresh the authorization token & cf cookies
    # api.reset_conversation()
    # return "jo"
    # body = {
    #     "prompt": "give a detailed question for the following information\n" + input_text,
    #     "max_tokens": 2000,
    #     "model": "text-davinci-003",
    #     "temperature": 0.77
    # }
    # response = requests.post("https://api.openai.com/v1/completions", json=body, headers={'authorization': f"Bearer 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", "content-type": "application/json"})
    # r = response.json()
    # print(r)
    config = {
        "session_token": "eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..MCQMHa0AhlFad5gy.Hi-sAcxhdKT8_w35cqPTxLKK26ZsUhlmv5He83k0bEq1lUL1qVHjcrgps0pGwT21tKpNsCm4kBTCkiXy5JwGZiYf9p7xxFg_WhTvj9L1C166vhd0D1BoGO97djiK479Q7aTjsEzsRALPx8aHBCBXnhIr0OVjB4TIzlHJvPqYLssSW2oWnDw8nGJjzAxLpT7-C-XT093vvV0-Oh4xskpWNKFfF9gZyfz_r-T05wUggddbKxJdMK8eOLzy54jfJElMvHITM_pvqoDkf5vqEWYjSHc9E645UOt6ZWU5v7XGO9sNbDhe4cPEzdrlo27L4D6tDrEeSllOfBdrhjks8nMYG1sgvka97F59HYR9xIPtcBFXo6jbxoqnZDRdJ3saG99uxodAC-aH8p2oHBQTCL2Z7494W81KHNpUitfr6hWzwCj32t7aZcWC2Sh3yqWHmY-psQyO5o-qU6w-EySlMA7O6UV1-2Xe-uhRZv6LlkVTBuwtHQAaKa-MYkbTZMEM8FL5Rh2ydicjjqO8EOOc_bVDBDrjDcODks01IjlucrbDYe8n7Qk07tbByWX7HFKyuElbEAYubceEs5Hq175WSc3MaNf2VLBiBeBPGi6ZENU3vzcJizJiUYhmKrrtP4hFVGodtjEumTg2rxC1hRy9LOu8PNWr_DtGTfJE9jysFD-qkrgvp8zVdb1GuBJ122P22dJZtoUvpAwTjy_4MfHfWZV0X4J-zTEWAKgZznf6cmvt2gWgYevld3pntZnEhFmDzPbHJYwF5-69cZOhcVae6VQLM-hNHIpCOQj5jlW-pauiX16OkRsMv0IQgl0sh3gwtEGYzOl5q5s0B-fvm0Sa0X9vaGtgHAyD7O-Q3Uq8GgsfZXRHwxiPGoWPqHw6RAi81JkSdZ5d5rZ-ugdBZqWyjPXFj6v3-dq7cpEM_ZMbADRuJ_H7BSDr07NLm7UINXUyICeyH38QWlYYD4Wvn4X3OEU1QcpcgIg3FmJjRHj8wY5YFIufUmazptvTRGm27npjAo1u0pN9TIo1dhZ74mS1gwOJxE4u8b2s7rzJY7oy5UwcKWqdKI_6FKqVsdsOMRjD4LauHvD4YumKRHvB9MrkYlmk0XsXNuJj54sQf-2J63tiDotuvvVvN3cX3hKETA6RE6nnVb3-pWvB-hlm0xWJ_0BdCjgkFFS8l4-peKftEiUit0GY433545G7ND0x9clDPY20zQYwl-TIrMRkDKa-dNItoPkXvGPlBM2gygMecLMfoIgMUqVllbYuT2BneEQJxR4MJvsOAGIi5lwZRN9FIZkCad9rbiuVNrGazqr7k11xEMVID3ytZA_8W0F2a7GqPH6up5G0OTIbHe6MXfEKNeEYy_G_Zy-vBuKf_5l62pRgfeDSPL8WRAqNQkMx28kfrcWsV2aByvTnnnXDdKfubCb5uw1LQ3OTVwuGCcOSYBx9rNEBi_KVHdZeNkB-YpGTSJQJcCnL3VuW-wurWIeGwkv5M3ojyWL2cAtf1dPyKdwRgvCB4kXJzDmVSj6E2e9xS3thWZAakIRGvu_nchNWUL5ZsfjeRm7ScnZ_6VwE5nkpCHM3_nDwlUf8bAAP-Yoe58g-Mhip0mvYLrOhHZi9gEXODarZgUqsA-65oo-Shj2leNg9jjIeJQYbYkz0WJwA9wzYXrqyUPTxdYDZ0dFqIToT-4xGk3we7U69D9olCD2uAEIRtu26u68El2IHk9BVDp_gIA9cvfnMeUOOEOT_ZGoKeMvZObSysA8gjesVwxL5vVGzp0R2MpfaUPyvOjgoJ2CpFWM1eXj3BYE3bXXTBfVN-hxXbtg9hx8GbjQnIjP_BHKD1qOg3Wp2RdgkJMkR_nn1D7ISU_VglmqCEk8Os9cdjLJ7NczKv4dvgYcJRuRP72yucHftgR1dyOxx8qG5KIWs1dfsnclJzxsIBwOyS9Z7hpbN2G0vHnXzezw6xTNEiNLipDLdQBS90qCwZ_0EFYicwt71VQHoo4so4p8PemnauAqygcqPR1Qe2j8DxmpYH_pbV2lg5MOrFg9jAku1i7-kpQFZh-qI_TRHUaNGSH01ehbnpoN83TLoTAn1fKxpDUVLmJA3Q6mVM0IdUB56KjQHlPJi0EegzV3_qLv0tYz8GZchT8cLvpdSM-hAkSwq0yEgJdMcxAYq3BbDhajBmSjrOktUiW1ir05kdSpzLg6yYecY93RNmYB3vegug3MCiGdYJszBDIU0zKrCdKInEGvZyByca09C9XunWQ3GASB_VfPaO64n-1ey31E1VEzzsPrpkQSgxBDA3-GEb7x0xyZ_AkVOaZrRI6I3APvaA6i6RIWUZe1Xjoxy1YQVSTcchMNuPZDVpeeFD9AIiVK0kmgXWpuAdQtpw18xoVMNPP1hjRo.Pwo2l_N3mVgZccSzcXO_LQ",
        "cf_clearance": "4i9rZj_BAHo9SMjYoezdtSnTeN002czqOxF2O0DjdsA-1670846440-0-160",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:107.0) Gecko/20100101 Firefox/107.0"
    }

    chatbot = Chatbot(config, conversation_id=None, debug=True)
    if generate_question:
        input_text = "give a detailed question for the following information\n" + input_text
    print(input_text)
    response = chatbot.get_chat_response(input_text, output="text")
    print(response) 
    # return {
    #     "message": r["choices"][0]["text"],
    #     "conversation_id": "ef90ef78-b93d-440b-ad3b-238f31600a2a",
    #     "parent_id": "f9ba40e8-aece-47b8-94a4-5925c8f20233"
    # }


@app.get("/validate")
async def validate_answer(input_answer: str, ground_truth1: str, ground_truth2: str, threshold: float = 0.45):
    score = nltk.translate.bleu_score.sentence_bleu([ground_truth1, ground_truth2], input_answer, weights = [1])
    print("correctness score:", score)
    return score >= threshold


@app.get("/")
async def root():
    return {"message": "Hello World"}
    
@app.get("/v2")
async def root():
    return {"message": "v2 is live"}