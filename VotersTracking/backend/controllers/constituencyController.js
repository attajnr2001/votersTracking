import asyncHandler from "express-async-handler";
import Constituency from "../models/Constituency.js";

const getConstituencies = asyncHandler(async (req, res) => {
  const constituencies = await Constituency.find({}).select("name psCode");
  res.json(constituencies);
});

export { getConstituencies };
