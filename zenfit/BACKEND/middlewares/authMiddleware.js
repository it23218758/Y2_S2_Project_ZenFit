const jwt = require("jsonwebtoken");
require("dotenv").config(); // Load environment variables

// Middleware to verify JWT and extract user role
const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");

  console.log(token);

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(
      token.replace("Bearer ", ""),
      process.env.JWT_SECRET
    );
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

//  Middleware for Admin
const authorizeAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Forbidden: Admin access only." });
  }
  next();
};

//  Middleware for User
const authorizeUser = (req, res, next) => {
  if (!req.user || req.user.role !== "user") {
    return res.status(403).json({ error: "Forbidden: User access only." });
  }
  next();
};

//  Middleware for Trainer
const authorizeTrainer = (req, res, next) => {
  if (!req.user || req.user.role !== "trainer") {
    return res.status(403).json({ error: "Forbidden: Trainer access only." });
  }
  next();
};

const authorizeUserOrAdmin = (req, res, next) => {
    if (req.user.role === "user" || req.user.role === "admin") {
      next();
    } else {
      return res.status(403).json({ error: "Forbidden: Only users or admins allowed." });
    }
  };
//  Export all functions properly
module.exports = {
  authMiddleware,
  authorizeAdmin,
  authorizeUser,
  authorizeTrainer,
  authorizeUserOrAdmin,
};
