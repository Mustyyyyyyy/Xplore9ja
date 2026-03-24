const prisma = require("../lib/prisma");

function allowRoles(...roles) {
  return async (req, res, next) => {
    if (!req.user || !req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Access denied.",
      });
    }

    if (!req.user.role) {
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: { role: true },
      });
      if (user) req.user.role = user.role;
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied.",
      });
    }
    next();
  };
}

module.exports = { allowRoles };