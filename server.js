import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import "./config/passportConfig.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import stockRoutes from "./routes/stockRoutes.js";

// Load env vars
dotenv.config();

// Connect to DB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Smart Inventory Management Backend Running ✅");
});

// API routes
app.use("/auth", authRoutes);
app.use("/api/auth", authRoutes); // avoid duplicate require
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/stock", stockRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
