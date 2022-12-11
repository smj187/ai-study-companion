## TODOs

```
- [ ] 1 dockerfile that contains the backend+frontend to make it deployable to azure - most important!
- [ ] Short descriptions/headlines for each major functionality inside the webapp
- [x] 3rd upload option: audio link from cloud maybe? (https://azure0language0demo.blob.core.windows.net/assembly/CMiPYHNNg28_50.mp3)
- [ ] python backend api key management - including docker envrionment variables
- [ ] meaningful error messages for all input operations
- [ ] backend server url in .env file inside the web app
- [ ] tooltips for better usability understanding
- [x] change app context (bugs) with react zustand https://www.youtube.com/watch?v=sqTPGMipjHk
- [x] clean up + reafactor upload-view.tsx
```

## run local docker

```
docker-compose up --build
```

## backend virtual environment

```
cd backend

python3 -m venv backend-env
.\backend-env\Scripts\Activate.ps1
# linux: source backend-env/bin/activate

pip install -r ./requirements.txt

# pip3 freeze > requirements.txt

# rename secrets-example.py to secrets.py

uvicorn main:app --host localhost --port 8000 --reload
```

# run web app local

```
# make sure node, npm and pnpm is installed
# https://pnpm.io/installation#using-npm
npm install -g pnpm

cd web
pnpm dev
```
