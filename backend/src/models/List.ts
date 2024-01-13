import mongoose from "mongoose";

export interface ListItem {
  id: string;
  name: string;
  amount: string;
  completed: boolean;
}

export interface IList {
  id: string;
  uid: string;
  list: ListItem[];
}

const listSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    default: new mongoose.Types.ObjectId(),
    index: { unique: true },
  },
  uid: { type: String, required: true, default: null },
  list: { type: Array, default: null },
});

export const List = mongoose.model<IList>("List", listSchema, "lists");
