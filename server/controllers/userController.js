const User = require("../models/User");
const Grievance = require("../models/Grievance");

// Delete the authenticated user's account and their grievances
exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    // Delete all grievances submitted by this user
    await Grievance.deleteMany({ submittedBy: userId });
    // Delete the user
    await User.findByIdAndDelete(userId);
    res.json({ msg: "Account and grievances deleted successfully." });
  } catch (err) {
    console.error("ERROR in deleteAccount:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};
