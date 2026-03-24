const prisma = require("../lib/prisma");
const catchAsync = require("../utils/catchAsync");

exports.getMyNotifications = catchAsync(async (req, res) => {
  const notifications = await prisma.notification.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: "desc" },
  });

  res.json({
    success: true,
    count: notifications.length,
    notifications,
  });
});

exports.markAsRead = catchAsync(async (req, res) => {
  const { id } = req.params;

  const notification = await prisma.notification.update({
    where: { id },
    data: { isRead: true },
  });

  res.json({
    success: true,
    message: "Notification marked as read.",
    notification,
  });
});