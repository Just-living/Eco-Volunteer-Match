const express = require("express");
const Post = require("../models/Post");
const { auth } = require("../middleware/auth");
const { upload, processImage } = require("../middleware/upload");
const fs = require("fs");
const path = require("path");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const posts = await Post.find()
      .populate("userId", "name email")
      .populate("likedBy", "name")
      .sort({ createdAtISO: -1 })
      .lean();
    
    res.json(posts);
  } catch (error) {
    next(error);
  }
});

router.post("/", auth, upload.single("image"), processImage, async (req, res, next) => {
  try {
    const content = (req.body.content || "").trim();
    if (content.length < 3) return res.status(400).json({ message: "Post too short" });

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const post = await Post.create({
      userId: req.user.userId,
      content,
      imageUrl,
      likedBy: [],
      likes: 0,
      createdAtISO: new Date().toISOString()
    });

    // Populate user info before sending response
    await post.populate("userId", "name email");
    res.json({ ...post.toObject(), isLiked: false });
  } catch (error) {
    next(error);
  }
});

// Like/Unlike a post
router.post("/:postId/like", auth, async (req, res, next) => {
  try {
    const { postId } = req.params;
    const userId = req.user.userId;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const isLiked = post.likedBy.some((id) => String(id) === String(userId));

    if (isLiked) {
      // Unlike: remove user from likedBy array
      post.likedBy = post.likedBy.filter((id) => String(id) !== String(userId));
      post.likes = Math.max(0, post.likes - 1);
    } else {
      // Like: add user to likedBy array
      post.likedBy.push(userId);
      post.likes = post.likes + 1;
    }

    await post.save();
    await post.populate("userId", "name email");
    await post.populate("likedBy", "name");

    res.json({
      ...post.toObject(),
      isLiked: !isLiked
    });
  } catch (error) {
    next(error);
  }
});

// Delete a post (only by owner)
router.delete("/:postId", auth, async (req, res, next) => {
  try {
    const { postId } = req.params;
    const userId = req.user.userId;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Check if user owns the post
    if (String(post.userId) !== String(userId)) {
      return res.status(403).json({ message: "You can only delete your own posts" });
    }

    // Delete associated image file if exists
    if (post.imageUrl) {
      const imagePath = path.join(__dirname, "../../uploads", path.basename(post.imageUrl));
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Post.findByIdAndDelete(postId);
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
