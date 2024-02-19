import axios from "axios";
import { Recipe } from "../models/Recipe";
import { User } from "../models/User";
import { hashCode } from "../utils/hash";
import { ContextType } from "./types";
import { v4 as uuidv4 } from "uuid";
import { deleteFile, storeFile } from "../utils/filesave";
import { getCategory, getCuisine } from "../utils/predictions";

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
        video: String
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
        video: String
    }

    type Recipes {
      recipes: [Recipe]
      categories: [String]
      cuisines: [String]
      folders: [String]
    }

    type Query {
        getRecipes: Recipes
        getRecipe(recipeId: Int!): Recipe
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
        analyzeRecipe( recipeId: Int! ): Recipe
    }
`;

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
    const user = await User.findOne({ id: uid }).lean();
    const recipe = await Recipe.findOne({ id: recipeId }).lean();

    if (recipe) return recipe;

    const apiKey = process.env.YOUTUBE_API_KEY;

    let response;

    if (url?.includes("youtube")) {
      const videoId = url?.match(/[?&]v=([^?&]+)/)![1];
      const requestUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`;
      const data = (await axios.get(requestUrl)).data.items[0].snippet;

      response = {
        data: {
          title: data.title || "",
          image: data.thumbnails.high.url || "",
          video: url || "",
          ingredients: [],
          instructions: [],
          host: "youtube.com",
          canonical_url: url || "",
          category: null,
          speed: null,
          totalTime: null,
          cookTime: null,
          prepTime: null,
          yields: null,
          nutrients: null,
          language: null,
          ratings: null,
          author: data.channelTitle || "",
          cuisine: null,
          description: data.description || "",
          reviews: null,
          siteName: "Youtube",
          calories: null,
          difficulty: null,
        },
      };
    } else {
      response = await axios.post(process.env.SCRAPER_URL as string, {
        url,
      });
    }

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
    return await Recipe.findOneAndUpdate({ id: recipeId }, body, {
      new: true,
    }).lean();
  },

  deleteRecipe: async (
    parent: any,
    args: { uid: string; recipeId: number },
    context: ContextType
  ) => {
    const { recipeId } = args;

    const recipe = await Recipe.findOne({ id: recipeId }).lean();
    const imageName = recipe?.image?.split("/").pop();

    deleteFile(imageName as string);

    return await Recipe.findOneAndDelete({ id: recipeId }).lean();
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
        ).lean()
      : await Recipe.findOneAndUpdate(
          { id: recipeId },
          { is_favorite: true },
          { new: true }
        ).lean();
  },

  folderRecipe: async (
    parent: any,
    args: { recipeId: number; folders: string[] },
    context: ContextType
  ) => {
    const { recipeId, folders } = args;
    const { uid } = context;

    let recipe = await Recipe.findOne({ id: recipeId });

    if (!recipe) return;
    return await Recipe.findOneAndUpdate(
      { id: recipeId },
      { folders },
      { new: true }
    ).lean();
  },

  addMeal: async (
    parent: any,
    args: { recipeId: number; meal: any },
    context: ContextType
  ) => {
    const { recipeId, meal } = args;

    let recipe = await Recipe.findOne({ id: recipeId }).lean();

    if (!recipe) return;

    return await Recipe.findOneAndUpdate(
      { id: recipeId },
      { meals: [...recipe.meals, { ...meal, id: uuidv4() }] },
      { new: true }
    ).lean();
  },

  removeMeal: async (
    parent: any,
    args: { recipeId: number; mealId: String },
    context: ContextType
  ) => {
    const { recipeId, mealId } = args;

    let recipe = await Recipe.findOne({ id: recipeId }).lean();

    if (recipe?.meals)
      recipe.meals = recipe?.meals.filter((m: any) => m?.id !== mealId);

    if (!recipe) return;
    return await Recipe.findOneAndUpdate(
      { id: recipeId },
      { meals: recipe?.meals },
      { new: true }
    ).lean();
  },

  analyzeRecipe: async (
    parent: any,
    args: { recipeId: number },
    context: ContextType
  ) => {
    const { recipeId } = args;

    let recipe = await Recipe.findOne({ id: recipeId });

    const response = await axios.post(process.env.ML_URL as string, {
      title: recipe?.title,
      ingredients: recipe?.ingredients,
      lang: recipe?.language || "en",
    });

    if (response.data) {
      console.log(response.data.category, response.data.cuisine);

      recipe = await Recipe.findOneAndUpdate(
        { id: recipeId },
        {
          category: getCategory(response.data.category),
          cuisine: getCuisine(response.data.cuisine),
        },
        { new: true }
      ).lean();

      await User.findOneAndUpdate(
        { id: context.uid },
        {
          $push: {
            "suggestions.category": {
              id: response.data.category,
              date: new Date(),
            },
            "suggestions.cuisine": {
              id: response.data.cuisine,
              date: new Date(),
            },
          },
        },
        { new: true }
      ).lean();
    }

    return recipe;
  },
};
