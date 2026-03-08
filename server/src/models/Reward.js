const mongoose = require("mongoose");

const RewardSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    cost: { type: Number, required: true },
    description: { type: String, default: "" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reward", RewardSchema);
