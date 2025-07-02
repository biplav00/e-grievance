const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: function () {
      return this.role === "admin";
    },
    default: "",
  },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["citizen", "admin"], default: "citizen" },
  // NEW: Department for admins
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("user", UserSchema);
