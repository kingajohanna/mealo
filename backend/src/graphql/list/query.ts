import { List } from "../../models/List";
import { ContextType } from "../types";

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
