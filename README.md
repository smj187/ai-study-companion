## run local docker

```
docker-compose up --build
```

## backend virtual environment

```
cd backend

python3 -m venv backend-env
.\backend-env\Scripts\Activate.ps1

pip3 freeze > requirements.txt

uvicorn main:app --host localhost --port 8000 --reload
```
