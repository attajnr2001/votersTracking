// routes/groupMemberRoutes.js
import express from "express";
import {
  importMembersFromText,
  getGroupMembers,
  createGroupMember,
  updateGroupMember,
  deleteGroupMember,
} from "../controllers/groupMemberController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").post(protect, createGroupMember);
router.get("/:groupId", protect, getGroupMembers);
router
  .route("/:id")
  .put(protect, updateGroupMember)
  .delete(protect, deleteGroupMember);
router.post("/import", protect, importMembersFromText);

export default router;
