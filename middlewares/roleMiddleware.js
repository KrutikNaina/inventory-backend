// middlewares/roleMiddleware.js
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
      next();
    } else {
      return res.status(403).json({ error: "Admin access only" });
    }
  };
  
  module.exports = { adminOnly };
  