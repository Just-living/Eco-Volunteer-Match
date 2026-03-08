const express = require("express");
const User = require("../models/User");
const { auth } = require("../middleware/auth");

const router = express.Router();

router.get("/me", auth, async (req, res, next) => {
  try {
    const me = await User.findById(req.user.userId).lean();
    res.json(me);
  } catch (error) {
    next(error);
  }
});

router.put("/me", auth, async (req, res, next) => {
  try {
    const patch = {};
    if (typeof req.body.name === "string") patch.name = req.body.name;
    if (typeof req.body.city === "string") patch.city = req.body.city;
    if (Array.isArray(req.body.interests)) patch.interests = req.body.interests;

    const me = await User.findByIdAndUpdate(req.user.userId, patch, { new: true }).lean();
    res.json(me);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
