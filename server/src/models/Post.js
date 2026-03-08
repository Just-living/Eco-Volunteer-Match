const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    imageUrl: { type: String, default: null },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    likes: { type: Number, default: 0 },
    createdAtISO: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
