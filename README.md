# mealo

### Frontend

- `cd frontend`
- `npm i` - install dependecies
- `npm run android` - build android
- `npm run ios` - build ios
- `npm run start` - start metro
- `npm run lint` - check lint errors

### Backend

- `cd backend`
- `npm i` - install dependecies
- `npm run dev` - run with auto-reload
- `npm run start` - compile and run backend

### Bing-chat

- `cd bing-chat`
- `npm run dev` - run with auto-reload
- `npm run start` - run bing-chat service

### Scraper

- `cd scraper`
- `git clone --recurse-submodules https://github.com/kingajohanna/recipe-scrapers` - clone submodules

- `cd scraper_service`
- `python3 -m venv ./venv` - create venv
- `source ./venv/bin/activate` - activate venv
- `pip3 install -r requirements.txt` - install dependecies
- `cd scraper_service && uvicorn app:app --reload --host 127.0.0.1 --port 3001` - run service

### ML predicter

- `cd ml`

- models: unzip files from https://drive.google.com/file/d/13YgzKSxSHEWLd6eIkEiuvZJdu-AvmGgm/view?usp=sharing to ml/models

- `python3 -m venv ./venv` - create venv
- `source ./venv/bin/activate` - activate venv
- `pip3 install -r requirements.txt` - install dependecies
- `uvicorn app:app --reload --host 127.0.0.1 --port 3002` - run service

## Docker

- `docker-compose up`
