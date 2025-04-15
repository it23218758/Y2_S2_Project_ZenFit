const mongoose = require("mongoose");

// ✅ Updated ShopItem model with image support
const shopItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    enum: [
      "Dumbbells",
      "Yoga Mats",
      "Resistance Bands",
      "Treadmills",
      "Supplements",
      "Gloves",
      "Fitness Apparel",
      "Others",
    ],
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  quantityInStock: {
    type: Number,
    required: true,
    min: 0,
  },
  imageUrl: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("ShopItem", shopItemSchema);
