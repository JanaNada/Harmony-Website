const express = require("express");
const router = express.Router();

const {
  registerCompany,
  login,
  logout,
  getCurrentUser,
} = require("../controllers/authController");

const {
  authenticate,
  authorize
} = require("../middleware/authMiddleware");

router.post("/register", registerCompany);

router.post("/login", login);

router.post("/logout", logout);

router.get("/me", authenticate, getCurrentUser);

module.exports = router;