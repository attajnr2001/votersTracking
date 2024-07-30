import asyncHandler from "express-async-handler";
import Voter from "../models/Voter.js";

// @desc    Add a new voter
// @route   POST /api/voters
// @access  Private
const addVoter = asyncHandler(async (req, res) => {
  const { surname, otherNames, dob, psCode, sex, idNumber, dor, image } =
    req.body;

  const voterExists = await Voter.findOne({ idNumber });

  if (voterExists) {
    res.status(400);
    throw new Error("Voter already exists");
  }

  const voter = await Voter.create({
    surname,
    otherNames,
    dob,
    psCode,
    sex,
    idNumber,
    dor,
    image,
  });

  if (voter) {
    res.status(201).json({
      _id: voter._id,
      surname: voter.surname,
      otherNames: voter.otherNames,
      dob: voter.dob,
      psCode: voter.psCode,
      sex: voter.sex,
      idNumber: voter.idNumber,
      dor: voter.dor,
      image: voter.image,
    });
  } else {
    res.status(400);
    throw new Error("Invalid voter data");
  }
});

const getVoters = asyncHandler(async (req, res) => { 
  const { psCode } = req.query;
  let query = {};

  if (psCode !== "all") {
    query.psCode = psCode;
  }

  const voters = await Voter.find(query).sort({ createdAt: -1 });
  res.json(voters);
  console.log(voters);
});
// In voterController.js
const getTotalVoters = asyncHandler(async (req, res) => {
  const { psCode } = req.query;
  let query = psCode && psCode !== "all" ? { psCode } : {};

  const counts = await Voter.aggregate([
    { $match: query },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        male: { $sum: { $cond: [{ $eq: ["$sex", "M"] }, 1, 0] } },
        female: { $sum: { $cond: [{ $eq: ["$sex", "F"] }, 1, 0] } },
      },
    },
  ]);
  res.json(counts[0] || { total: 0, male: 0, female: 0 });
});

const getVotersBelow40 = asyncHandler(async (req, res) => {
  const { psCode } = req.query;
  const fortyYearsAgo = new Date();
  fortyYearsAgo.setFullYear(fortyYearsAgo.getFullYear() - 40);

  let query =
    psCode && psCode !== "all"
      ? { psCode, dob: { $gt: fortyYearsAgo } }
      : { dob: { $gt: fortyYearsAgo } };

  const counts = await Voter.aggregate([
    { $match: query },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        male: { $sum: { $cond: [{ $eq: ["$sex", "M"] }, 1, 0] } },
        female: { $sum: { $cond: [{ $eq: ["$sex", "F"] }, 1, 0] } },
      },
    },
  ]);
  res.json(counts[0] || { total: 0, male: 0, female: 0 });
});

const getVotersAbove40 = asyncHandler(async (req, res) => {
  const { psCode } = req.query;
  const fortyYearsAgo = new Date();
  fortyYearsAgo.setFullYear(fortyYearsAgo.getFullYear() - 40);

  let query =
    psCode && psCode !== "all"
      ? { psCode, dob: { $lte: fortyYearsAgo } }
      : { dob: { $lte: fortyYearsAgo } };

  const counts = await Voter.aggregate([
    { $match: query },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        male: { $sum: { $cond: [{ $eq: ["$sex", "M"] }, 1, 0] } },
        female: { $sum: { $cond: [{ $eq: ["$sex", "F"] }, 1, 0] } },
      },
    },
  ]);
  res.json(counts[0] || { total: 0, male: 0, female: 0 });
});

const getConstituencyData = asyncHandler(async (req, res) => {
  const { psCode } = req.params;
  const fortyYearsAgo = new Date();
  fortyYearsAgo.setFullYear(fortyYearsAgo.getFullYear() - 40);

  const data = await Voter.aggregate([
    { $match: { psCode: psCode } },
    {
      $group: {
        _id: null,
        male: { $sum: { $cond: [{ $eq: ["$sex", "M"] }, 1, 0] } },
        female: { $sum: { $cond: [{ $eq: ["$sex", "F"] }, 1, 0] } },
        above40: { $sum: { $cond: [{ $lte: ["$dob", fortyYearsAgo] }, 1, 0] } },
        below40: { $sum: { $cond: [{ $gt: ["$dob", fortyYearsAgo] }, 1, 0] } },
      },
    },
  ]);

  res.json(data[0] || { male: 0, female: 0, above40: 0, below40: 0 });
});
// In voterController.js

const getAllConstituenciesData = asyncHandler(async (req, res) => {
  const fortyYearsAgo = new Date();
  fortyYearsAgo.setFullYear(fortyYearsAgo.getFullYear() - 40);

  const data = await Voter.aggregate([
    {
      $group: {
        _id: "$psCode",
        male: { $sum: { $cond: [{ $eq: ["$sex", "M"] }, 1, 0] } },
        female: { $sum: { $cond: [{ $eq: ["$sex", "F"] }, 1, 0] } },
        above40: { $sum: { $cond: [{ $lte: ["$dob", fortyYearsAgo] }, 1, 0] } },
        below40: { $sum: { $cond: [{ $gt: ["$dob", fortyYearsAgo] }, 1, 0] } },
      },
    },
    {
      $lookup: {
        from: "constituencies",
        localField: "_id",
        foreignField: "psCode",
        as: "constituencyInfo",
      },
    },
    {
      $project: {
        psCode: "$_id",
        name: { $arrayElemAt: ["$constituencyInfo.name", 0] },
        male: 1,
        female: 1,
        above40: 1,
        below40: 1,
      },
    },
  ]);

  res.json(data);
});

export {
  addVoter,
  getVoters,
  getTotalVoters,
  getVotersBelow40,
  getVotersAbove40,
  getConstituencyData,
  getAllConstituenciesData,
};
