const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.memoryStorage(); // Store in memory for processing

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed (jpeg, jpg, png, gif, webp)"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit before compression
});

// Middleware to compress and resize images
const processImage = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  try {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = `post-${uniqueSuffix}.webp`;
    const filepath = path.join(uploadsDir, filename);

    // Resize and compress image
    // Max width: 1200px, Max height: 1200px, Quality: 80%
    await sharp(req.file.buffer)
      .resize(1200, 1200, {
        fit: "inside",
        withoutEnlargement: true
      })
      .webp({ quality: 80 })
      .toFile(filepath);

    // Update req.file with processed image info
    req.file.filename = filename;
    req.file.path = filepath;
    req.file.size = fs.statSync(filepath).size;

    // Check if file is still too large (shouldn't happen, but safety check)
    if (req.file.size > 2 * 1024 * 1024) {
      // If still over 2MB, compress more aggressively
      await sharp(req.file.buffer)
        .resize(800, 800, {
          fit: "inside",
          withoutEnlargement: true
        })
        .webp({ quality: 70 })
        .toFile(filepath);
      req.file.size = fs.statSync(filepath).size;
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { upload, processImage };
