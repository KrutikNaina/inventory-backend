// routes/orderRoutes.js
const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const { createOrder } = require("../controllers/orderController");

const router = express.Router();

router.post("/", protect, createOrder);

module.exports = router;
