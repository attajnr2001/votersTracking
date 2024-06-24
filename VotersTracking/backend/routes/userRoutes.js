import express from "express";
import {
  authUser,
  registerUser,
  logoutUser,
  getUsers,
  toggleUserStatus,
} from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.post("/auth", authUser);
router.post("/", registerUser);
router.post("/logout", logoutUser);
router.get("/", protect, getUsers);
router.put("/:id/toggle-status", protect, toggleUserStatus);

export default router;
