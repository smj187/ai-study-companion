FROM python:3.10

RUN apt-get -y update
RUN apt-get -y upgrade
RUN apt-get install -y ffmpeg

WORKDIR /app

COPY ./requirements.txt .

RUN pip install -r ./requirements.txt

COPY . .

EXPOSE 8000