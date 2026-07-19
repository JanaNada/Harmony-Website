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

router.get(
    "/admin-test",
    authenticate,
    authorize("ADMIN"),
    (req, res) => {
        res.json({
            success: true,
            message: "Welcome admin!",
            user: req.user
        });
    }
);

router.get(
    "/company-test",
    authenticate,
    authorize("COMPANY"),
    (req, res) => {
        res.json({
            success: true,
            message: "Welcome company!",
            user: req.user
        });
    }
);

module.exports = router;