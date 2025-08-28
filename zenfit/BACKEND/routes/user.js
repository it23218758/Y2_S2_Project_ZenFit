const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const {authMiddleware} = require("../middlewares/authMiddleware");

const router = express.Router();

// 🔹 Get all users (Protected)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔹 Get a single user by ID (Protected)
router.get("/get/:id", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// 🔹 Register a new user
router.post("/register", async (req, res) => {
  const { firstname, lastname, email, contact, password, role } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ error: "Email already in use" });

    user = new User({ firstname, lastname, email, contact, password, role });
    await user.save();

    res.json({ message: "User registered successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 🔹 Login user
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    if (!process.env.JWT_SECRET) {
      console.error("Missing JWT_SECRET in environment variables");
      return res.status(500).json({ error: "Server configuration error" });
    }

    // Generate token with user details
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
        firstname: user.firstname,
        lastname: user.lastname,
      },
      process.env.JWT_SECRET,
      { expiresIn: "2d" }
    );
    // Send response
    res.json({
      token,
      userId: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      role: user.role,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// 🔹 Update user (Protected)
router.put("/update/:id", authMiddleware, async (req, res) => {
  const { firstname, lastname, email, contact, password, role } = req.body;

  try {
    const updatedData = { firstname, lastname, email, contact, role };
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updatedData.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 🔹 Delete user (Protected)
router.delete("/delete/:id", authMiddleware, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
