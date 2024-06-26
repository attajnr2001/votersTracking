// routes/galleryRoutes.js
import express from "express";
import {
  getGalleryItems,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
} from "../controllers/galleryController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").get(getGalleryItems).post(protect, createGalleryItem);
router
  .route("/:id")
  .put(protect, updateGalleryItem)
  .delete(protect, deleteGalleryItem);

export default router;
