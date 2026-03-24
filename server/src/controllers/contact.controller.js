const prisma = require("../lib/prisma");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.createContactMessage = catchAsync(async (req, res) => {
  const { fullName, email, subject, message } = req.body;

  if (!fullName || !email || !subject || !message) {
    throw new AppError("fullName, email, subject and message are required.", 400);
  }

  const contact = await prisma.contactMessage.create({
    data: {
      userId: req.user?.id || null,
      fullName,
      email,
      subject,
      message,
    },
  });

  res.status(201).json({
    success: true,
    message: "Message sent successfully.",
    contact,
  });
});

exports.getContactMessages = catchAsync(async (req, res) => {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  res.json({
    success: true,
    count: messages.length,
    messages,
  });
});

exports.updateContactStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { status, adminNote } = req.body;

  const updated = await prisma.contactMessage.update({
    where: { id },
    data: {
      ...(status ? { status } : {}),
      ...(adminNote !== undefined ? { adminNote } : {}),
    },
  });

  res.json({
    success: true,
    message: "Contact message updated successfully.",
    contact: updated,
  });
});