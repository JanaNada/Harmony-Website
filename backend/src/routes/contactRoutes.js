const express = require("express");
const router = express.Router();

const {
  createContactMessage,
  getAllContactMessages,
  getContactMessageById,
  updateContactMessageStatus,
} = require("../controllers/contactController");

const {
  authenticate,
  authorize,
} = require("../middleware/authMiddleware");

// Public: anyone can send a contact message
router.post("/", createContactMessage);

// Admin: view all contact messages
router.get(
  "/",
  authenticate,
  authorize("ADMIN"),
  getAllContactMessages
);

// Admin: view one contact message
router.get(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  getContactMessageById
);

// Admin: update message status
router.patch(
  "/:id/status",
  authenticate,
  authorize("ADMIN"),
  updateContactMessageStatus
);

module.exports = router;