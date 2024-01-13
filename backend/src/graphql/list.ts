import { List } from "../models/List";
import { ContextType } from "./types";
import { v4 as uuidv4 } from "uuid";

export const listType = `
  type ListItem {
    id: String
    name: String
    amount: String
    completed: Boolean
  }

  type List {
    id: String
    uid: String
    list: [ListItem]
  }

  type Query {
    getList: List
  }

  type Mutation {
    addToList(name: String!, amount: String!): List
    completeTask(id: String!, currentCompleted: Boolean!): List
  }
`;

export const listQuery = {
  getList: async (parent: any, args: any, context: ContextType) => {
    const { uid } = context;
    const list = await List.findOne({ uid: uid }).exec();
    return list;
  },
};

export const listMutation = {
  addToList: async (
    parent: any,
    args: { name: string; amount: string },
    context: ContextType
  ) => {
    const { uid } = context;

    try {
      const list = await List.findOneAndUpdate(
        { uid: uid },
        {
          $push: {
            list: {
              id: uuidv4(),
              name: args.name,
              amount: args.amount,
              completed: false,
            },
          },
        },
        { new: true, upsert: true }
      );

      return list;
    } catch (error) {
      console.error("Error adding item to the list:", error);
      throw error;
    }
  },
  completeTask: async (
    parent: any,
    args: { id: string; currentCompleted: boolean },
    context: ContextType
  ) => {
    const { uid } = context;
    const { id, currentCompleted } = args;

    const updatedItem = await List.findOneAndUpdate(
      { uid: uid, "list.id": id },
      { $set: { "list.$.completed": !currentCompleted } },
      { new: true }
    );

    return updatedItem;
  },
};
