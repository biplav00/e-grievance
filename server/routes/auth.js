const express = require("express");
const router = express.Router();
const { adminAuth, anyAuth } = require("../middleware/auth");
const { citizenAuth } = require("../middleware/auth"); // We will create this next
const { registerUser, loginUser } = require("../controllers/authController");
const { deleteAccount } = require("../controllers/userController");

// Public route for anyone to log in
router.post("/login", loginUser);

// Public route for citizens to register
router.post("/register", registerUser);

// Protected route for an admin to create another user (could be admin or citizen)
router.post("/register-by-admin", adminAuth, registerUser);

// Delete own account (authenticated user)
router.delete("/me", anyAuth, deleteAccount);

module.exports = router; // Note: We will add more to this file later
