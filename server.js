import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import session from "express-session";
import passport from "passport";
import authRoutes from "./routes/authRoutes.js";
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

app.get("/", (req, res) => {
  res.send("Home Page");
});

app.listen(5000, () => console.log("Server running on port 5000"));
