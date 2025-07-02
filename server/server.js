const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const path = require("path"); // Add this to the top
require("dotenv").config();

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(cors());
app.use(express.json({ extended: false }));

// Define Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/grievances", require("./routes/grievances"));
app.use("/api/settings", require("./routes/settings"));
// app.use("/api/category", require("./routes/category")); // Category management removed
app.use("/api/department", require("./routes/department"));
app.use("/api/admin", require("./routes/admin"));

app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Add this before app.listen

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
