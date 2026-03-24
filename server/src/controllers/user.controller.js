const prisma = require("../lib/prisma");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.updateProfile = catchAsync(async (req, res) => {
  const { fullName, phone, avatar } = req.body;

  const updatedUser = await prisma.user.update({
    where: { id: req.user.id },
    data: {
      fullName,
      phone,
      avatar,
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      avatar: true,
      role: true,
      updatedAt: true,
    },
  });

  res.json({
    success: true,
    message: "Profile updated successfully.",
    user: updatedUser,
  });
});

exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });

  res.json({
    success: true,
    count: users.length,
    users,
  });
});

exports.updateUserRole = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;

  if (!["USER", "ADMIN", "SUPERADMIN"].includes(role)) {
    throw new AppError("Invalid role.", 400);
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { role },
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
    },
  });

  res.json({
    success: true,
    message: "User role updated successfully.",
    user: updatedUser,
  });
});