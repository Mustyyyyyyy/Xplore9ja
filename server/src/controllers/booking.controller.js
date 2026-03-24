const prisma = require("../lib/prisma");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const generateBookingReference = require("../utils/generateBookingReference");

exports.createBooking = catchAsync(async (req, res) => {
  const {
    destinationId,
    tourId,
    bookingDate,
    startDate,
    endDate,
    guests,
    specialRequests,
    promoCode,
  } = req.body;

  if (!destinationId && !tourId) {
    throw new AppError("Provide destinationId or tourId.", 400);
  }

  const guestCount = Number(guests || 1);
  if (guestCount < 1) {
    throw new AppError("Guests must be at least 1.", 400);
  }

  let totalPrice = 0;
  let destination = null;
  let tour = null;

  if (destinationId) {
    destination = await prisma.destination.findUnique({
      where: { id: destinationId },
    });
    if (!destination) throw new AppError("Destination not found.", 404);
    totalPrice = Number(destination.price || 0) * guestCount;
  }

  if (tourId) {
    tour = await prisma.tour.findUnique({
      where: { id: tourId },
    });
    if (!tour) throw new AppError("Tour not found.", 404);

    if (tour.availableSlots < guestCount) {
      throw new AppError("Not enough tour slots available.", 400);
    }

    totalPrice = Number(tour.discountPrice || tour.price) * guestCount;
  }

  let discountAmount = 0;
  let promo = null;

  if (promoCode) {
    promo = await prisma.promoCode.findUnique({
      where: { code: promoCode.toUpperCase() },
    });

    const now = new Date();

    if (
      !promo ||
      !promo.isActive ||
      (promo.startsAt && promo.startsAt > now) ||
      (promo.expiresAt && promo.expiresAt < now) ||
      (promo.maxUses !== null && promo.usedCount >= promo.maxUses) ||
      (promo.minBookingAmount && totalPrice < promo.minBookingAmount)
    ) {
      throw new AppError("Invalid or expired promo code.", 400);
    }

    if (promo.discountPercent) {
      discountAmount = (totalPrice * promo.discountPercent) / 100;
    } else if (promo.discountAmount) {
      discountAmount = promo.discountAmount;
    }
  }

  const finalPrice = Math.max(totalPrice - discountAmount, 0);

  const booking = await prisma.booking.create({
    data: {
      bookingReference: generateBookingReference(),
      userId: req.user.id,
      destinationId: destinationId || null,
      tourId: tourId || null,
      bookingDate: bookingDate ? new Date(bookingDate) : new Date(),
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      guests: guestCount,
      totalPrice,
      discountAmount,
      finalPrice,
      specialRequests,
      ...(promo && {
        appliedPromo: {
          create: {
            promoCodeId: promo.id,
            discountApplied: discountAmount,
          },
        },
      }),
    },
    include: {
      destination: true,
      tour: true,
      appliedPromo: {
        include: { promoCode: true },
      },
    },
  });

  if (promo) {
    await prisma.promoCode.update({
      where: { id: promo.id },
      data: { usedCount: { increment: 1 } },
    });
  }

  if (tourId) {
    await prisma.tour.update({
      where: { id: tourId },
      data: { availableSlots: { decrement: guestCount } },
    });
  }

  await prisma.notification.create({
    data: {
      userId: req.user.id,
      title: "Booking created",
      message: `Your booking ${booking.bookingReference} has been created successfully.`,
      type: "BOOKING",
    },
  });

  res.status(201).json({
    success: true,
    message: "Booking created successfully.",
    booking,
  });
});

exports.getMyBookings = catchAsync(async (req, res) => {
  const bookings = await prisma.booking.findMany({
    where: { userId: req.user.id },
    include: {
      destination: true,
      tour: true,
      appliedPromo: { include: { promoCode: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  res.json({
    success: true,
    count: bookings.length,
    bookings,
  });
});

exports.getAllBookings = catchAsync(async (req, res) => {
  const bookings = await prisma.booking.findMany({
    include: {
      user: {
        select: { id: true, fullName: true, email: true },
      },
      destination: true,
      tour: true,
      appliedPromo: { include: { promoCode: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  res.json({
    success: true,
    count: bookings.length,
    bookings,
  });
});

exports.updateBookingStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const allowed = ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED", "REFUNDED"];
  if (!allowed.includes(status)) {
    throw new AppError("Invalid booking status.", 400);
  }

  const booking = await prisma.booking.update({
    where: { id },
    data: { status },
    include: {
      user: true,
    },
  });

  await prisma.notification.create({
    data: {
      userId: booking.userId,
      title: "Booking status updated",
      message: `Your booking ${booking.bookingReference} is now ${status}.`,
      type: "BOOKING",
    },
  });

  res.json({
    success: true,
    message: "Booking status updated successfully.",
    booking,
  });
});