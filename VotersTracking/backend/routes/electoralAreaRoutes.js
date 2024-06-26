import express from "express";
import {
  getElectoralAreas,
  createElectoralArea,
  updateElectoralArea,
  deleteElectoralArea,
} from "../controllers/electoralAreaController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").get(getElectoralAreas).post(protect, createElectoralArea);
router
  .route("/:id")
  .put(protect, updateElectoralArea)
  .delete(protect, deleteElectoralArea);

export default router;
