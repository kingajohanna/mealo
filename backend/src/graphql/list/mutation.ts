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
    let list = await List.findOne({ uid });

    if (!list) {
      list = await List.create({ uid, list: [] });
    }

    const newItem = {
      id: args.id || uuidv4(),
      name: args.name,
      amount: args.amount,
      completed: args.completed || false,
    };

    if (list.list.find((l) => l.id === newItem.id)) return list;

    list.list.push(newItem);

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

    let list = await List.findOne({ uid });

    const listItem = list?.list.find((task) => task.id === id);
    if (listItem) listItem.completed = completed;

    await list?.save();

    return list;
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
