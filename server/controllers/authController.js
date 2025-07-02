const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// For citizens and admins
exports.registerUser = async (req, res) => {
  const { fullname, email, password, role } = req.body;

  if (!email || !password || password.length < 6) {
    return res.status(400).json({ msg: "Please provide a valid email and a password of at least 6 characters." });
  }

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User with this email already exists" });

    user = new User({ fullname, email, password, role: role || "citizen" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    res.status(201).json({
      msg: "User created successfully",
      user: { fullname: user.fullname, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("ERROR in registerUser:", err.message);
    res.status(500).send("Server error");
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid Credentials" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid Credentials" });

    const payload = { user: { id: user.id, role: user.role, fullname: user.fullname } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "5h" }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error("ERROR in loginUser:", err.message);
    res.status(500).send("Server error");
  }
};
