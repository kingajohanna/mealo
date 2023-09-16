# mealo

req:

- python 3.11
- venv

to run scrape service:
python3 -m venv ./venv

cd scraper/scraper_service && source ./venv/bin/activate && pip3 install -r requirements.txt && uvicorn app:app --reload --host 127.0.0.1 --port 3001
