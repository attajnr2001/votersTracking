// routes/groupRoutes.js
import express from "express";
import {
  getGroups,
  createGroup,
  updateGroup,
  deleteGroup,
} from "../controllers/groupController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").get(getGroups).post(protect, createGroup);
router.route("/:id").put(protect, updateGroup).delete(protect, deleteGroup);

export default router;
