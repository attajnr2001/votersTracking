// controllers/groupMemberController.js
import asyncHandler from "express-async-handler";
import GroupMember from "../models/GroupMember.js";

const getAllMembers = async (req, res) => {
  try {
    const allMembers = await GroupMember.find().populate("group", "name");
    res.status(200).json(allMembers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const validateMemberData = (member) => {
  const { name, number, gender, age, occupation } = member;

  if (!name || !number) {
    throw new Error("Missing required fields");
  }

  return {
    name: name.trim(),
    number: number.toString(),
    gender: gender ? gender.trim() : "",
    age: age ? parseInt(age) : null,
    occupation: occupation ? occupation.trim() : "",
  };
};

// Function to import members from extracted text
const importMembersFromText = asyncHandler(async (req, res) => {
  const { members, groupId } = req.body;

  if (!members || !groupId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const validatedMembers = members.map((member) => ({
      ...validateMemberData(member),
      group: groupId,
    }));

    const createdMembers = await GroupMember.insertMany(validatedMembers);

    res.status(201).json({
      message: "Members imported successfully",
      count: createdMembers.length,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Function to get all group members
const getGroupMembers = async (req, res) => {
  try {
    const { groupId } = req.params;
    const groupMembers = await GroupMember.find({ group: groupId }).populate(
      "group",
      "name"
    );
    res.status(200).json(groupMembers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// create group member
const createGroupMember = asyncHandler(async (req, res) => {
  const { name, number, gender, age, occupation, group } = req.body;

  let { voterId } = req.body;

  if (!voterId) {
    voterId = await generateVoterId();
  }

  const groupMember = await GroupMember.create({
    name,
    number,
    gender,
    age,
    occupation,
    group,
    voterId,
  });

  if (groupMember) {
    res.status(201).json(groupMember);
  } else {
    res.status(400);
    throw new Error("Invalid group member data");
  }
});

const updateGroupMember = asyncHandler(async (req, res) => {
  const { name, number, gender, age, occupation, voterId } = req.body;

  const groupMember = await GroupMember.findById(req.params.id);

  if (groupMember) {
    groupMember.name = name || groupMember.name;
    groupMember.number = number || groupMember.number;
    groupMember.gender = gender || groupMember.gender;
    groupMember.age = age || groupMember.age;
    groupMember.occupation = occupation || groupMember.occupation;
    groupMember.voterId = voterId || groupMember.voterId; // Ensure voterId is always set

    const updatedGroupMember = await groupMember.save();
    res.json(updatedGroupMember);
  } else {
    res.status(404);
    throw new Error("Group member not found");
  }
});


// Function to delete a group member
const deleteGroupMember = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMember = await GroupMember.findByIdAndDelete(id);
    if (!deletedMember) {
      return res.status(404).json({ message: "Member not found" });
    }
    res.status(200).json({ message: "Member deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const generateVoterId = async () => {
  const characters = "123";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  // Check if this voterId already exists
  const existingMember = await GroupMember.findOne({ voterId: result });
  if (existingMember) {
    return generateVoterId();
  }

  return result;
};

export {
  importMembersFromText,
  getGroupMembers,
  createGroupMember,
  updateGroupMember,
  deleteGroupMember,
  getAllMembers,
};
