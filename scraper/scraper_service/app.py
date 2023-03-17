from fastapi import FastAPI, status
from fastapi.responses import JSONResponse
import configparser
import routes
import logging

config = configparser.ConfigParser()
config.read('./config.ini')

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

app.include_router(routes.router)

@app.get('/')
async def hello():
    return JSONResponse(status_code=status.HTTP_200_OK, content="hello")