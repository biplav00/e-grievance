const express = require("express");
const router = express.Router();
const { adminAuth } = require("../middleware/auth");
const adminController = require("../controllers/adminController");

router.get("/admins", adminAuth, adminController.getAdmins);
router.put("/admins/:id", adminAuth, adminController.updateAdmin);
router.delete("/admins/:id", adminAuth, adminController.deleteAdmin);
router.get("/citizens", adminAuth, adminController.getCitizens);
router.put("/citizens/:id", adminAuth, adminController.updateCitizen);
router.delete("/citizens/:id", adminAuth, adminController.deleteCitizen);

module.exports = router;
