from fastapi import FastAPI
from contextlib import asynccontextmanager
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from pydantic import BaseModel
from translate import Translator

max_seq_length = 512

category_model_path = "./models/category"
category_model = AutoModelForSequenceClassification.from_pretrained(category_model_path)

cuisine_model_path = "./models/cuisine"
cuisine_model = AutoModelForSequenceClassification.from_pretrained(cuisine_model_path)

dish_model_path = "./models/dish"
dish_model = AutoModelForSequenceClassification.from_pretrained(dish_model_path)

tokenizer = AutoTokenizer.from_pretrained("distilbert-base-uncased")

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
    inputs = tokenizer(text, return_tensors="pt")
    outputs = category_model(**inputs)
    return int(outputs.logits.softmax(dim=-1).argmax(-1))

def cuisine(text: str) -> int:
    inputs = tokenizer(text, return_tensors="pt")
    outputs = cuisine_model(**inputs)
    return int(outputs.logits.softmax(dim=-1).argmax(-1))

def dish(text: str) -> int:
    inputs = tokenizer(text, return_tensors="pt")
    outputs = dish_model(**inputs)
    return int(outputs.logits.softmax(dim=-1).argmax(-1))

ml_models = {}

@asynccontextmanager
async def lifespan(app: FastAPI):
    ml_models["category"] = category
    ml_models["cuisine"] = cuisine
    ml_models["dish"] = dish
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

    return {"category": ml_models["category"](text), "cuisine": ml_models["cuisine"](text), "dish": ml_models["dish"](text)}


'''
la	category
0	Appetizers
1	Beverages
2	Breakfast and Brunch
3	Condiments and Sauces
4	Desserts
5	Main Dishes
6	Salads
7	Side Dishes
8	Soups
'''

'''
la	cuisine
0	American
1	Asian
2	Barbecue
3	Cajun & Creole
4	Chinese
5	Cuban
6	French
7	German
8	Greek
9	Hawaiian
10	Hungarian
11	Indian
12	Irish
13	Italian
14	Japanese
15	Mediterranean
16	Mexican
17	Moroccan
18	Portuguese
19	Southwestern
20	Spanish
21	Swedish
22	Thai
'''

'''
la	dish	
0	antipasto
1	burger
2	burrito
3	cake
4	casserole
5	cheesecake
6	chili
7	chowder
8	cobbler
9	cookies
10	crepes
11	cupcake
12	curry
13	donut
14	duck
15	dumpling
16	fish+and+chips
17	fudge
18	gumbo
19	ice+cream
20	lasagna
21	lobster
22	meatloaf
23	oysters
24	paella
25	pancakes
26	pasta
27	pie
28	pizza
29	pork+chops
30	ramen
31	ribs
32	roast+chicken
33	salad
34	salmon
35	sandwich
36	soup
37	steak
38	stir+fry
39	sushi
40	tacos
41	tart
42	turkey
43	wings
'''