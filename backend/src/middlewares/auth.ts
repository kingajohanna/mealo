import { NextFunction, Request, Response } from "express";
import * as firebase from "firebase-admin";

export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.headers["authorization"];

  if (token == null) return res.sendStatus(401);

  firebase
    .auth()
    .verifyIdToken(token)
    .then((decodedToken: any) => {
      res.locals.email = decodedToken.email;
      res.locals.uid = decodedToken.uid;

      next();
    })
    .catch((error: any) => {
      console.log(error);
      return res.status(401).send("Token expired");
    });
}
