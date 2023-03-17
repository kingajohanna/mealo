FROM python:3.10-alpine
WORKDIR /app
ENV PORT=3001
EXPOSE ${PORT}
COPY scraper_service .
COPY receptek_scraper .
RUN pip3 install -r requirements.txt
ENTRYPOINT uvicorn app:app --reload --host 0.0.0.0 --port ${PORT}
