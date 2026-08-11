const express = require("express");
const router = express.Router();

const { listStaff, createStaff, updateStaff } = require("../controllers/staffController");
const { authenticate, authorize } = require("../middleware/authMiddleware");

// Managing staff accounts is admin-only — a coordinator can't grant access.
router.get("/", authenticate, authorize("ADMIN"), listStaff);
router.post("/", authenticate, authorize("ADMIN"), createStaff);
router.put("/:id", authenticate, authorize("ADMIN"), updateStaff);

module.exports = router;
