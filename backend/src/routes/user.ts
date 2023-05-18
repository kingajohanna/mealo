import express, { Request, Response } from "express";

import { authenticateToken } from "../middlewares/auth";
import { addUser, deleteUser } from "../middlewares/user";

const router = express.Router();

router.put("/add", authenticateToken, addUser);

router.delete("/delete", authenticateToken, deleteUser);

module.exports = router;
