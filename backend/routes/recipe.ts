import express, { Request, Response } from "express";
var router = express.Router();
import axios from "axios";
import { HTTPResponse } from "../const/HttpRespone";
import { hashCode } from "../utils/hash";
import { Recipe, User } from "../models/mongodb";
import { authenticateToken } from "../middlewares/auth";

router.put(
  "/add",
  authenticateToken,
  async function (req: Request, res: Response) {
    const { uid } = res.locals;
    const id = hashCode(req.body.url + uid);
    const user = await User.findOne({ id: uid });

    if (!user) return res.status(500).send(HTTPResponse[500]);

    if (user.recipes.includes(id))
      return res.status(200).send(HTTPResponse[200]);

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
);

router.get(
  "/get",
  authenticateToken,
  async function (req: Request, res: Response) {
    try {
      const { uid } = res.locals;
      const user = await User.findOne({ id: uid });

      const recipes: any = await Recipe.find({ uid: user?.id }).lean();

      return res.json(recipes).status(200);
    } catch (error) {
      return res.status(500).send(HTTPResponse[500]);
    }
  }
);

router.post(
  "/edit/:recipeId",
  authenticateToken,
  async function (req: Request, res: Response) {
    const { recipeId } = req.params;

    const body = req.body;

    await Recipe.findOneAndUpdate({ id: recipeId }, body);

    return res.status(200).send(HTTPResponse[200]);
  }
);

module.exports = router;
