// controllers/groupMemberController.js
import asyncHandler from "express-async-handler";
import XLSX from "xlsx";
import GroupMember from "../models/GroupMember.js";

// Function to read Excel file and convert to JSON
const excelToJson = (file) => {
  const workbook = XLSX.read(file.buffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  return XLSX.utils.sheet_to_json(sheet);
};

// Function to validate and format member data
const validateMemberData = (member) => {
  const { name, number, gender, age, occupation } = member;

  if (!name || !number || !gender || !age || !occupation) {
    throw new Error("Missing required fields");
  }

  return {
    name: name.trim(),
    number: number.toString(),
    gender: gender.trim(),
    age: parseInt(age),
    occupation: occupation.trim(),
  };
};

// Function to import members from Excel file
const importMembersFromExcel = asyncHandler(async (req, res) => {
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
    const groupMembers = await GroupMember.find();
    res.status(200).json(groupMembers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Function to create a new group member
const createGroupMember = async (req, res) => {
  try {
    const memberData = validateMemberData(req.body);
    const newMember = new GroupMember(memberData);
    const savedMember = await newMember.save();
    res.status(201).json(savedMember);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

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
  importMembersFromExcel,
  getGroupMembers,
  createGroupMember,
  updateGroupMember,
  deleteGroupMember,
};
