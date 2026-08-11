const express = require("express");
const router = express.Router();

const { listMessages, sendMessage, getUnreadCounts } = require("../controllers/messageController");
const { authenticate, authorize } = require("../middleware/authMiddleware");

router.get("/unread", authenticate, authorize("ADMIN", "COORDINATOR", "COMPANY"), getUnreadCounts);
router.get("/:requestId", authenticate, authorize("ADMIN", "COORDINATOR", "COMPANY"), listMessages);
router.post("/:requestId", authenticate, authorize("ADMIN", "COORDINATOR", "COMPANY"), sendMessage);

module.exports = router;
