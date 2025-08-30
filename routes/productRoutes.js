import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { createOrder } from "../controllers/orderController.js";

const router = express.Router();

router.post("/", protect, createOrder); // ✅ POST /api/orders

export default router;
