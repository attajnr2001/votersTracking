// controllers/galleryController.js
import asyncHandler from "express-async-handler";
import Gallery from "../models/Gallery.js";

// @desc    Get all gallery items
// @route   GET /api/gallery
// @access  Public
const getGalleryItems = asyncHandler(async (req, res) => {
  const galleryItems = await Gallery.find({});
  res.json(galleryItems);
});

// @desc    Create a new gallery item
// @route   POST /api/gallery
// @access  Private
const createGalleryItem = asyncHandler(async (req, res) => {
  const { name, year, image, location, description } = req.body;
  const galleryItem = await Gallery.create({
    name,
    year,
    image,
    location,
    description,
  });

  if (galleryItem) {
    res.status(201).json(galleryItem);
  } else {
    res.status(400);
    throw new Error("Invalid gallery item data");
  }
});

// @desc    Update a gallery item
// @route   PUT /api/gallery/:id
// @access  Private
const updateGalleryItem = asyncHandler(async (req, res) => {
  const { name, year, image, location, description } = req.body;

  const galleryItem = await Gallery.findById(req.params.id);

  if (galleryItem) {
    galleryItem.name = name || galleryItem.name;
    galleryItem.year = year || galleryItem.year;
    galleryItem.image = image || galleryItem.image;
    galleryItem.location = location || galleryItem.location;
    galleryItem.description = description || galleryItem.description;

    const updatedGalleryItem = await galleryItem.save();
    res.json(updatedGalleryItem);
  } else {
    res.status(404);
    throw new Error("Gallery item not found");
  }
});

// @desc    Delete a gallery item
// @route   DELETE /api/gallery/:id
// @access  Private
const deleteGalleryItem = asyncHandler(async (req, res) => {
  const galleryItem = await Gallery.findById(req.params.id);

  if (galleryItem) {
    await galleryItem.remove();
    res.json({ message: "Gallery item removed" });
  } else {
    res.status(404);
    throw new Error("Gallery item not found");
  }
});

export {
  getGalleryItems,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
};
