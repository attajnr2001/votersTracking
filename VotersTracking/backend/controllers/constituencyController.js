import asyncHandler from "express-async-handler";
import Constituency from "../models/Constituency.js";
import User from "../models/User.js";
import Voter from "../models/Voter.js"; // Add this import

// @desc    Get all constituencies
// @route   GET /api/constituencies
// @access  Public
const getConstituencies = asyncHandler(async (req, res) => {
  const constituencies = await Constituency.find({});
  const constituenciesWithDetails = await Promise.all(
    constituencies.map(async (constituency) => {
      const coordinator = await User.findOne({ psCode: constituency.psCode });
      const voterCount = await Voter.countDocuments({
        psCode: constituency.psCode,
      });
      return {
        ...constituency.toObject(),
        coordinatorPhone: coordinator ? coordinator.phone : "N/A",
        population: voterCount, // This represents the number of voters in the constituency
      };
    })
  );
  res.json(constituenciesWithDetails);
});

// @desc    Create a new constituency
// @route   POST /api/constituencies
// @access  Private
const createConstituency = asyncHandler(async (req, res) => {
  const { name, psCode } = req.body;
  const constituency = await Constituency.create({
    name,
    psCode,
  });

  if (constituency) {
    res.status(201).json(constituency);
  } else {
    res.status(400);
    throw new Error("Invalid constituency data");
  }
});

// @desc    Update a constituency
// @route   PUT /api/constituencies/:id
// @access  Private
const updateConstituency = asyncHandler(async (req, res) => {
  const { name, psCode } = req.body;

  const constituency = await Constituency.findById(req.params.id);

  if (constituency) {
    constituency.name = name || constituency.name;
    constituency.psCode = psCode || constituency.psCode;

    const updatedConstituency = await constituency.save();
    res.json(updatedConstituency);
  } else {
    res.status(404);
    throw new Error("Constituency not found");
  }
});

// @desc    Delete a constituency
// @route   DELETE /api/constituencies/:id
// @access  Private
const deleteConstituency = asyncHandler(async (req, res) => {
  const constituency = await Constituency.findById(req.params.id);

  if (constituency) {
    await constituency.remove();
    res.json({ message: "Constituency removed" });
  } else {
    res.status(404);
    throw new Error("Constituency not found");
  }
});

export {
  getConstituencies,
  createConstituency,
  updateConstituency,
  deleteConstituency,
};
