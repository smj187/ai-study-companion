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
