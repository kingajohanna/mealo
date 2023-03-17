from fastapi import APIRouter, Request, status
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
import sys, os
sys.path.append(os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'receptek_scraper')))
from recipe_scrapers import scrape_me
from models.models import URL
import utils.utils as utils

router = APIRouter()

@router.post('/get/')
async def create_recipe(req: Request,  url: URL):
    print("pöcs")
    doc_parsed = await scrape_me(url.url)
    print(doc_parsed)
    recipe_model = jsonable_encoder(utils.convert_scraper_to_model(doc_parsed))
    print(recipe_model)

    return JSONResponse(status_code=status.HTTP_201_CREATED, content=recipe_model)