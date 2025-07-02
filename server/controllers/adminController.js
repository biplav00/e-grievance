const Grievance = require("../models/Grievance");
const User = require("../models/User");
const Category = require("../models/Category");
const bcrypt = require("bcryptjs");

exports.getDashboardStats = async (req, res) => {
  try {
    // Show stats for all grievances and categories
    const totalGrievances = await Grievance.countDocuments();
    const submitted = await Grievance.countDocuments({ status: "Submitted" });
    const inProgress = await Grievance.countDocuments({ status: "In Progress" });
    const resolved = await Grievance.countDocuments({ status: "Resolved" });

    // Grievances per category
    const grievancesPerCategory = await Grievance.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $lookup: { from: "categories", localField: "_id", foreignField: "_id", as: "categoryDetails" } },
      { $unwind: "$categoryDetails" },
      { $project: { _id: 0, category: "$categoryDetails.name", count: 1 } },
    ]);

    // Grievances per department
    const grievancesPerDepartment = await Grievance.aggregate([
      { $group: { _id: "$department", count: { $sum: 1 } } },
      { $lookup: { from: "departments", localField: "_id", foreignField: "_id", as: "departmentDetails" } },
      { $unwind: "$departmentDetails" },
      { $project: { _id: 0, department: "$departmentDetails.name", count: 1 } },
    ]);

    // Grievances per day (last 14 days)
    const days = 14;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (days - 1));
    startDate.setHours(0, 0, 0, 0);

    const grievancesPerDayRaw = await Grievance.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Fill missing days with 0
    const grievancesPerDay = [];
    for (let i = 0; i < days; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().slice(0, 10);
      const found = grievancesPerDayRaw.find(g => g._id === dateStr);
      grievancesPerDay.push({ date: dateStr, count: found ? found.count : 0 });
    }

    res.json({ totalGrievances, submitted, inProgress, resolved, grievancesPerCategory, grievancesPerDepartment, grievancesPerDay });
  } catch (err) {
    console.error("Error fetching admin stats:", err);
    res.status(500).send("Server Error");
  }
};

exports.getAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" }).select("_id fullname email department").lean();
    res.json(admins);
  } catch (err) {
    console.error("Error fetching admins:", err);
    res.status(500).send("Server Error");
  }
};

exports.updateAdmin = async (req, res) => {
  const { fullname, email, password, department } = req.body;
  try {
    const update = { fullname, email, department };
    if (password && password.length >= 6) {
      const salt = await bcrypt.genSalt(10);
      update.password = await bcrypt.hash(password, salt);
    }
    // Basic validation
    if (!fullname || !email) {
      return res.status(400).json({ msg: "Fullname and email are required." });
    }
    const admin = await User.findByIdAndUpdate(req.params.id, update, { new: true }).select(
      "_id fullname email department"
    );
    if (!admin) return res.status(404).json({ msg: "Admin not found" });
    res.json(admin);
  } catch (err) {
    console.error("Error updating admin:", err);
    res.status(500).send("Server Error");
  }
};

exports.deleteAdmin = async (req, res) => {
  try {
    const admin = await User.findByIdAndDelete(req.params.id);
    if (!admin) return res.status(404).json({ msg: "Admin not found" });
    res.json({ msg: "Admin deleted", admin });
  } catch (err) {
    console.error("Error deleting admin:", err);
    res.status(500).send("Server Error");
  }
};

exports.getCitizens = async (req, res) => {
  try {
    const citizens = await User.find({ role: "citizen" }).select("_id fullname email createdAt").lean();
    res.json(citizens);
  } catch (err) {
    console.error("Error fetching citizens:", err);
    res.status(500).send("Server Error");
  }
};

exports.deleteCitizen = async (req, res) => {
  try {
    const citizen = await User.findOneAndDelete({ _id: req.params.id, role: "citizen" });
    if (!citizen) return res.status(404).json({ msg: "Citizen not found" });
    res.json({ msg: "Citizen deleted", citizen });
  } catch (err) {
    console.error("Error deleting citizen:", err);
    res.status(500).send("Server Error");
  }
};

exports.updateCitizen = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;
    // Basic validation
    if (!fullname || !email) {
      return res.status(400).json({ msg: "Fullname and email are required." });
    }
    const update = { fullname, email };
    if (password) {
      const salt = await bcrypt.genSalt(10);
      update.password = await bcrypt.hash(password, salt);
    }
    const citizen = await User.findOneAndUpdate({ _id: req.params.id, role: "citizen" }, update, { new: true }).select(
      "_id fullname email createdAt"
    );
    if (!citizen) return res.status(404).json({ msg: "Citizen not found" });
    res.json(citizen);
  } catch (err) {
    console.error("Error updating citizen:", err);
    res.status(500).send("Server Error");
  }
};
