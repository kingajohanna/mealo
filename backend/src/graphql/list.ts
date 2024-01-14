import { List } from "../models/List";
import { ContextType } from "./types";
import { v4 as uuidv4 } from "uuid";

export const listType = `
  input ListItemInput {
    id: String
    name: String
    amount: String
    completed: Boolean
  }

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
    addToList(name: String!, amount: String!, id: String, completed: Boolean): List
    completeTask(id: String!, completed: Boolean!): List
    changeTasks(tasks: [ListItemInput]!): List
  }
`;

export const listQuery = {
  getList: async (parent: any, args: any, context: ContextType) => {
    const { uid } = context;
    const list = await List.findOne({ uid: uid }).exec();

    const temp =
      list?.list?.sort((x, y) =>
        x.completed === y.completed ? 0 : x.completed ? 1 : -1
      ) ?? [];
    console.log("temp", temp);
    list!.list = temp;
    return list;
  },
};

export const listMutation = {
  addToList: async (
    parent: any,
    args: { name: string; amount: string; id: string; completed: boolean },
    context: ContextType
  ) => {
    const { uid } = context;

    try {
      const list = await List.findOneAndUpdate(
        { uid: uid },
        {
          $push: {
            list: {
              id: args.id ? args.id : uuidv4(),
              name: args.name,
              amount: args.amount,
              completed: args.completed ? args.completed : false,
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
    args: { id: string; completed: boolean },
    context: ContextType
  ) => {
    const { uid } = context;
    const { id, completed } = args;

    const updatedItem = await List.findOneAndUpdate(
      { uid: uid, "list.id": id },
      { $set: { "list.$.completed": completed } },
      { new: true }
    );

    return updatedItem;
  },
  changeTasks: async (
    parent: any,
    args: {
      tasks: { id: string; name: string; amount: string; completed: boolean }[];
    },
    context: ContextType
  ) => {
    const { uid } = context;
    const { tasks } = args;

    const updatedList = await List.findOneAndUpdate(
      { uid: uid },
      { $set: { list: tasks } },
      { new: true }
    );

    return updatedList;
  },
};
