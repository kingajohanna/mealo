import { NextFunction, Request, Response } from "express";
import { HTTPResponse } from "../const/HttpRespone";
import { hashCode } from "../utils/hash";
import axios from "axios";
import { User } from "../models/User";
import { Recipe } from "../models/Recipe";

export async function addRecipe(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { uid } = res.locals;
  const id = hashCode(req.body.url + uid);
  const user = await User.findOne({ id: uid });

  if (!user) return res.status(500).send(HTTPResponse[500]);

  if (user.recipes.includes(id)) return res.status(200).send(HTTPResponse[200]);

  try {
    const response = await axios
      .post(process.env.SCRAPER_URL as string, {
        url: req.body.url,
      })
      .then(async function (response) {
        if (response) {
          const rec = new Recipe({
            id: id,
            uid: uid,
            ...response.data,
          });

          await rec.save();
          return true;
        } else false;
      })
      .catch(function (error) {
        console.log(error);
        return false;
      });

    if (response) {
      user.recipes.push(id);
      await user.save();
      return res.status(201).send(HTTPResponse[201]);
    } else {
      return res.status(500).send(HTTPResponse[500]);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send(HTTPResponse[500]);
  }
}

export async function getRecipe(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { uid } = res.locals;
    const user = await User.findOne({ id: uid });

    const recipes: any = await Recipe.find({ uid: user?.id }).lean();

    return res.json(recipes).status(200);
  } catch (error) {
    return res.status(500).send(HTTPResponse[500]);
  }
}

export async function editRecipe(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { recipeId } = req.params;

  const body = req.body;

  const recipe = await Recipe.findOneAndUpdate({ id: recipeId }, body, {
    new: true,
  });

  return res.status(200).json(recipe);
}

export async function deleteRecipe(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { recipeId } = req.params;

  await Recipe.findOneAndDelete({ id: recipeId });

  return res.status(200).send("deleted");
}

export async function favoriteRecipe(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { uid } = res.locals;
  const { recipeId } = req.params;

  const user = await User.findOne({ id: uid });
  const recipe = await Recipe.findOne({ id: recipeId });

  if (recipe?.is_favorite)
    await Recipe.findOneAndUpdate({ id: recipeId }, { is_favorite: false });
  else await Recipe.findOneAndUpdate({ id: recipeId }, { is_favorite: true });

  if (user) {
    user.favorites.push(recipeId);
    await user.save();

    return res.status(200).send(HTTPResponse[200]);
  }

  return res.status(500).send(HTTPResponse[500]);
}
