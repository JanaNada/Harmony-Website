const express = require("express");
const router = express.Router();

const {
  getCompanyDashboard,
  createCompanyContactMessage,
  getMyContactMessages,
} = require("../controllers/companyDashboardController");

const {
  authenticate,
  authorize,
} = require("../middleware/authMiddleware");

router.get(
  "/",
  authenticate,
  authorize("COMPANY"),
  getCompanyDashboard
);

router.post(
  "/contact",
  authenticate,
  authorize("COMPANY"),
  createCompanyContactMessage
);

router.get(
  "/contact",
  authenticate,
  authorize("COMPANY"),
  getMyContactMessages
);

module.exports = router;
