const jwt = require("jsonwebtoken");
const prisma = require("../lib/prisma");

const verifyToken = async (req, res, next) => {
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

    if (!decoded || !decoded.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    // For backward compatibility, ensure role is available on req.user
    if (!decoded.role) {
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { role: true },
      });
      if (user) {
        decoded.role = user.role;
      }
    }

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