// This script only updates category documents to ensure department is a string (department name), not ObjectId.
// It does NOT affect user documents. No user department field exists.
const mongoose = require("mongoose");
const Category = require("../models/Category");
const Department = require("../models/Department");

function isObjectIdString(str) {
  return typeof str === "string" && /^[a-f\d]{24}$/i.test(str);
}

async function fixCategoryDepartments() {
  await mongoose.connect("mongodb://localhost:27017/YOUR_DB_NAME"); // <-- Replace with your DB name
  const categories = await Category.find({});
  for (const cat of categories) {
    let deptId = null;
    if (typeof cat.department === "object" && cat.department && cat.department._bsontype === "ObjectID") {
      deptId = cat.department;
    } else if (isObjectIdString(cat.department)) {
      deptId = cat.department;
    }
    if (deptId) {
      const dept = await Department.findById(deptId);
      if (dept) {
        cat.department = dept.name;
        await cat.save();
        console.log(`Updated category ${cat.name} to department ${dept.name}`);
      }
    }
  }
  console.log("Done!");
  process.exit();
}

fixCategoryDepartments();
