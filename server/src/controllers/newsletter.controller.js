const prisma = require("../lib/prisma");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.subscribe = catchAsync(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new AppError("Email is required.", 400);
  }

  const existing = await prisma.newsletterSubscriber.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (existing) {
    return res.json({
      success: true,
      message: "Email is already subscribed.",
    });
  }

  await prisma.newsletterSubscriber.create({
    data: {
      email: email.toLowerCase(),
    },
  });

  res.status(201).json({
    success: true,
    message: "Subscribed successfully.",
  });
});

exports.getSubscribers = catchAsync(async (req, res) => {
  const subscribers = await prisma.newsletterSubscriber.findMany({
    orderBy: { subscribedAt: "desc" },
  });

  res.json({
    success: true,
    count: subscribers.length,
    subscribers,
  });
});