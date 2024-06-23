import express from "express";
import {
  authUser,
  registerUser,
  logoutUser,
} from "../controllers/userController.js";

const router = express.Router();
router.post("/auth", authUser);
router.post("/", registerUser);
router.post("/logout", logoutUser);
export default router;
