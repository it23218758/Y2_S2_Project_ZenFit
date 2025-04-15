const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const ShopItem = require("../models/ShopItem");

// 🖼️ Set up storage engine for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/shop_items/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) return cb(null, true);
    cb("Only image files are allowed!");
  },
});

// 🆕 Add new item
router.post("/add", upload.single("image"), async (req, res) => {
  try {
    const { name, description, category, price, quantityInStock } = req.body;
    const imageUrl = req.file ? `/uploads/shop_items/${req.file.filename}` : "";

    const item = new ShopItem({
      name,
      description,
      category,
      price,
      quantityInStock,
      imageUrl,
    });

    await item.save();
    res.status(201).json(item);
  } catch (err) {
    console.error("Error adding item:", err);
    res.status(500).json({ error: "Failed to add shop item." });
  }
});

// 📄 Get all items
router.get("/", async (req, res) => {
  try {
    const items = await ShopItem.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch items." });
  }
});

// 🔍 Get single item by ID
router.get("/:id", async (req, res) => {
  try {
    const item = await ShopItem.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Item not found." });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch item." });
  }
});

// ✏️ Update item
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, description, category, price, quantityInStock } = req.body;
    const updateFields = {
      name,
      description,
      category,
      price,
      quantityInStock,
    };
    if (req.file) {
      updateFields.imageUrl = `/uploads/shop_items/${req.file.filename}`;
    }
    const item = await ShopItem.findByIdAndUpdate(req.params.id, updateFields, {
      new: true,
    });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: "Failed to update item." });
  }
});

// ❌ Delete item
router.delete("/:id", async (req, res) => {
  try {
    const item = await ShopItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: "Item not found." });
    res.json({ message: "Item deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete item." });
  }
});

module.exports = router;
