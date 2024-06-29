import asyncHandler from "express-async-handler";
import Group from "../models/Group.js";
import Constituency from "../models/Constituency.js";

// @desc    Get all groups
// @route   GET /api/groups
// @access  Public
const getGroups = asyncHandler(async (req, res) => {
  const groups = await Group.find({}).lean();

  // Fetch all constituencies
  const constituencies = await Constituency.find({}).lean();

  // Create a map of psCode to constituency name
  const constituencyMap = constituencies.reduce((map, constituency) => {
    map[constituency.psCode] = constituency.name;
    return map;
  }, {});

  // Add constituency name to each group
  const groupsWithConstituencyNames = groups.map((group) => ({
    ...group,
    constituencyName: constituencyMap[group.electoralArea] || "Unknown",
  }));

  res.json(groupsWithConstituencyNames);
});

// @desc    Create a new group
// @route   POST /api/groups
// @access  Private
const createGroup = asyncHandler(async (req, res) => {
  const { name, leaderName, leaderPhone, electoralArea } = req.body;
  const group = await Group.create({
    name,
    leaderName,
    leaderPhone,
    electoralArea,
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
  const { name, leaderName, leaderPhone, electoralArea } = req.body;
  const group = await Group.findById(req.params.id);
  if (group) {
    group.name = name || group.name;
    group.leaderName = leaderName || group.leaderName;
    group.leaderPhone = leaderPhone || group.leaderPhone;
    group.electoralArea = electoralArea || group.electoralArea;
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
