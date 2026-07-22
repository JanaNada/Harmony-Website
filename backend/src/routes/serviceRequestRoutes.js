const express = require("express");
const router = express.Router();

const {
  createServiceRequest,
  getCompanyServiceRequests,
  getAllServiceRequests,
  getServiceRequestById,
  updateServiceRequestStatus,
} = require("../controllers/serviceRequestController");

const {
  authenticate,
  authorize,
} = require("../middleware/authMiddleware");

router.post(
  "/",
  authenticate,
  authorize("COMPANY"),
  createServiceRequest
);

router.get(
  "/my",
  authenticate,
  authorize("COMPANY"),
  getCompanyServiceRequests
);

router.get(
  "/",
  authenticate,
  authorize("ADMIN"),
  getAllServiceRequests
);

router.get(
  "/:id",
  authenticate,
  authorize("ADMIN", "COMPANY"),
  getServiceRequestById
);

router.patch(
  "/:id/status",
  authenticate,
  authorize("ADMIN"),
  updateServiceRequestStatus
);

module.exports = router;