import models.models as models
from typing import Any


def convert_scraper_to_model(scraper: Any) -> models.RecipeModel:
    scraper_methods = {'host': scraper.host, 'canonical_url': scraper.canonical_url, 'title': scraper.title,
                       'category': scraper.category, 'totalTime': scraper.total_time, 'cookTime': scraper.cook_time,
                       'prepTime': scraper.prep_time, 'yields': scraper.yields, 'image': scraper.image, 'nutrients': scraper.nutrients,
                       'language': scraper.language, 'ingredients': scraper.ingredients, 'instructions': scraper.instructions_list,
                       'ratings': scraper.ratings, 'author': scraper.author, 'cuisine': scraper.cuisine, 'description': scraper.description,
                       'reviews': scraper.reviews, 'siteName': scraper.site_name, 'video': scraper.video}
    scraper_dict = {}
    for k, v in scraper_methods.items():
        try:
            scraper_dict[k] = v()
        except Exception:
            scraper_dict[k] = None
    scraper_dict = fill_recipe_speed(scraper_dict)
    return models.RecipeModel.parse_obj(scraper_dict)


def fill_recipe_speed(recipe: dict) -> dict:
    if (tt := recipe['totalTime']) is not None:
        if int(tt) <= 45:
            recipe['speed'] = models.SpeedEnum.FAST
        elif int(tt) <= 120:
            recipe['speed'] = models.SpeedEnum.MODERATE
        else:
            recipe['speed'] = models.SpeedEnum.SLOW
    else:
        recipe['spped'] = models.SpeedEnum.UNDEFINED
    return recipe
