import axios from "axios";
import { Recipe } from "../models/Recipe";
import { User } from "../models/User";
import { hashCode } from "../utils/hash";
import { ContextType } from "./types";
import { v4 as uuidv4 } from "uuid";
import { deleteFile, storeFile } from "../utils/filesave";

export const recipeType = `
    scalar Upload

    input MealInput {
      meal: String
      day: String
    }

    input RecipeInput {
        host: String
        canonical_url: String
        title: String
        category: String
        speed: String
        totalTime: String
        cookTime: String
        prepTime: String
        yields: String
        image: String
        nutrients: [String]
        language: String
        ingredients: [String]
        instructions: [String]
        ratings: String
        author: String
        cuisine: String
        description: String
        reviews: [String]
        siteName: String
        is_favorite: Boolean
        calories: String
        difficulty: String
        folders: [String]
        meals: [MealInput]
    }

    type Meal {
      meal: String
      day: String
      id: String
    }

    type Recipe {
        id: Int
        uid: String
        host: String
        canonical_url: String
        title: String
        category: String
        speed: String
        totalTime: String
        cookTime: String
        prepTime: String
        yields: String
        image: String
        nutrients: String
        language: String
        ingredients: [String]
        instructions: [String]
        ratings: String
        author: String
        cuisine: String
        description: String
        reviews: [String]
        siteName: String
        is_favorite: Boolean
        calories: String
        difficulty: String
        folders: [String]
        meals: [Meal]
    }

    type Recipes {
      recipes: [Recipe]
      categories: [String]
      cuisines: [String]
      folders: [String]
    }

    type Query {
        getRecipes: Recipes
    }

    type Mutation {
        addRecipe( url: String!): Recipe
        addOcrRecipe( recipe: RecipeInput, image: Upload ): Recipe
        editRecipe( recipeId: Int!, body: RecipeInput! ): Recipe
        deleteRecipe( recipeId: Int! ): Recipe
        favoriteRecipe( recipeId: Int! ): Recipe
        folderRecipe( recipeId: Int!, folders: [String] ): Recipe
        addMeal( recipeId: Int!, meal: MealInput ): Recipe
        removeMeal( recipeId: Int!, mealId: String ): Recipe
    }
`;

export const recipeQuery = {
  getRecipes: async (parent: any, args: any, context: ContextType) => {
    const { uid } = context;

    const recipes = await Recipe.find({ uid }).lean();

    const categories: string[] = ["All"];
    const cuisines: string[] = ["All"];
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
};

export const recipeMutation = {
  addRecipe: async (
    parent: any,
    args: { url: string },
    context: ContextType
  ) => {
    const { url } = args;
    const { uid } = context;

    const recipeId = hashCode(url + uid);
    const user = await User.findOne({ id: uid });

    const response = await axios.post(process.env.SCRAPER_URL as string, {
      url,
    });

    console.log(response.data);

    if (response && user) {
      const newRecipe = new Recipe({
        id: recipeId,
        uid: uid,
        ...response.data,
      });
      await newRecipe.save();

      return newRecipe;
    }
  },
  addOcrRecipe: async (
    parent: any,
    args: { recipe: any; image: any },
    context: ContextType
  ) => {
    const { recipe, image } = args;
    const { uid } = context;

    const getImage = async () => {
      if (!image) return {};
      const img = await image;

      const saved: any = await storeFile(img);
      return { image: saved.dbPath };
    };

    return await Recipe.create({
      ...recipe,
      ...(await getImage()),
      uid,
      id: hashCode(recipe.title.replace(" ", "") + uid),
    });
  },

  editRecipe: async (parent: any, args: { recipeId: number; body: any }) => {
    const { recipeId, body } = args;

    console.log(body);

    const rec = await Recipe.findOneAndUpdate({ id: recipeId }, body, {
      new: true,
    });
    console.log(rec);

    return rec;
  },

  deleteRecipe: async (
    parent: any,
    args: { uid: string; recipeId: number },
    context: ContextType
  ) => {
    const { recipeId } = args;

    const recipe = await Recipe.findOne({ id: recipeId });
    const imageName = recipe?.image?.split("/").pop();

    deleteFile(imageName as string);

    return await Recipe.findOneAndDelete({ id: recipeId });
  },

  favoriteRecipe: async (
    parent: any,
    args: { recipeId: number },
    context: ContextType
  ) => {
    const { recipeId } = args;

    let recipe = await Recipe.findOne({ id: recipeId });

    return recipe?.is_favorite
      ? await Recipe.findOneAndUpdate(
          { id: recipeId },
          { is_favorite: false },
          { new: true }
        )
      : await Recipe.findOneAndUpdate(
          { id: recipeId },
          { is_favorite: true },
          { new: true }
        );
  },

  folderRecipe: async (
    parent: any,
    args: { recipeId: number; folders: string[] },
    context: ContextType
  ) => {
    const { recipeId, folders } = args;
    const { uid } = context;

    let recipe = await Recipe.findOne({ id: recipeId });

    console.log(folders);

    if (!recipe) return;
    return await Recipe.findOneAndUpdate(
      { id: recipeId },
      { folders },
      { new: true }
    );
  },

  addMeal: async (
    parent: any,
    args: { recipeId: number; meal: any },
    context: ContextType
  ) => {
    const { recipeId, meal } = args;

    let recipe = await Recipe.findOne({ id: recipeId });

    if (!recipe) return;
    console.log(meal);

    return await Recipe.findOneAndUpdate(
      { id: recipeId },
      { meals: [...recipe.meals, { ...meal, id: uuidv4() }] },
      { new: true }
    );
  },

  removeMeal: async (
    parent: any,
    args: { recipeId: number; mealId: String },
    context: ContextType
  ) => {
    const { recipeId, mealId } = args;

    let recipe = await Recipe.findOne({ id: recipeId });

    if (recipe?.meals)
      recipe.meals = recipe?.meals.filter((m: any) => m?.id !== mealId);

    console.log(recipe?.meals);

    if (!recipe) return;
    return await Recipe.findOneAndUpdate(
      { id: recipeId },
      { meals: recipe?.meals },
      { new: true }
    );
  },
};
