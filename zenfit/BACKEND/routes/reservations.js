const express = require("express");
const router = express.Router();
const Reservation = require("../models/Reservation");
const {
  authMiddleware,
  authorizeAdmin,
  authorizeUser,
  authorizeTrainer,
  authorizeUserOrAdmin,
} = require("../middlewares/authMiddleware");
const moment = require("moment");

router.get(
    "/check-availability",
    authMiddleware,
    authorizeUserOrAdmin,
    async (req, res) => {
      try {
        const { trainerId, sessionDate, sessionTime } = req.query;
  
        if (!trainerId || !sessionDate || !sessionTime) {
          return res
            .status(400)
            .json({ error: "Missing required query parameters" });
        }
  
        const start = moment(`${sessionDate} ${sessionTime}`, "YYYY-MM-DD HH:mm");
        const end = moment(start).add(2, "hours");
  
        const overlappingReservation = await Reservation.findOne({
          trainerId,
          sessionDate: sessionDate,
          sessionTime: {
            $gte: start.format("HH:mm"),
            $lt: end.format("HH:mm"),
          },
        });
  
        if (overlappingReservation) {
          return res.json({
            available: false,
            message: "Trainer is not available for the selected time slot.",
          });
        } else {
          return res.json({
            available: true,
            message: "Trainer is available!",
          });
        }
      } catch (error) {
        console.error("Error checking availability:", error);
        res.status(500).json({
          error: "Server error while checking availability",
        });
      }
    }
  );
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate("userId", "firstname lastname email")
      .populate("trainerId", "firstname lastname specialization");

    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    // Allow access if user is admin, the owner, or the trainer assigned
    const userRole = req.user.role;
    const userId = req.user.userId;

    if (
      userRole === "admin" ||
      reservation.userId?._id?.toString() === userId ||
      reservation.trainerId?._id?.toString() === userId
    ) {
      res.json(reservation);
    } else {
      return res.status(403).json({ error: "Forbidden: Access denied" });
    }
  } catch (error) {
    console.error("Error fetching reservation by ID:", error);
    res.status(500).json({ error: "Server error while fetching reservation" });
  }
});
// Create a reservation (User only)
router.post("/", authMiddleware, authorizeUser, async (req, res) => {
  try {
    const { trainerId, sessionDate, sessionTime, status, notes } = req.body;
    const userId = req.user.userId; // Get userId from token

    if (!trainerId || !sessionDate || !sessionTime) {
      return res
        .status(400)
        .json({ error: "All required fields must be provided" });
    }

    const newReservation = new Reservation({
      userId,
      trainerId,
      sessionDate,
      sessionTime,
      status: status || "Pending",
      notes,
    });

    await newReservation.save();
    res.status(201).json(newReservation);
  } catch (error) {
    console.error("Error creating reservation:", error);
    res.status(500).json({ error: "Server error while creating reservation" });
  }
});

//  Get all reservations (Admin only)
router.get("/", authMiddleware, authorizeAdmin, async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate("userId", "firstname lastname email")
      .populate("trainerId", "firstname lastname specialization");
    res.json(reservations);
  } catch (error) {
    console.error("Error fetching reservations:", error);
    res.status(500).json({ error: "Server error while fetching reservations" });
  }
});

//  Get reservations by user ID (User only)
router.get("/user/:userId", authMiddleware, authorizeUser, async (req, res) => {
  try {
    if (req.params.userId !== req.user.userId) {
      return res
        .status(403)
        .json({ error: "Forbidden: You can only view your own reservations." });
    }

    const reservations = await Reservation.find({
      userId: req.params.userId,
    }).populate("trainerId", "firstname lastname specialization");

    res.json(reservations);
  } catch (error) {
    console.error("Error fetching user reservations:", error);
    res
      .status(500)
      .json({ error: "Server error while fetching user reservations" });
  }
});

//  Get reservations by trainer ID (Trainer only)
router.get(
  "/trainer/:trainerId",
  authMiddleware,
  authorizeTrainer,
  async (req, res) => {
    try {
      if (req.params.trainerId !== req.user.userId) {
        return res.status(403).json({
          error: "Forbidden: You can only view your assigned reservations.",
        });
      }

      const reservations = await Reservation.find({
        trainerId: req.params.trainerId,
      }).populate("userId", "firstname lastname email");

      res.json(reservations);
    } catch (error) {
      console.error("Error fetching trainer reservations:", error);
      res
        .status(500)
        .json({ error: "Server error while fetching trainer reservations" });
    }
  }
);

//  Update a reservation (Admin only)
router.put("/:id", authMiddleware, authorizeAdmin, async (req, res) => {
  try {
    const updatedReservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedReservation)
      return res.status(404).json({ error: "Reservation not found" });

    res.json(updatedReservation);
  } catch (error) {
    console.error("Error updating reservation:", error);
    res.status(500).json({ error: "Server error while updating reservation" });
  }
});

//  Delete a reservation (Admin only)
router.delete("/:id", authMiddleware, authorizeAdmin, async (req, res) => {
  try {
    const deletedReservation = await Reservation.findByIdAndDelete(
      req.params.id
    );

    if (!deletedReservation)
      return res.status(404).json({ error: "Reservation not found" });

    res.json({ message: "Reservation deleted successfully" });
  } catch (error) {
    console.error("Error deleting reservation:", error);
    res.status(500).json({ error: "Server error while deleting reservation" });
  }
});

module.exports = router;
