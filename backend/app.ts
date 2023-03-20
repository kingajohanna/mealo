import express, { Express } from "express";
import https from "node:https";
import logger from "morgan";
import path from "path";
import * as dotenv from "dotenv";

dotenv.config();
const app: Express = express();

const { CERT, KEY } = process.env;
const originalCert = CERT?.replace(/\\n/g, "\n");
const originalKey = KEY?.replace(/\\n/g, "\n");

// Constants
const PORT = parseInt(process.env.PORT || "", 10);
const HOST = process.env.HOST as string;

https
  .createServer(
    {
      key: originalKey,
      cert: originalCert,
    },
    app
  )
  .listen(PORT, HOST, () => {
    console.log(`Running on https://${HOST}:${PORT}`);
  });

var indexRouter = require("./routes/index");
var recipeRouter = require("./routes/recipe");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/recipe", recipeRouter);

module.exports = app;
