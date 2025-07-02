const express = require("express");
const router = express.Router();
const { adminAuth } = require("../middleware/auth");
const settingsController = require("../controllers/settingsController");

// Category routes
router.get("/categories", adminAuth, settingsController.getCategories);
router.post("/categories", adminAuth, settingsController.addCategory);

// Department routes
router.get("/departments", adminAuth, settingsController.getDepartments);
router.post("/departments", adminAuth, settingsController.addDepartment);

module.exports = router;
