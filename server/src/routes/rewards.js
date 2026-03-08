const express = require("express");
const Reward = require("../models/Reward");
const User = require("../models/User");
const { auth } = require("../middleware/auth");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const list = await Reward.find().lean();
    res.json(list);
  } catch (error) {
    next(error);
  }
});

router.post("/:rewardId/redeem", auth, async (req, res, next) => {
  try {
    const { rewardId } = req.params;

    // Validate rewardId
    if (!rewardId || rewardId === "undefined") {
      return res.status(400).json({ message: "Invalid reward ID" });
    }

    const reward = await Reward.findById(rewardId).lean();
    if (!reward) return res.status(404).json({ message: "Reward not found" });

    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.points < reward.cost) return res.status(400).json({ message: "Not enough points" });

    user.points -= reward.cost;
    await user.save();

    res.json(user);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
