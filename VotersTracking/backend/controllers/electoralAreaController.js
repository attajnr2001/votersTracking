import asyncHandler from "express-async-handler";
import ElectoralArea from "../models/ElectoralArea.js";

// @desc    Get all electoral areas
// @route   GET /api/electoral-areas
// @access  Public
const getElectoralAreas = asyncHandler(async (req, res) => {
  const electoralAreas = await ElectoralArea.find({});
  res.json(electoralAreas);
});

// @desc    Create a new electoral area
// @route   POST /api/electoral-areas
// @access  Private
const createElectoralArea = asyncHandler(async (req, res) => {
  const { name, psCode, coordinator, phone } = req.body;
  const electoralArea = await ElectoralArea.create({
    name,
    psCode,
    coordinator,
    phone,
  });

  if (electoralArea) {
    res.status(201).json(electoralArea);
  } else {
    res.status(400);
    throw new Error("Invalid electoral area data");
  }
});

// @desc    Update an electoral area
// @route   PUT /api/electoral-areas/:id
// @access  Private
const updateElectoralArea = asyncHandler(async (req, res) => {
  const { name, psCode, coordinator, phone } = req.body;

  const electoralArea = await ElectoralArea.findById(req.params.id);

  if (electoralArea) {
    electoralArea.name = name || electoralArea.name;
    electoralArea.psCode = psCode || electoralArea.psCode;
    electoralArea.coordinator = coordinator || electoralArea.coordinator;
    electoralArea.phone = phone || electoralArea.phone;

    const updatedElectoralArea = await electoralArea.save();
    res.json(updatedElectoralArea);
  } else {
    res.status(404);
    throw new Error("Electoral area not found");
  }
});

// @desc    Delete an electoral area
// @route   DELETE /api/electoral-areas/:id
// @access  Private
const deleteElectoralArea = asyncHandler(async (req, res) => {
  const electoralArea = await ElectoralArea.findById(req.params.id);

  if (electoralArea) {
    await electoralArea.remove();
    res.json({ message: "Electoral area removed" });
  } else {
    res.status(404);
    throw new Error("Electoral area not found");
  }
});

export {
  getElectoralAreas,
  createElectoralArea,
  updateElectoralArea,
  deleteElectoralArea,
};