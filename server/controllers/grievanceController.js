const path = require("path");
const Grievance = require("../models/Grievance");
const User = require("../models/User"); // Import User model
const upload = require("../middleware/upload");
const formatGrievance = require("../utils/formatGrievance");

exports.createGrievance = [
  upload, // Multer middleware for file upload
  async (req, res) => {
    if (!req.user || req.user.role !== "citizen") {
      return res.status(403).json({ msg: "Only citizens can submit grievances." });
    }
    try {
      const { description, address, department } = req.body;
      const category = req.body.category || "General"; // Default to "General" if not provided
      if (!category || typeof category !== "string") {
        return res.status(400).json({ msg: "Valid category is required" });
      }
      const photos = req.file ? [req.file.path] : [];
      const newGrievance = new Grievance({
        trackingId: `GRV-${Date.now()}`,
        category: category.trim(), // Store as trimmed string
        description,
        address,
        photos,
        submittedBy: req.user.id,
        department,
      });

      const grievance = await newGrievance.save();
      // Populate department and submittedBy for consistent response
      await grievance.populate('department', 'name');
      await grievance.populate('submittedBy', 'email');
      res.status(201).json(formatGrievance(grievance, req));
    } catch (err) {
      console.error("ERROR in createGrievance:", err);
      res.status(500).send("Server Error");
    }
  },
];

exports.getMyGrievances = async (req, res) => {
  try {
    console.log("[getMyGrievances] req.user:", req.user);
    if (!req.user || !req.user.id) {
      return res.status(401).json({ msg: "No user in request (auth failed)" });
    }
    const grievances = await Grievance.find({ submittedBy: req.user.id })
      .populate('department', 'name')
      .sort({ createdAt: -1 })
      .lean();
    const result = grievances.map((g) => formatGrievance(g, req));
    res.json(result);
  } catch (err) {
    console.error("ERROR in getMyGrievances:", err);
    res.status(500).send("Server Error");
  }
};

// Remove department-based filtering, just return all grievances
exports.getDepartmentGrievances = async (req, res) => {
  try {
    const grievances = await Grievance.find({})

      .populate("submittedBy", "email")
      .sort({ createdAt: -1 });
    res.json(grievances);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

exports.updateGrievanceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    console.log(`[updateGrievanceStatus] id: ${id}, status: ${status}, user:`, req.user);
    if (!req.user) {
      console.error("No user found in request. Headers:", req.headers);
      return res.status(401).json({ msg: "No user in request (auth failed)" });
    }
    if (!status || !["Submitted", "In Progress", "Resolved"].includes(status)) {
      return res.status(400).json({ msg: "Invalid status value" });
    }
    const grievance = await Grievance.findById(id);
    if (!grievance) return res.status(404).json({ msg: "Grievance not found" });
    grievance.status = status;
    await grievance.save();
    console.log(`[updateGrievanceStatus] Updated grievance ${id} to status ${status}`);
    res.json({ status });
  } catch (err) {
    console.error("ERROR in updateGrievanceStatus:", err);
    res.status(500).send("Server Error");
  }
};

// New function to get all categories


// New function to get a single grievance by ID
exports.getGrievanceById = async (req, res) => {
  try {
    const grievance = await Grievance.findById(req.params.id)
      .populate("submittedBy", "email")
      .populate("department", "name");
    if (!grievance) return res.status(404).json({ msg: "Grievance not found" });
    res.json(formatGrievance(grievance, req));
  } catch (err) {
    console.error("ERROR in getGrievanceById:", err);
    res.status(500).send("Server Error");
  }
};

// Remove all role and permission checks from getAllGrievances
exports.getAllGrievances = async (req, res) => {
  try {
    const grievances = await Grievance.find()
      .populate("submittedBy", "email")
      .populate("department", "name")
      .sort({ createdAt: -1 })
      .lean();
    const safeGrievances = grievances.map((g) => formatGrievance(g, req));
    res.json(safeGrievances);
  } catch (err) {
    console.error("ERROR in getAllGrievances:", err);
    res.status(500).send("Server Error");
  }
};

// Restrict admin: only allow status and feedback update, not edit/delete
exports.updateGrievance = async (req, res) => {
  try {
    const { id } = req.params;
    const grievance = await Grievance.findById(id);
    if (!grievance) return res.status(404).json({ msg: "Grievance not found" });

    // If admin, only allow status and feedback
    if (req.user && req.user.role === 'admin') {
      const { status, feedback } = req.body;
      if (status) grievance.status = status;
      if (feedback) grievance.feedback = feedback;
    } else {
      // Support both JSON and multipart/form-data for citizens
      const isMultipart = req.headers['content-type'] && req.headers['content-type'].includes('multipart/form-data');
      if (isMultipart) {
        if (req.file) {
          grievance.photos = [req.file.path];
        }
        if (req.body.description) grievance.description = req.body.description;
        if (req.body.address) grievance.address = req.body.address;
        if (req.body.category) grievance.category = req.body.category;
        if (req.body.department) grievance.department = req.body.department;
      } else {
        const { description, address, category, department, photos } = req.body;
        if (description) grievance.description = description;
        if (address) grievance.address = address;
        if (category) grievance.category = category;
        if (department) grievance.department = department;
        if (photos && Array.isArray(photos)) {
          grievance.photos = photos;
        }
      }
    }
    await grievance.save();
    await grievance.populate('department', 'name');
    await grievance.populate('submittedBy', 'email');
    res.json(formatGrievance(grievance, req));
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

// Prevent admin from deleting grievances
exports.deleteGrievance = async (req, res) => {
  try {
    if (req.user && req.user.role === 'admin') {
      return res.status(403).json({ msg: "Admins are not allowed to delete grievances." });
    }
    const { id } = req.params;
    const grievance = await Grievance.findById(id);
    if (!grievance) return res.status(404).json({ msg: "Grievance not found" });
    await grievance.deleteOne();
    res.json({ msg: "Grievance deleted" });
  } catch (err) {
    res.status(500).send("Server Error");
  }
};
