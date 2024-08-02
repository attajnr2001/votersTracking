import express from "express";
import {
  getGroupMembers,
  createGroupMember,
  updateGroupMember,
  deleteGroupMember,
  getAllMembers, // Add this import
} from "../controllers/groupMemberController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/all", protect, getAllMembers);
router.route("/").post(protect, createGroupMember);
router.get("/:groupId", protect, getGroupMembers);
router
  .route("/:id")
  .put(protect, updateGroupMember)
  .delete(protect, deleteGroupMember);

export default router;
