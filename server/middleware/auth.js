const jwt = require("jsonwebtoken");
require("dotenv").config();

const auth = () => {
  return (req, res, next) => {
    const token = req.header("x-auth-token");
    if (!token) return res.status(401).json({ msg: "No token, authorization denied" });
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded.user;
      next();
    } catch (err) {
      res.status(401).json({ msg: "Token is not valid" });
    }
  };
};

// Export specific middleware for convenience
exports.adminAuth = auth();
exports.citizenAuth = auth();
exports.anyAuth = auth();
exports.superAdminAuth = auth();

// Soft auth middleware: sets req.user if token is present, but never blocks
exports.softAuth = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded.user;
    } catch (err) {
      req.user = null;
    }
  }
  next();
};
