import mongoose from "mongoose";

interface Share {
  recipe: number;
  from: string;
  id: string;
}

export interface Suggestion {
  id: number;
  date: string;
}
export interface IUser {
  id: any;
  email: string;
  share: Share[];
  suggestions: {
    cuisine: Suggestion[];
    category: Suggestion[];
    dish: Suggestion[];
  };
}

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    default: new mongoose.Types.ObjectId(),
    index: { unique: true },
  },
  email: { type: String, default: null },
  share: { type: Array, default: [] },
  suggestions: { type: Object, default: { cuisine: [], category: [] } },
});

export const User = mongoose.model<IUser>("User", userSchema, "users");
