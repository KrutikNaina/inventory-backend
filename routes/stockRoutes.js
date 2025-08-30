// routes/stockRoutes.js
const express = require("express");
const StockLog = require("../models/StockLog");
const { protect } = require("../middlewares/authMiddleware");
const { adminOnly } = require("../middlewares/roleMiddleware");

const router = express.Router();

router.get("/", protect, adminOnly, async (req, res) => {
  const logs = await StockLog.find().populate("productId userId orderId");
  res.json(logs);
});

router.get("/:productId", protect, async (req, res) => {
  const logs = await StockLog.find({ productId: req.params.productId }).populate("userId orderId");
  res.json(logs);
});

module.exports = router;
