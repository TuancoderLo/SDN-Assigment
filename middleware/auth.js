const jwt = require("jsonwebtoken");
const Member = require("../models/Member");

// Protect routes - verify JWT token
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      req.user = await Member.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Not authorized, user not found",
        });
      }

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({
        success: false,
        message: "Not authorized, token failed",
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, no token",
    });
  }
};

// Admin only middleware
exports.adminOnly = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: "Not authorized, admin access only",
    });
  }
};

// Check if user is the owner of the resource
exports.isSelfOrAdmin = (req, res, next) => {
  if (
    req.user &&
    (req.user._id.toString() === req.params.id || req.user.isAdmin)
  ) {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: "Not authorized, you can only edit your own information",
    });
  }
};

// Check if user is the owner only (not even admin can access)
exports.isSelfOnly = (req, res, next) => {
  if (req.user && req.user._id.toString() === req.params.id) {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: "Not authorized, you can only edit your own information",
    });
  }
};
