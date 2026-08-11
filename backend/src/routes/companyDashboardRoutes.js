const express = require("express");
const router = express.Router();

const {
  getCompanyDashboard,
  getMyProfile,
  saveMyProfile,
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

// Every signed-in company user has a profile, even before it's filled in.
router.get(
  "/profile",
  authenticate,
  authorize("COMPANY"),
  getMyProfile
);

router.put(
  "/profile",
  authenticate,
  authorize("COMPANY"),
  saveMyProfile
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
