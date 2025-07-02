const Department = require("../models/Department");
const Category = require("../models/Category");

// Get all departments
exports.getDepartments = async (req, res) => {
  try {
    const departments = await Department.find().sort({ name: 1 });
    res.json(departments);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

// Create a new department
exports.addDepartment = async (req, res) => {
  const { name } = req.body;
  if (!name || typeof name !== "string" || !name.trim()) {
    return res.status(400).json({ msg: "Department name is required" });
  }
  try {
    const exists = await Department.findOne({ name: name.trim() });
    if (exists) return res.status(400).json({ msg: "Department already exists" });
    const dept = new Department({ name: name.trim() });
    await dept.save();
    res.status(201).json(dept);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

// Update department name by _id
exports.editDepartment = async (req, res) => {
  const { id } = req.params;
  const { newName } = req.body;
  if (!newName || typeof newName !== "string" || !newName.trim()) {
    return res.status(400).json({ msg: "New department name is required" });
  }
  try {
    const dept = await Department.findByIdAndUpdate(id, { name: newName.trim() }, { new: true });
    if (!dept) return res.status(404).json({ msg: "Department not found" });
    // Update all categories with the old department name
    await Category.updateMany({ department: dept.name }, { department: newName.trim() });
    res.json({ msg: "Department updated", department: dept });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

// Delete department by _id
exports.deleteDepartment = async (req, res) => {
  const { id } = req.params;
  try {
    const dept = await Department.findByIdAndDelete(id);
    if (!dept) return res.status(404).json({ msg: "Department not found" });
    // Delete all categories with this department
    await Category.deleteMany({ department: dept.name });
    res.json({ msg: "Department deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};
