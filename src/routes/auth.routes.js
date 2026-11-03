const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");

// Customer Registration & Login
router.post("/signup", authController.signup);
router.post("/login", authController.login);

// Get current logged-in user
router.get("/me", authMiddleware, authController.getMe);

module.exports = router;

