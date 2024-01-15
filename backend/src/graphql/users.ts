import { Recipe } from "../models/Recipe";
import { User } from "../models/User";
import { ContextType } from "./types";
import { v4 as uuidv4 } from "uuid";

export const userType = `
  type Share {
    recipe: Int
    from: String
    id: String
  }

  type User {
    id: String
    email: String
    share: [Share]
  }

  type Query {
    getUser: User
  }

  type Mutation {
    addUser: User
    deleteUser: User
    shareRecipe(recipeId: Int!, email: String!): Share
    manageShare(shareId: String!, id: Int!, accept: Boolean!): User
  }
`;

// A map of functions which return data for the schema.
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
  shareRecipe: async (
    parent: any,
    args: { recipeId: number; email: string },
    context: ContextType
  ) => {
    const { email } = context;

    const share = { recipe: args.recipeId, from: email, id: uuidv4() };
    await User.findOneAndUpdate(
      { email: args.email },
      {
        $push: {
          share: share,
        },
      },
      { new: true }
    );

    return share;
  },
  manageShare: async (
    parent: any,
    args: { shareId: string; id: number; accept: boolean },
    context: ContextType
  ) => {
    const { uid } = context;

    if (args.accept) {
      const recipe = await Recipe.findOne({ id: args.id });

      if (recipe) {
        const { _id, is_favorite, folders, meals, ...cleanedRecipe } =
          recipe.toObject();

        const copiedRecipe = {
          ...cleanedRecipe,
          id: Math.floor(cleanedRecipe.id / 2),
          uid: uid,
          meals: [],
          folders: [],
          is_favorite: false,
        };

        await Recipe.create(copiedRecipe);
      }
    }

    return await User.findOneAndUpdate(
      { id: uid },
      {
        $pull: {
          share: { id: args.shareId },
        },
      },
      { new: true }
    ).lean();
  },
};
