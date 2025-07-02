// Script to update all admin users to have a fullname if missing
const mongoose = require("mongoose");
const path = require("path");
const User = require(path.join(__dirname, "../models/User"));

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/grievance-system";

async function updateAdminFullnames() {
  await mongoose.connect(MONGO_URI);
  const admins = await User.find({ role: "admin" });
  for (const admin of admins) {
    if (!admin.fullname || admin.fullname.trim() === "") {
      // Use email prefix as fallback
      const fallback = admin.email.split("@")[0];
      admin.fullname = fallback.charAt(0).toUpperCase() + fallback.slice(1);
      await admin.save();
      console.log(`Updated admin ${admin.email} with fullname: ${admin.fullname}`);
    }
  }
  await mongoose.disconnect();
  console.log("Done updating admin fullnames.");
}

updateAdminFullnames();
