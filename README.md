# mealo

req:

- python 3.11
- venv

to run scrape service:
cd scraper/scraper_service && pip3 install -r requirements.txt && source ./venv/bin/activate && uvicorn app:app --reload --host 0.0.0.0 --port 3001
