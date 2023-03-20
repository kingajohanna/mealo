import express, { Request, Response } from "express";
var router = express.Router();
import axios from "axios";
import { Recipe } from "../mongodb";
import { HTTPResponse } from "../const/HttpRespone";

const hashCode = function (s: string) {
  return s
    .split("")
    .reduce(function (a, b) {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0)
    .toString();
};

router.put("/add", async function (req: Request, res: Response) {
  const id = hashCode(req.body.url);
  const recipe = await Recipe.find({ id });

  if (!recipe.length) {
    axios
      .post(process.env.SCRAPER_URL as string, {
        url: req.body.url,
      })
      .then(async function (response) {
        try {
          const rec = new Recipe({
            id: id,
            ...response.data,
          });

          await rec.save();
          res.status(201).send(HTTPResponse[201]);
        } catch (error) {
          console.log(error);
          res.status(500).send(HTTPResponse[500]);
        }
      })
      .catch(function (error) {
        console.log(error);
        res.status(500).send(HTTPResponse[500]);
      });
  } else res.status(200).send(HTTPResponse[200]);
});

module.exports = router;
