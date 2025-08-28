const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  paymentDetails: {
    cardName: {
      type: String,
      required: true,
      trim: true,
    },
    cardNumber: {
      type: String,
      required: true, 
    },
  },
  itemDetails: {
    name: String,
    price: Number,
    quantity: Number,
    total: Number,
    netTotal: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Payment", paymentSchema);
