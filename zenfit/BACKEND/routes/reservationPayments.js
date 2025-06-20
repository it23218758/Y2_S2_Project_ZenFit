const express = require("express");
const router = express.Router();
const ReservationPayment = require("../models/ReservationPayment");
const Reservation = require("../models/Reservation");

// Mask the card number
function maskCardNumber(cardNumber) {
  const lastFour = cardNumber.slice(-4);
  return "**** **** **** " + lastFour;
}

// ✅ Create Payment
router.post("/", async (req, res) => {
    try {
      const { reservationId, userId, cardName, cardNumber, amount } = req.body;
  
      if (!cardNumber || cardNumber.length < 4) {
        return res.status(400).json({ error: "Invalid card number." });
      }
  
      const maskedNumber = maskCardNumber(cardNumber);
      const newPayment = new ReservationPayment({
        reservationId,
        userId,
        cardName,
        cardNumberMasked: maskedNumber,
        amount,
      });
  
      await newPayment.save();
      const updatedReservation = await Reservation.findByIdAndUpdate(
        reservationId,
        { status: "Confirmed" },
        { new: true }
      );
  
      if (!updatedReservation) {
        return res.status(404).json({ error: "Reservation not found." });
      }
  
      res.status(201).json({
        message: "Payment successful. Reservation confirmed.",
        payment: newPayment,
        reservation: updatedReservation,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  

// ✅ Get All Payments
router.get("/", async (req, res) => {
  try {
    const payments = await ReservationPayment.find().populate("reservationId userId");
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get Payment by ID
router.get("/:id", async (req, res) => {
  try {
    const payment = await ReservationPayment.findById(req.params.id).populate("reservationId userId");
    if (!payment) return res.status(404).json({ error: "Payment not found" });
    res.json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Update Payment
router.put("/:id", async (req, res) => {
  try {
    const { cardName, cardNumber, amount, status } = req.body;

    const updatedFields = {
      cardName,
      amount,
      status,
    };

    if (cardNumber) {
      updatedFields.cardNumberMasked = maskCardNumber(cardNumber);
    }

    const updated = await ReservationPayment.findByIdAndUpdate(
      req.params.id,
      updatedFields,
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Payment not found" });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Delete Payment
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await ReservationPayment.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Payment not found" });
    res.json({ message: "Payment deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
