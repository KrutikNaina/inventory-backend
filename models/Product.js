// models/Product.js
const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String },
  description: { type: String },
  sku: { type: String, unique: true }, // unique stock keeping unit
  qrCode: { type: String }, // store QR code image path or encoded data
  stockQty: { type: Number, default: 0 },
  unit: { type: String, default: "pcs" }, // pcs, kg, liters, etc.
  location: { type: String }, // e.g., "Aisle 3, Shelf B"
  expiryDate: { type: Date }, // optional (for perishable goods)
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Product", ProductSchema);
