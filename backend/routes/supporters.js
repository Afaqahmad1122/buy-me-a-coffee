import express from "express";
import { getRecentSupporters } from "../controllers/supporterController.js";

const router = express.Router();

router.get("/", getRecentSupporters);

export default router;
