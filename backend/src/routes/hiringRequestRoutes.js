const express = require("express");
const router = express.Router();

const { createHiringRequest } = require("../controllers/hiringRequestController");

// We don't require authentication for submitting the form directly from the public site,
// but you can add authenticate middleware if needed.
router.post("/", createHiringRequest);

module.exports = router;
