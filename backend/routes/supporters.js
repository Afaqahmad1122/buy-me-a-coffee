import express from "express";
import Supporter from "../models/Supporter.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const limit = Number(req.query.limit) || 10;
  const supporters = await Supporter.find()
    .sort({ createdAt: -1 })
    .limit(limit);
  res.json(supporters);
});

export default router;
