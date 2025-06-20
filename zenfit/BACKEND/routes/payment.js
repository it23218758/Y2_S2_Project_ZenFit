const express = require("express");
const router = express.Router();
const Payment = require("../models/Payment");

// Utility to mask card number
function maskCardNumber(cardNumber) {
  const clean = cardNumber.replace(/\s+/g, "");
  const masked = clean
    .split("")
    .map((digit, index) => (index < 12 ? "*" : digit))
    .join("");

  return masked.replace(/(.{4})/g, "$1 ").trim();
}

// ✅ CREATE - Add a new payment
router.post("/", async (req, res) => {
    try {
      console.log("💳 Incoming Payment Request Body:", req.body);
  
      const { cardName, cardNumber } = req.body?.paymentDetails || {};
      const item = req.body?.itemDetails;
  
      if (!cardName || !cardNumber || !item) {
        console.warn("⚠️ Missing Fields:", { cardName, cardNumber, item });
        return res.status(400).json({ error: "Missing required fields" });
      }
  
      console.log("✅ Validated Fields - CardName:", cardName, "CardNumber:", cardNumber);
      console.log("🛒 Item Details:", item);
  
      const maskedCardNumber = maskCardNumber(cardNumber);
      console.log("🔒 Masked Card Number:", maskedCardNumber);
  
      const newPayment = new Payment({
        paymentDetails: {
          cardName,
          cardNumber: maskedCardNumber,
        },
        itemDetails: {
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          total: item.total,
          netTotal: item.netTotal || item.total,
        },
      });
  
      const savedPayment = await newPayment.save();
      console.log("✅ Payment saved:", savedPayment);
  
      res.status(201).json({ message: "Payment added successfully", payment: savedPayment });
    } catch (err) {
      console.error("❌ Error adding payment:", err.message, err.stack);
      res.status(500).json({ error: "Server error while creating payment" });
    }
  });
  

// ✅ READ - Get all payments
router.get("/", async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    console.error("Error fetching payments:", err);
    res.status(500).json({ error: "Server error while fetching payments" });
  }
});

// ✅ READ - Get a payment by ID
router.get("/:id", async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ error: "Payment not found" });
    res.json(payment);
  } catch (err) {
    console.error("Error fetching payment:", err);
    res.status(500).json({ error: "Server error while fetching payment" });
  }
});

// ✅ UPDATE - Update a payment by ID
router.put("/:id", async (req, res) => {
  try {
    const { cardName, cardNumber, item } = req.body;

    const updatedFields = {
      paymentDetails: {
        cardName,
        cardNumber: maskCardNumber(cardNumber),
      },
      itemDetails: {
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        total: item.total,
        netTotal: item.total,
      },
    };

    const updated = await Payment.findByIdAndUpdate(req.params.id, updatedFields, { new: true });

    if (!updated) return res.status(404).json({ error: "Payment not found" });
    res.json({ message: "Payment updated successfully", payment: updated });
  } catch (err) {
    console.error("Error updating payment:", err);
    res.status(500).json({ error: "Server error while updating payment" });
  }
});

// ✅ DELETE - Delete a payment by ID
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Payment.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Payment not found" });
    res.json({ message: "Payment deleted successfully" });
  } catch (err) {
    console.error("Error deleting payment:", err);
    res.status(500).json({ error: "Server error while deleting payment" });
  }
});

module.exports = router;
