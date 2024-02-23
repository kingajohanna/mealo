import { User } from "../../models/User";
import { ContextType } from "../types";

export const userQuery = {
  getUser: async (parent: any, args: any, context: ContextType) => {
    try {
      const { uid } = context;

      return await User.findOne({ id: uid }).lean();
    } catch (error) {
      console.error("Error fetching user:", error);
      throw new Error("Failed to fetch user");
    }
  },
};
