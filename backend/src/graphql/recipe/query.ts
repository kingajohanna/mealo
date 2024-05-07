import { Recipe } from "../../models/Recipe";
import { User } from "../../models/User";
import {
  fetchAndMergeRecipeSuggestions,
  getSearchResults,
  sortByDateDesc,
} from "../../utils/predictions";
import { ContextType } from "../types";

export const recipeQuery = {
  getRecipes: async (parent: any, args: any, context: ContextType) => {
    const { uid } = context;

    const recipes = (await Recipe.find({ uid }).lean()).reverse();

    const categories: string[] = [];
    const cuisines: string[] = [];

    const uniqueFolders = new Set<string>();

    recipes?.forEach((recipe: any) => {
      if (recipe.category && !categories.includes(recipe.category)) {
        categories.push(recipe.category);
      }
      if (
        recipe.cuisine &&
        !cuisines.includes(recipe.cuisine) &&
        !categories.includes(recipe.cuisine)
      ) {
        cuisines.push(recipe.cuisine);
      }
      if (recipe.folders) {
        recipe.folders.forEach((folder: string) => {
          uniqueFolders.add(folder);
        });
      }
    });

    const folders = Array.from(uniqueFolders);
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
      const sortedCuisine = sortByDateDesc(user.suggestions.cuisine)?.slice(
        0,
        PREDICT
      );
      const sortedCategory = sortByDateDesc(user.suggestions.category)?.slice(
        0,
        PREDICT
      );
      const sortedDish = sortByDateDesc(user.suggestions.dish)?.slice(
        0,
        PREDICT
      );

      const cuisineIds = sortedCuisine?.map((s) => s.id);
      const categoryIds = sortedCategory?.map((s) => s.id);
      const dishIds = sortedDish?.map((s) => s.id);

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

      return {
        cuisine: cuisineArray.sort(
          (a: any, b: any) => b.recipes.length - a.recipes.length
        ),
        dish: dishArray.sort(
          (a: any, b: any) => b.recipes.length - a.recipes.length
        ),
      };
    }
  },

  getSearchResults: async (
    parent: any,
    args: {
      cuisine: number[];
      category: number[];
      dish: number[];
      title: string;
    },
    context: ContextType
  ) => {
    const { category, dish, cuisine, title } = args;

    return await getSearchResults(category, dish, cuisine, title);
  },
};
