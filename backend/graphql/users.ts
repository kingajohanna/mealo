import { HTTPResponse } from "../src/const/HttpRespone";
import { Recipe } from "../src/models/Recipe";
import { User } from "../src/models/User";

export const userType = `
  type User {
    id: String
    email: String
    recipes: [Recipe]
    favorites: [Recipe]
  }

  type Query {
    getUser(id: String!): User
  }

  type Mutation {
    addUser(id: String!, email: String!): User
    deleteUser(id: String!): User
  }
`;

// A map of functions which return data for the schema.
export const userQuery = {
  getUser: async (id: string) => {
    const user = await User.find({ id }).exec();
    return user;
  },
};

export const userMutation = {
  addUser: async (parent: any, args: { id: string; email: string }) => {
    const { id, email } = args;

    const user = await User.find({ id });
    if (!user.length) {
      const rec = new User({
        id,
        email: email,
      });

      await rec.save();
      return rec;
    }
  },
  deleteUser: async (parent: any, args: { id: string }) => {
    const { id } = args;

    const user = await User.find({ id });
    await Recipe.deleteMany({ uid: id });
    await User.deleteOne({ id });

    return user;
  },
};
