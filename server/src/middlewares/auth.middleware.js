const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (error) {
    let message = "Invalid or expired token";

    if (error.name === "TokenExpiredError") {
      message = "Token expired";
    } else if (error.name === "JsonWebTokenError") {
      message = "Invalid token";
    }

    return res.status(401).json({
      success: false,
      message,
      error: error.name,
    });
  }
};

const requireAdmin = (req, res, next) => {
  if (!req.user || (req.user.role !== "ADMIN" && req.user.role !== "SUPERADMIN")) {
    return res.status(403).json({
      success: false,
      message: "Access denied",
    });
  }

  next();
};

module.exports = {
  verifyToken,
  protect: verifyToken,
  requireAdmin,
};