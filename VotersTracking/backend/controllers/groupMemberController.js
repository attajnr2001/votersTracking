// controllers/groupMemberController.js
import asyncHandler from "express-async-handler";
import GroupMember from "../models/GroupMember.js";

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

// Function to create a new group member
const createGroupMember = asyncHandler(async (req, res) => {
  const { name, voterId, gender, phone, occupation, age, groupId } = req.body;

  if (!name || !phone || !groupId) {
    res.status(400);
    throw new Error("Please provide name, phone, and groupId");
  }

  try {
    const newMember = await GroupMember.create({
      name,
      voterId,
      gender,
      number: phone,
      occupation,
      age: age ? parseInt(age) : undefined,
      group: groupId,
    });

    res.status(201).json(newMember);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

// Function to update a group member
const updateGroupMember = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = validateMemberData(req.body);
    const updatedMember = await GroupMember.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updatedMember) {
      return res.status(404).json({ message: "Member not found" });
    }
    res.status(200).json(updatedMember);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

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

export {
  importMembersFromText,
  getGroupMembers,
  createGroupMember,
  updateGroupMember,
  deleteGroupMember,
};
