FROM python:3.10
WORKDIR /app
ENV PORT=3002
EXPOSE ${PORT}
COPY . .
RUN pip3 install -r requirements.txt
ENTRYPOINT uvicorn app:app --reload --host 0.0.0.0 --port ${PORT}
