import mongoose from "mongoose";

main().catch((err) => console.log(err));

async function main() {
  console.log(process.env.DB_URL as string);
  await mongoose.connect(process.env.DB_URL as string);
}

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
}

const recipeScheme = new mongoose.Schema({
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

export const Recipe = mongoose.model("Recipe", recipeScheme, "recipes");

const userScheme = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    default: new mongoose.Types.ObjectId(),
    index: { unique: true },
  },
  email: { type: String, default: null },
  recipes: { type: Array, default: null },
  favorites: { type: Array, default: null },
});

export const User = mongoose.model("User", userScheme, "users");
