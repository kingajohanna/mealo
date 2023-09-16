import { Recipe } from "../models/Recipe";
import { User } from "../models/User";
import { ContextType } from "./types";

export const userType = `
  type User {
    id: String
    email: String
  }

  type Query {
    getUser: User
  }

  type Mutation {
    addUser: User
    deleteUser: User
  }
`;

// A map of functions which return data for the schema.
export const userQuery = {
  getUser: async (parent: any, args: any, context: ContextType) => {
    const { uid } = context;
    const user = await User.find({ id: uid }).exec();
    return user;
  },
};

export const userMutation = {
  addUser: async (parent: any, args: any, context: ContextType) => {
    const { uid, email } = context;

    const user = await User.find({ id: uid });
    if (!user.length) {
      const rec = new User({
        id: uid,
        email: email,
      });

      await rec.save();
      return rec;
    }
  },
  deleteUser: async (parent: any, args: any, context: ContextType) => {
    const { uid } = context;

    const user = await User.find({ id: uid });
    await Recipe.deleteMany({ uid: uid });
    await User.deleteOne({ id: uid });

    return user;
  },
};
