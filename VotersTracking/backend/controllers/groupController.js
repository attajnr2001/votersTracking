// controllers/groupController.js
import asyncHandler from "express-async-handler";
import Group from "../models/Group.js";

// @desc    Get all groups
// @route   GET /api/groups
// @access  Public
const getGroups = asyncHandler(async (req, res) => {
  const groups = await Group.find({});
  res.json(groups);
});

// @desc    Create a new group
// @route   POST /api/groups
// @access  Private
const createGroup = asyncHandler(async (req, res) => {
  const { name, leaderName, leaderPhone } = req.body;
  const group = await Group.create({
    name,
    leaderName,
    leaderPhone,
  });
  if (group) {
    res.status(201).json(group);
  } else {
    res.status(400);
    throw new Error("Invalid group data");
  }
});

// @desc    Update a group
// @route   PUT /api/groups/:id
// @access  Private
const updateGroup = asyncHandler(async (req, res) => {
  const { name, leaderName, leaderPhone } = req.body;
  const group = await Group.findById(req.params.id);
  if (group) {
    group.name = name || group.name;
    group.leaderName = leaderName || group.leaderName;
    group.leaderPhone = leaderPhone || group.leaderPhone;
    const updatedGroup = await group.save();
    res.json(updatedGroup);
  } else {
    res.status(404);
    throw new Error("Group not found");
  }
});

// @desc    Delete a group
// @route   DELETE /api/groups/:id
// @access  Private
const deleteGroup = asyncHandler(async (req, res) => {
  const group = await Group.findById(req.params.id);
  if (group) {
    await group.remove();
    res.json({ message: "Group removed" });
  } else {
    res.status(404);
    throw new Error("Group not found");
  }
});

export { getGroups, createGroup, updateGroup, deleteGroup };
