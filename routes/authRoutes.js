import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { register, login, getMe } from "../controllers/authController.js";

const router = express.Router();

// ---------------- GOOGLE ----------------
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/failure" }),
  (req, res) => {
    const token = jwt.sign(
      {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.send(`
      <html><body>
        <script>
          window.opener.postMessage({
            type: 'oauth-success',
            token: '${token}'
          }, 'http://localhost:5173');
          window.close();
        </script>
      </body></html>
    `);
  }
);

// ---------------- GITHUB ----------------
router.get("/github", passport.authenticate("github"));

router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/auth/failure" }),
  (req, res) => {
    const token = jwt.sign(
      {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.send(`
      <html><body>
        <script>
          window.opener.postMessage({
            type: 'oauth-success',
            token: '${token}'
          }, 'http://localhost:5173');
          window.close();
        </script>
      </body></html>
    `);
  }
);

// ---------------- LOCAL AUTH ----------------
router.post("/register", register);
router.post("/login", login);
router.get("/me", getMe);

router.get("/failure", (req, res) => {
  res.send("Authentication Failed ❌");
});

export default router;
