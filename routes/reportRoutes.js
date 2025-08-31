// routes/reportRoutes.js
import express from "express";
import { generateReportController } from "../controllers/reportController.js";
import { protect } from "../middlewares/authMiddleware.js"; // Use your existing auth middleware

const router = express.Router();

// GET /api/reports - Protected route
router.get("/", protect, generateReportController);

export default router;