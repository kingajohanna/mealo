import mongoose from "mongoose";

export interface IUser {
  id: any;
  email: string;
}

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    default: new mongoose.Types.ObjectId(),
    index: { unique: true },
  },
  email: { type: String, default: null },
});

export const User = mongoose.model<IUser>("User", userSchema, "users");
