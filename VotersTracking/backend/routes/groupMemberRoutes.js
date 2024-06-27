// routes/groupMemberRoutes.js
import express from "express";
import multer from "multer";
import {
  importMembersFromExcel,
  getGroupMembers,
  createGroupMember,
  updateGroupMember,
  deleteGroupMember,
} from "../controllers/groupMemberController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();
const upload = multer();

router
  .route("/")
  .get(protect, getGroupMembers)
  .post(protect, createGroupMember);
router
  .route("/:id")
  .put(protect, updateGroupMember)
  .delete(protect, deleteGroupMember);
router.post("/import", protect, upload.single("file"), importMembersFromExcel);

export default router;
