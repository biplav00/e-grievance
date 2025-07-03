const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

// Connect Database
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Enhanced CORS configuration
const corsOptions = {
  origin: process.env.CLIENT_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
};

// Handle preflight requests
app.options('*', cors(corsOptions));

// Init Middleware
app.use(cors(corsOptions));
app.use(express.json({ extended: false }));

// Define Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/grievances", require("./routes/grievances"));
app.use("/api/settings", require("./routes/settings"));
app.use("/api/department", require("./routes/department"));
app.use("/api/admin", require("./routes/admin"));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 5001;

app.listen(PORT);
