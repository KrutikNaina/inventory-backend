import express from "express";
import passport from "passport";

const router = express.Router();

// Login with Google
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Callback after Google login
import jwt from "jsonwebtoken";

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Google auth failed" });

    // Create server JWT
    const token = jwt.sign(
      { id: req.user._id, email: req.user.email, name: req.user.name },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Option A: Send as JSON (for Postman)
    res.json({ token, user: req.user });

    // Option B: Send via redirect to frontend
    // res.redirect(`http://localhost:5173?token=${token}`);
  }
);

// Logout
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).send(err);
    res.redirect("/");
  });
});

export default router;
