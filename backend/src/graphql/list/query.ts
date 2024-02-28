import { List } from "../../models/List";
import { ContextType } from "../types";

export const listQuery = {
  getList: async (parent: any, args: any, context: ContextType) => {
    const { uid } = context;
    const list = await List.findOne({ uid: uid }).exec();

    if (!list) return { list: [] };

    return {
      list: list.list.sort((a, b) =>
        a.completed === b.completed ? 0 : a.completed ? 1 : -1
      ),
    };
  },
};
