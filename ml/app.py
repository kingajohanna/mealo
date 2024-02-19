from fastapi import FastAPI
from contextlib import asynccontextmanager
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from pydantic import BaseModel
from translate import Translator

category_model_path = "./models/category"
category_model = AutoModelForSequenceClassification.from_pretrained(category_model_path)
category_tokenizer = AutoTokenizer.from_pretrained("distilbert-base-uncased")

cuisine_model_path = "./models/cuisine"
cuisine_model = AutoModelForSequenceClassification.from_pretrained(cuisine_model_path)
cuisine_tokenizer = AutoTokenizer.from_pretrained("distilbert-base-uncased")

class RecipeInput(BaseModel):
    title: str
    ingredients: list[str]
    lang: str

def translate(text: str | list[str], lang: str):
    translator = Translator(to_lang="en", from_lang=lang)
    if isinstance(text, list):
        return [translator.translate(t) for t in text]
    return translator.translate(text)  

def category(text: str) -> int:
    inputs = category_tokenizer(text, return_tensors="pt")
    outputs = category_model(**inputs)
    return int(outputs.logits.softmax(dim=-1).argmax(-1))

def cuisine(text: str) -> int:
    inputs = cuisine_tokenizer(text, return_tensors="pt")
    outputs = cuisine_model(**inputs)
    return int(outputs.logits.softmax(dim=-1).argmax(-1))

ml_models = {}

@asynccontextmanager
async def lifespan(app: FastAPI):
    ml_models["category"] = category
    ml_models["cuisine"] = cuisine
    yield
    ml_models.clear()

app = FastAPI(lifespan=lifespan)

@app.post("/predict")
async def predict(recipe_input: RecipeInput):
    title = recipe_input.title
    ingredients = recipe_input.ingredients
    lang = recipe_input.lang

    if lang != "en":
        title = translate(title,lang)
        ingredients = translate(ingredients,lang)

    ingredients_str = '. '.join(ingredients)

    text = f"{title} [SEP] {ingredients_str}".replace('.', '[SEP]')

    return {"category": ml_models["category"](text), "cuisine": ml_models["cuisine"](text)}


'''
label	category	
0	Appetizers
1	Breakfast and Brunch
2	Condiments and Sauces
3	Desserts
4	Main Dishes
5	Salads
6	Side Dishes
7	Soups
'''

'''
label	cuisine
0	American
1	Asian
2	Barbecue
3	Chinese
4	French
5	Greek
6	Indian
7	Italian
8	Mexican
9	Thai
'''