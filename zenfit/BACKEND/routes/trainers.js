const express = require("express");
const router = express.Router();
const Trainer = require("../models/Trainer");
const jwt = require("jsonwebtoken");

const authorizeAdmin = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") {
      return res.status(403).json({ error: "Forbidden: Admin access only." });
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
};
router.get("/", async (req, res) => {
  try {
    const trainers = await Trainer.find();
    res.json(trainers);
  } catch (error) {
    console.error("Error fetching trainers:", error);
    res.status(500).json({ error: "Server error while fetching trainers." });
  }
});

router.post("/", authorizeAdmin, async (req, res) => {
  try {
    const newTrainer = new Trainer(req.body);
    await newTrainer.save();
    res.status(201).json(newTrainer);
  } catch (error) {
    console.error("Error creating trainer:", error);
    res.status(500).json({ error: "Server error while creating trainer." });
  }
});
router.put("/:id", authorizeAdmin, async (req, res) => {
  try {
    const updatedTrainer = await Trainer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedTrainer) {
      return res.status(404).json({ error: "Trainer not found." });
    }
    res.json(updatedTrainer);
  } catch (error) {
    console.error("Error updating trainer:", error);
    res.status(500).json({ error: "Server error while updating trainer." });
  }
});

router.delete("/:id", authorizeAdmin, async (req, res) => {
  try {
    const deletedTrainer = await Trainer.findByIdAndDelete(req.params.id);
    if (!deletedTrainer) {
      return res.status(404).json({ error: "Trainer not found." });
    }
    res.json({ message: "Trainer deleted successfully." });
  } catch (error) {
    console.error("Error deleting trainer:", error);
    res.status(500).json({ error: "Server error while deleting trainer." });
  }
});
router.get("/:id", async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id);
    if (!trainer) {
      return res.status(404).json({ error: "Trainer not found." });
    }
    res.json(trainer);
  } catch (error) {
    console.error("Error fetching trainer:", error);
    res.status(500).json({ error: "Server error while fetching trainer." });
  }
});

module.exports = router;
