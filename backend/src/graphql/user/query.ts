import { User } from "../../models/User";
import { ContextType } from "../types";

export const userQuery = {
  getUser: async (parent: any, args: any, context: ContextType) => {
    const { uid } = context;

    return await User.findOne({ id: uid }).lean();
  },
};
