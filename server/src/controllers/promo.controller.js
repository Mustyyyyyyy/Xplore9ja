const prisma = require("../lib/prisma");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.createPromoCode = catchAsync(async (req, res) => {
  const {
    code,
    description,
    discountPercent,
    discountAmount,
    maxUses,
    minBookingAmount,
    isActive,
    startsAt,
    expiresAt,
  } = req.body;

  if (!code) {
    throw new AppError("Promo code is required.", 400);
  }

  if (!discountPercent && !discountAmount) {
    throw new AppError("Provide discountPercent or discountAmount.", 400);
  }

  const promo = await prisma.promoCode.create({
    data: {
      code: code.toUpperCase(),
      description,
      discountPercent: discountPercent ? Number(discountPercent) : null,
      discountAmount: discountAmount ? Number(discountAmount) : null,
      maxUses: maxUses ? Number(maxUses) : null,
      minBookingAmount: minBookingAmount ? Number(minBookingAmount) : null,
      isActive: isActive !== false,
      startsAt: startsAt ? new Date(startsAt) : null,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    },
  });

  res.status(201).json({
    success: true,
    message: "Promo code created successfully.",
    promo,
  });
});

exports.getPromoCodes = catchAsync(async (req, res) => {
  const promos = await prisma.promoCode.findMany({
    orderBy: { createdAt: "desc" },
  });

  res.json({
    success: true,
    count: promos.length,
    promos,
  });
});