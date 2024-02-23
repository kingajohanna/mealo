import { Recipe } from "../../models/Recipe";
import { RecipeList } from "../../models/RecipeList";
import { User } from "../../models/User";
import {
  fetchAndMergeRecipeSuggestions,
  sortByDateDesc,
} from "../../utils/predictions";
import { ContextType } from "../types";

export const recipeQuery = {
  getRecipes: async (parent: any, args: any, context: ContextType) => {
    const { uid } = context;

    const recipes = await Recipe.find({ uid }).lean();

    const categories: string[] = [];
    const cuisines: string[] = [];
    const folders: string[] = [];

    recipes?.forEach((recipe: any) => {
      if (recipe.category && !categories.includes(recipe.category)) {
        categories.push(recipe.category);
      }
      if (recipe.cuisine && !cuisines.includes(recipe.cuisine)) {
        cuisines.push(recipe.cuisine);
      }
      if (recipe.folders) {
        recipe.folders.forEach((folder: string) => {
          if (!folders.includes(folder)) {
            folders.push(folder);
          }
        });
      }
    });
    folders.sort();

    return { recipes, categories, cuisines, folders };
  },
  getRecipe: async (
    parent: any,
    args: { recipeId: number },
    context: ContextType
  ) => {
    const { recipeId } = args;

    return await Recipe.findOne({ id: recipeId }).lean();
  },
  getSuggestions: async (parent: any, args: any, context: ContextType) => {
    const { uid } = context;
    const PREDICT = 10;

    const user = await User.findOne({ id: uid }).lean();

    if (user) {
      const sortedCuisine = sortByDateDesc(user.suggestions.cuisine).slice(
        0,
        PREDICT
      );
      const sortedCategory = sortByDateDesc(user.suggestions.category).slice(
        0,
        PREDICT
      );
      const sortedDish = sortByDateDesc(user.suggestions.dish).slice(
        0,
        PREDICT
      );

      const cuisineIds = sortedCuisine.map((s) => s.id);
      const categoryIds = sortedCategory.map((s) => s.id);
      const dishIds = sortedDish.map((s) => s.id);

      const cuisineArray = await fetchAndMergeRecipeSuggestions(
        cuisineIds,
        "cuisine",
        categoryIds
      );
      const dishArray = await fetchAndMergeRecipeSuggestions(
        dishIds,
        "dish",
        categoryIds
      );

      return { cuisine: cuisineArray, dish: dishArray };
    }
  },
};
