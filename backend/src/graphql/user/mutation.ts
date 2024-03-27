import { v4 as uuidv4 } from "uuid";
import { Recipe } from "../../models/Recipe";
import { User } from "../../models/User";
import { hashCode } from "../../utils/hash";
import { ContextType } from "../types";
import axios from "axios";

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

    const user = await User.findOne({ id: uid });
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
          id: hashCode(cleanedRecipe.canonical_url + uid),
          uid: uid,
          meals: [],
          folders: [],
          is_favorite: false,
        };

        await new Recipe(copiedRecipe).save();
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

  bingAnalyzer: async (
    parent: any,
    args: { text: string },
    context: ContextType
  ) => {
    const response = await axios.post(process.env.BING_URL as string, {
      message: args.text,
    });

    console.log(response.data.message);

    return await response.data.message;
  },
};
