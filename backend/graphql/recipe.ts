import axios from "axios";
import { Recipe } from "../src/models/Recipe";
import { User } from "../src/models/User";
import { hashCode } from "../src/utils/hash";
import { ContextType } from "./types";

// The GraphQL schema
export const recipeType = `
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
    }

    type Query {
        getRecipes: [Recipe]
    }

    type Mutation {
        addRecipe( url: String!): Recipe
        editRecipe( recipeId: Int!, body: RecipeInput! ): Recipe
        deleteRecipe( recipeId: Int! ): Recipe
        favoriteRecipe( recipeId: Int! ): Recipe
    }
`;

export const recipeQuery = {
  getRecipes: async (parent: any, args: any, context: ContextType) => {
    const { uid } = context;

    const recipes = await Recipe.find({ uid }).lean();
    return recipes;
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

    if (response && user) {
      const newRecipe = new Recipe({
        id: recipeId,
        uid: uid,
        ...response.data,
      });
      await newRecipe.save();

      user.recipes.push(recipeId);
      await user.save();

      return newRecipe;
    }
  },
  editRecipe: async (parent: any, args: { recipeId: number; body: any }) => {
    const { recipeId, body } = args;

    return await Recipe.findOneAndUpdate({ id: recipeId }, body, {
      new: true,
    });
  },
  deleteRecipe: async (
    parent: any,
    args: { uid: string; recipeId: number },
    context: ContextType
  ) => {
    const { recipeId } = args;
    const { uid } = context;

    const user = await User.findOne({ id: uid });

    if (user) {
      user.recipes = user.recipes.filter((recipeId) => recipeId !== recipeId);
      await user.save();

      return await Recipe.findOneAndDelete({ id: recipeId });
    }
  },
  favoriteRecipe: async (
    parent: any,
    args: { uid: string; recipeId: number },
    context: ContextType
  ) => {
    const { recipeId } = args;
    const { uid } = context;

    const user = await User.findOne({ id: uid });
    let recipe = await Recipe.findOne({ id: recipeId });

    if (user && recipe) {
      recipe = recipe.is_favorite
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

      user.favorites.push(recipeId);
      await user.save();

      return recipe;
    }
  },
};
