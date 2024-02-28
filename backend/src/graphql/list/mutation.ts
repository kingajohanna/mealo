import { v4 as uuidv4 } from "uuid";
import { List } from "../../models/List";
import { ContextType } from "../types";

export const listMutation = {
  addToList: async (
    parent: any,
    args: { name: string; amount: string; id?: string; completed: boolean },
    context: ContextType
  ) => {
    const { uid } = context;
    let list = await List.findOne({ uid: uid });

    if (!list) {
      list = await List.create({ uid: uid, list: [] });
    }

    list.list.push({
      id: args.id ? args.id : uuidv4(),
      name: args.name,
      amount: args.amount,
      completed: args.completed ? args.completed : false,
    });

    list.list = list.list.sort((a, b) =>
      a.completed === b.completed ? 0 : a.completed ? 1 : -1
    );

    await list.save();

    return list;
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
  deleteTask: async (
    parent: any,
    args: {
      id: string;
    },
    context: ContextType
  ) => {
    const { uid } = context;
    const { id } = args;

    const list = await List.findOne({ uid });

    const updatedList = await List.findOneAndUpdate(
      { uid: uid },
      { $set: { list: list?.list.filter((l) => l.id !== id) } },
      { new: true }
    );

    return updatedList;
  },
};
