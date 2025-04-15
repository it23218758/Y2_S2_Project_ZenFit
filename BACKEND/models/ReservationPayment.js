const mongoose = require("mongoose");

const reservationPaymentSchema = new mongoose.Schema({
  reservationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Reservation",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  cardName: {
    type: String,
    required: true,
    trim: true,
  },
  cardNumberMasked: {
    type: String,
    required: true, 
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Paid", "Failed", "Refunded"],
    default: "Paid",
  },
  paidAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("ReservationPayment", reservationPaymentSchema);
