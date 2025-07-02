const Category = require("../models/Category");
const Department = require("../models/Department");
const User = require("../models/User");

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

exports.addCategory = async (req, res) => {
  const { name, department } = req.body;
  if (!name || !department) return res.status(400).json({ msg: "Name and department required" });
  try {
    const cat = new Category({ name, department });
    await cat.save();
    res.status(201).json(cat);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

exports.getDepartments = async (req, res) => {
  try {
    const departments = await Department.find();
    res.json(departments);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

exports.addDepartment = async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ msg: "Department name required" });
  try {
    const exists = await Department.findOne({ name });
    if (exists) return res.status(400).json({ msg: "Department already exists" });
    const dept = new Department({ name });
    await dept.save();
    res.status(201).json(dept);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};
