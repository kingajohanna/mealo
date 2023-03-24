import express, { Request, Response } from "express";

import { HTTPResponse } from "../const/HttpRespone";
import { authenticateToken } from "../middlewares/auth";
import { User } from "../models/mongodb";

var router = express.Router();

router.put(
  "/add",
  authenticateToken,
  async function (req: Request, res: Response) {
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
);

module.exports = router;
