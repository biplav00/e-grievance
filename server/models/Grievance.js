const mongoose = require("mongoose");

const GrievanceSchema = new mongoose.Schema({
  trackingId: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  address: { type: String },
  status: {
    type: String,
    enum: ["Submitted", "In Progress", "Resolved"],
    default: "Submitted",
  },
  photos: [{ type: String }],
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: "department" },
  feedback: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("grievance", GrievanceSchema);
