import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import session from "express-session";
import passport from "passport";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";   // ✅ import here
import stockRoutes from "./routes/stockRoutes.js"; // ✅ add this
import orderRoutes from "./routes/orderRoutes.js"; // ✅ make sure this is correct


import "./config/passport.js"; // IMPORTANT: import passport config

dotenv.config();

const app = express();

// Database connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("DB error:", err));

// Middleware
app.use(express.json());

// Sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
  })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/auth", authRoutes);
app.use("/api/products", productRoutes); // ✅ important!
app.use("/api/stocklogs", stockRoutes); // ✅ mount route
app.use("/api/orders", orderRoutes); // ✅ important



app.get("/", (req, res) => {
  res.send("Home Page");
});

app.listen(5000, () => console.log("Server running on port 5000"));
