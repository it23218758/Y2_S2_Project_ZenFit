const express = require("express");
const router = express.Router();
const Feedback = require("../models/Feedback");

// ✅ CREATE - Submit feedback
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, subject, type, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Name, email, and message are required." });
    }

    const newFeedback = new Feedback({ name, email, phone, subject, type, message });
    await newFeedback.save();

    res.status(201).json({ message: "Feedback submitted successfully!", feedback: newFeedback });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    res.status(500).json({ error: "Server error while submitting feedback." });
  }
});

// ✅ READ - Get all feedbacks
router.get("/", async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    res.status(500).json({ error: "Server error while fetching feedbacks." });
  }
});

// ✅ READ - Get a specific feedback by ID
router.get("/:id", async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ error: "Feedback not found" });
    }
    res.json(feedback);
  } catch (error) {
    console.error("Error fetching feedback by ID:", error);
    res.status(500).json({ error: "Server error while fetching feedback." });
  }
});

// ✅ UPDATE - Update feedback by ID
router.put("/:id", async (req, res) => {
  try {
    const { name, email, phone, subject, type, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Name, email, and message are required." });
    }

    const updatedFeedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, subject, type, message },
      { new: true }
    );

    if (!updatedFeedback) {
      return res.status(404).json({ error: "Feedback not found" });
    }

    res.json({ message: "Feedback updated successfully!", feedback: updatedFeedback });
  } catch (error) {
    console.error("Error updating feedback:", error);
    res.status(500).json({ error: "Server error while updating feedback." });
  }
});

// ✅ DELETE - Remove feedback by ID
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Feedback.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Feedback not found" });
    res.json({ message: "Feedback deleted successfully" });
  } catch (err) {
    console.error("Error deleting feedback:", err);
    res.status(500).json({ error: "Server error while deleting feedback" });
  }
});

module.exports = router;
