import express from "express";
import {
  getConstituencies,
  createConstituency,
  updateConstituency,
  deleteConstituency,
} from "../controllers/constituencyController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").get(getConstituencies).post(protect, createConstituency);
router
  .route("/:id")
  .put(protect, updateConstituency)
  .delete(protect, deleteConstituency);

export default router;
