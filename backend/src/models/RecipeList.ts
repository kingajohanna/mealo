import mongoose from "mongoose";

interface Prediction {
  dish: number;
  cuisine: number;
  category: number;
}

export interface IRecipeList {
  id: number;
  host: string;
  canonical_url: string;
  title: string;
  category: string;
  speed: string;
  totalTime: string;
  cookTime: string;
  prepTime: string;
  yields: string;
  image: string;
  nutrients: any[];
  language: string;
  ingredients: string[];
  instuctions: string[];
  ratings: string;
  author: string;
  cuisine: string;
  description: string;
  reviews: string[];
  siteName: string;
  calories: string;
  difficulty: string;
  folders: string[];
  video: string;
  dish: string;
  predict: Prediction;
}

const recipeSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    default: new mongoose.Types.ObjectId(),
    index: { unique: true },
  },
  host: { type: String, default: null },
  canonical_url: { type: String, default: null },
  title: { type: String, default: null },
  category: { type: String, default: null },
  speed: { type: String, default: null },
  totalTime: { type: String, default: null },
  cookTime: { type: String, default: null },
  prepTime: { type: String, default: null },
  yields: { type: String, default: null },
  image: { type: String, default: null },
  nutrients: { type: Array, default: null },
  language: { type: String, default: null },
  ingredients: { type: Array, default: null },
  instructions: { type: Array, default: null },
  ratings: { type: String, default: null },
  author: { type: String, default: null },
  cuisine: { type: String, default: null },
  description: { type: String, default: null },
  reviews: { type: Array, default: null },
  siteName: { type: String, default: null },
  calories: { type: String, default: null },
  difficulty: { type: String, default: null },
  folders: { type: Array, default: null },
  video: { type: String, default: null },
  dish: { type: String, default: null },
  predict: { type: Object, default: null },
});

export const RecipeList = mongoose.model<IRecipeList>(
  "RecipeList",
  recipeSchema,
  "recipesCollection"
);
