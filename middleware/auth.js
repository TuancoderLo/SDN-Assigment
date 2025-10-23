const jwt = require("jsonwebtoken");
const Member = require("../models/Member");

// Protect routes - verify JWT token (support both API and UI)
exports.protect = async (req, res, next) => {
  let token;

  // Check for token in Authorization header (API requests)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  // Check for token in cookies (UI requests)
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    if (req.originalUrl.startsWith("/api/")) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, no token",
      });
    } else {
      return res.redirect("/login");
    }
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from token
    req.user = await Member.findById(decoded.id).select("-password");

    if (!req.user) {
      if (req.originalUrl.startsWith("/api/")) {
        return res.status(401).json({
          success: false,
          message: "Not authorized, user not found",
        });
      } else {
        return res.redirect("/login");
      }
    }

    next();
  } catch (error) {
    console.error("Auth error:", error);
    if (req.originalUrl.startsWith("/api/")) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, token failed",
      });
    } else {
      return res.redirect("/login");
    }
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
