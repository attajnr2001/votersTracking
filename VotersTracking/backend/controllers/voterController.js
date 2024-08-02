import asyncHandler from "express-async-handler";
import Voter from "../models/Voter.js";

const addVoter = asyncHandler(async (req, res) => {
  const { surname, otherNames, age, psCode, sex, idNumber, dor, image } =
    req.body;

  const voterExists = await Voter.findOne({ idNumber });

  if (voterExists) {
    res.status(400);
    throw new Error("Voter already exists");
  }

  const voter = await Voter.create({
    surname,
    otherNames,
    age,
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
      age: voter.age,
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
});

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

  let query =
    psCode && psCode !== "all"
      ? { psCode, age: { $lt: 40 } }
      : { age: { $lt: 40 } };

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

  let query =
    psCode && psCode !== "all"
      ? { psCode, age: { $gte: 40 } }
      : { age: { $gte: 40 } };

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

  const data = await Voter.aggregate([
    { $match: { psCode: psCode } },
    {
      $group: {
        _id: null,
        male: { $sum: { $cond: [{ $eq: ["$sex", "M"] }, 1, 0] } },
        female: { $sum: { $cond: [{ $eq: ["$sex", "F"] }, 1, 0] } },
        above40: { $sum: { $cond: [{ $gte: ["$age", 40] }, 1, 0] } },
        below40: { $sum: { $cond: [{ $lt: ["$age", 40] }, 1, 0] } },
      },
    },
  ]);

  res.json(data[0] || { male: 0, female: 0, above40: 0, below40: 0 });
});

const getAllConstituenciesData = asyncHandler(async (req, res) => {
  const data = await Voter.aggregate([
    {
      $group: {
        _id: "$psCode",
        male: { $sum: { $cond: [{ $eq: ["$sex", "M"] }, 1, 0] } },
        female: { $sum: { $cond: [{ $eq: ["$sex", "F"] }, 1, 0] } },
        above40: { $sum: { $cond: [{ $gte: ["$age", 40] }, 1, 0] } },
        below40: { $sum: { $cond: [{ $lt: ["$age", 40] }, 1, 0] } },
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
const updateVoter = asyncHandler(async (req, res) => {
  const voter = await Voter.findById(req.params.id);

  if (voter) {
    voter.surname = req.body.surname || voter.surname;
    voter.otherNames = req.body.otherNames || voter.otherNames;
    voter.age = req.body.age || voter.age;
    voter.sex = req.body.sex || voter.sex;
    voter.psCode = req.body.psCode || voter.psCode;
    voter.idNumber = req.body.idNumber || voter.idNumber;

    const updatedVoter = await voter.save();

    res.json({
      _id: updatedVoter._id,
      surname: updatedVoter.surname,
      otherNames: updatedVoter.otherNames,
      age: updatedVoter.age,
      sex: updatedVoter.sex,
      psCode: updatedVoter.psCode,
      idNumber: updatedVoter.idNumber,
    });
  } else {
    res.status(404);
    throw new Error("Voter not found");
  }
});

export {
  addVoter,
  getVoters,
  getTotalVoters,
  getVotersBelow40,
  getVotersAbove40,
  getConstituencyData,
  getAllConstituenciesData,
  updateVoter,
};
