import express from "express";
import { authenticateToken } from "../middlewares/auth";
import {
  addRecipe,
  deleteRecipe,
  editRecipe,
  favoriteRecipe,
  getRecipe,
} from "../middlewares/recipe";

const router = express.Router();

router.put("/add", authenticateToken, addRecipe);

router.get("/get", authenticateToken, getRecipe);

router.post("/edit/:recipeId", authenticateToken, editRecipe);

router.delete("/delete/:recipeId", authenticateToken, deleteRecipe);

router.post("/favorite/:recipeId", authenticateToken, favoriteRecipe);

module.exports = router;
