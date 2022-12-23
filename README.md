# This project was submitted to the AssemblyAI 2022 Hackathon

## Inspiration

The problem with learning something, whether it is in school, university or generally in life often is o keep focused, motivated and disciplined. Many times the given lectures are just too extensive and it seems impossible to get through them or even get started. Further, can it be difficult to prove the newly learned knowledge, especially in a way that exactly fits the given needs. Some questions always will stay unanswered and demand elaborate research. All in all, it just would be awesome to have a tool that summarizes your study material and tests your knowledge by asking you individualized questions. On top of that, it would be able to discuss any subject and answer any further questions. Addressing these issues we present you Professor.ai: Welcome your personalized study companion.

## How does it work?

Video/Audio gets analyzed by AssemblyAI. This gives us chapterization including summarization.
Based on the summaries of the different chapters, ChatGPT generates suitable questions for it.
Based on the questions we also generate a number of different answer possibilities per question via ChatGPT.
To check if a user correctly answers a question, we again transcribe the audio input (microphone) via AssemblyAI. We assign a correctness score to the input text based on the computation of the BLEU score (NLP) with the corpus of all ground-truth answers.

## What's next for Professor.ai

More variety in questions and answers.
Provide a custom chat function with ChatGPT for in-depth explanations of questions.

Reference: [Official Devpost Thread](https://devpost.com/software/professor-ai)

---

### Setup

Please provide your API credentials in `backend/configure.py`.

### run local docker

```
docker-compose up --build
```

### backend virtual environment

```
cd backend

python3 -m venv backend-env
.\backend-env\Scripts\Activate.ps1
# linux: source backend-env/bin/activate
pip3 freeze > requirements.txt
pip install -r ./requirements.txt

uvicorn main:app --host localhost --port 8000 --reload
```

### run web app local

```
# make sure node, npm and pnpm is installed
# https://pnpm.io/installation#using-npm
npm install -g pnpm

cd web
pnpm install
pnpm dev
```
