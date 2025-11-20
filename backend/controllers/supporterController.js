import Supporter from "../models/Supporter.js";

export const getRecentSupporters = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 10;
    const supporters = await Supporter.find()
      .sort({ createdAt: -1 })
      .limit(limit);

    res.json(supporters);
  } catch (error) {
    console.error("Error fetching supporters", error);
    res.status(500).json({ error: "Failed to fetch supporters" });
  }
};
