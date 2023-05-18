import mongoose from "mongoose";

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
