import express from "express";
import {
  addVoter,
  getVoters,
  getTotalVoters,
  getVotersBelow40,
  getVotersAbove40,
  getConstituencyData,
  getAllConstituenciesData,
} from "../controllers/voterController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").post(protect, addVoter);
router.route("/").get(getVoters);

router.route("/count").get(getTotalVoters);
router.route("/count/below40").get(getVotersBelow40);
router.route("/count/above40").get(getVotersAbove40);
router.route("/constituency/:psCode").get(getConstituencyData);
router.route("/all-constituencies-data").get(getAllConstituenciesData);

export default router;
