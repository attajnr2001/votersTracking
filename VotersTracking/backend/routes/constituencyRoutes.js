import express from "express";
import { getConstituencies } from "../controllers/constituencyController.js";

const router = express.Router();

router.route("/").get(getConstituencies);

export default router;