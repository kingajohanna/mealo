import express, { Express } from "express";

import logger from "morgan";
import path from "path";
import * as dotenv from "dotenv";
import { initializeApp } from "firebase-admin/app";
import mongoose from "mongoose";

const firebaseConfig = {
  apiKey: "AIzaSyBgkCyXlBxAtvXt8EWrnvXS-wZByOPa55M",
  authDomain: "mealo-mao.firebaseapp.com",
  projectId: "mealo-mao",
  storageBucket: "mealo-mao.appspot.com",
  messagingSenderId: "454226409378",
  databaseURL: "https://mealo-mao.firebaseio.com",
  appId: "1:454226409378:web:bd4c7729c54fd33b8024fb",
};

dotenv.config();
export const firebaseApp = initializeApp(firebaseConfig);

export const app: Express = express();

/*
const { CERT, KEY } = process.env;
const originalCert = CERT?.replace(/\\n/g, "\n");
const originalKey = KEY?.replace(/\\n/g, "\n");
*/

// Constants
const PORT = parseInt(process.env.PORT || "", 10);
const HOST = process.env.HOST as string;

mongoose
  .connect(process.env.DB_URL as string)
  .then(() => {
    app.listen(PORT, HOST, () => {
      console.log(`Running on http://${HOST}:${PORT}`);
    });
  })
  .catch((err) => {});

var userRouter = require("./src/routes/user");
var recipeRouter = require("./src/routes/recipe");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/user", userRouter);
app.use("/recipe", recipeRouter);

module.exports = app;
