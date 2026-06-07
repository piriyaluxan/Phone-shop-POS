const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protect route — must be logged in
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1]; // extract token after "Bearer "
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to request (minus the password)
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user || !req.user.isActive) {
        return res
          .status(401)
          .json({ message: "Account not found or inactive" });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  } else {
    return res.status(401).json({ message: "No token, authorization denied" });
  }
};

// Role guard — must have specific role(s)
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Role '${req.user.role}' is not authorized for this action`,
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
