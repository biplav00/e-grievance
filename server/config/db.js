const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
      } catch (err) {
    console.error("MongoDB Connection Error:", err.message);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
