import mongoose from "mongoose";

export interface IRecipe {
  id: any;
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
  ingredients: any[];
  instuctions: any[];
  ratings: string;
  author: string;
  cuisine: string;
  description: string;
  reviews: any[];
  siteName: string;
  is_favorite: boolean;
}

const recipeSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    default: new mongoose.Types.ObjectId(),
    index: { unique: true },
  },
  uid: {
    type: String,
    required: true,
    default: new mongoose.Types.ObjectId(),
    index: { unique: false },
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
  is_favorite: { type: Boolean, default: null },
});

export const Recipe = mongoose.model<IRecipe>(
  "Recipe",
  recipeSchema,
  "recipes"
);
