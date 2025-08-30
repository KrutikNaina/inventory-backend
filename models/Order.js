// inventory-backend\models\Order.models.js
const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    orderType: { type: String, enum: ["inward", "outward"], required: true },
    products: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, required: true }
      }
    ],
    supplierOrBuyer: { type: String }, // supplier name (for inward) OR wholesaler (for outward)
    handledBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdAt: { type: Date, default: Date.now }
  });
  
  module.exports = mongoose.model("Order", OrderSchema);
  