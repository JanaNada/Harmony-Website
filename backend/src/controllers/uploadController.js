const path = require("path");
const fs = require("fs");
const multer = require("multer");

/**
 * Image uploads for the service catalogue.
 *
 * Files land in backend/uploads and are served back as /uploads/<name>, which
 * Next proxies through so the browser sees one origin.
 */

const UPLOAD_DIR = path.join(__dirname, "..", "..", "uploads");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"]);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    /* Never trust the client's filename on disk — it can carry path segments
       or characters the filesystem treats specially. Keep only the extension
       and generate the rest. */
    const ext = path.extname(file.originalname).toLowerCase().slice(0, 10);
    const safeExt = /^\.[a-z0-9]+$/.test(ext) ? ext : "";
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2, 10)}${safeExt}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    if (!ALLOWED.has(file.mimetype)) {
      return cb(new Error("Only JPG, PNG, WEBP, GIF or AVIF images are allowed"));
    }
    cb(null, true);
  },
});

/** Wraps multer so its errors come back as JSON rather than an HTML stack. */
const uploadImage = (req, res) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      const tooBig = err.code === "LIMIT_FILE_SIZE";
      return res.status(400).json({
        success: false,
        message: tooBig ? "That image is over the 5 MB limit" : err.message,
      });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image was uploaded" });
    }

    return res.status(201).json({ success: true, url: `/uploads/${req.file.filename}` });
  });
};

module.exports = { uploadImage, UPLOAD_DIR };
