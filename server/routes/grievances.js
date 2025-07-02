const express = require("express");
const router = express.Router();
const grievanceController = require("../controllers/grievanceController");
const adminController = require("../controllers/adminController");
const { citizenAuth } = require("../middleware/auth");
const upload = require("../middleware/upload");

// --- CITIZEN ROUTES ---
router.post("/", citizenAuth, grievanceController.createGrievance);
router.get("/my-grievances", citizenAuth, grievanceController.getMyGrievances);

// --- ADMIN ROUTES ---
router.get("/department", grievanceController.getDepartmentGrievances);
router.get("/stats", adminController.getDashboardStats);

router.put("/:id/status", grievanceController.updateGrievanceStatus);
router.get("/:id", citizenAuth, grievanceController.getGrievanceById);
router.put("/:id", citizenAuth, upload, grievanceController.updateGrievance);
router.delete("/:id", citizenAuth, grievanceController.deleteGrievance); // Updated to allow any user to delete a grievance by ID
router.get("/", grievanceController.getAllGrievances);



module.exports = router;
