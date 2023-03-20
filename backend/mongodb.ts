import mongoose from "mongoose";

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.DB_URL as string);
}

const recipeScheme = new mongoose.Schema({
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
  instuctions: { type: Array, default: null },
  ratings: { type: String, default: null },
  author: { type: String, default: null },
  cuisine: { type: String, default: null },
  description: { type: String, default: null },
  reviews: { type: Array, default: null },
  siteName: { type: String, default: null },
});

export const Recipe = mongoose.model("Recipe", recipeScheme, "recipes");
