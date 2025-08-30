import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("🔑 Google Access Token:", accessToken);
        console.log("👤 Google Profile:", profile);

        // Check if user exists
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          // Assign role based on email
          const role = profile.emails[0].value === "nenakrutik2004@gmail.com" ? "admin" : "staff";

          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            avatar: profile.photos[0].value,
            role,
          });
        }

        // Generate JWT
        const token = jwt.sign(
          { id: user._id, name: user.name, email: user.email, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: "7d" }
        );

        user.token = token;
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// Serialize & Deserialize
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

export default passport;
