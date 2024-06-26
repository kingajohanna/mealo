from fastapi import FastAPI, status, Request
from fastapi.responses import JSONResponse
import logging
from fastapi.encoders import jsonable_encoder
import sys, os
sys.path.append(os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'recipe-scrapers')))
from recipe_scrapers import scrape_me
from models.models import URL
import utils.utils as utils

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

@app.post('/')
async def create_recipe(req: Request,  url: URL):
    try:
        doc_parsed = await scrape_me(url.url)
    except Exception:
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)
    print(doc_parsed.title)
    recipe_model = jsonable_encoder(utils.convert_scraper_to_model(doc_parsed))
    print(recipe_model)

    return JSONResponse(status_code=status.HTTP_200_OK, content=recipe_model)