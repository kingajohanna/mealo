import express, { Express } from "express";
import logger from "morgan";
import path from "path";
import * as dotenv from "dotenv";

dotenv.config();
const app: Express = express();

// Constants
const PORT = parseInt(process.env.PORT || "", 10);
const HOST = process.env.HOST as string;

app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`);
});

app.use((_req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");

  next();
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
