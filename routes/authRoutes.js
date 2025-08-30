import express from "express";
import passport from "passport";

const router = express.Router();

// Login with Google
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Callback after Google login
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // Successful login
    res.redirect("/dashboard"); // change this to your frontend/dashboard
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
