import { NextFunction, Request, Response } from "express";
import { HTTPResponse } from "../const/HttpRespone";
import { User } from "../models/User";
import { Recipe } from "../models/Recipe";

export async function addUser(req: Request, res: Response, next: NextFunction) {
  const { email, uid } = res.locals;

  const user = await User.find({ id: uid });
  if (!user.length)
    try {
      const rec = new User({
        id: uid,
        email: email,
      });

      await rec.save();
      res.status(201).send(HTTPResponse[201]);
    } catch (error) {
      console.log(error);
      res.status(500).send(HTTPResponse[500]);
    }
  else res.status(201).send(HTTPResponse[200]);
}

export async function deleteUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { uid } = res.locals;
  try {
    await Recipe.deleteMany({ uid: uid });
    await User.deleteOne({ id: uid });

    return res.status(200).send(HTTPResponse[200]);
  } catch (error) {
    console.log(error);
    res.status(500).send(HTTPResponse[500]);
  }
}
