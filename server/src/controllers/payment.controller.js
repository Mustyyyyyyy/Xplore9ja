const prisma = require("../lib/prisma");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const {
  initializePaystackPayment,
  verifyPaystackPayment,
} = require("../services/payment.service");

exports.initializePayment = catchAsync(async (req, res) => {
  const { bookingId } = req.body;

  if (!bookingId) throw new AppError("bookingId is required.", 400);

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { user: true, payment: true },
  });

  if (!booking) throw new AppError("Booking not found.", 404);
  if (booking.userId !== req.user.id) throw new AppError("Unauthorized booking.", 403);

  if (booking.payment && booking.payment.status === "SUCCESS") {
    throw new AppError("Booking already paid.", 400);
  }

  const reference = `PAY-${Date.now()}-${Math.floor(Math.random() * 100000)}`;

  const gateway = await initializePaystackPayment({
    email: booking.user.email,
    amount: booking.finalPrice,
    reference,
    callback_url: `${process.env.CLIENT_URL}/payments/verify?reference=${reference}`,
  });

  await prisma.payment.upsert({
    where: { bookingId: booking.id },
    update: {
      reference,
      amount: booking.finalPrice,
      method: "PAYSTACK",
      status: "PENDING",
      gatewayResponse: gateway,
    },
    create: {
      bookingId: booking.id,
      userId: booking.userId,
      reference,
      amount: booking.finalPrice,
      method: "PAYSTACK",
      status: "PENDING",
      gatewayResponse: gateway,
    },
  });

  res.json({
    success: true,
    message: "Payment initialized successfully.",
    paymentUrl: gateway.authorization_url,
    reference,
  });
});

exports.verifyPayment = catchAsync(async (req, res) => {
  const { reference } = req.query;

  if (!reference) throw new AppError("Payment reference is required.", 400);

  const result = await verifyPaystackPayment(reference);

  const payment = await prisma.payment.findUnique({
    where: { reference },
    include: { booking: true },
  });

  if (!payment) throw new AppError("Payment record not found.", 404);

  if (result.status === "success") {
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: "SUCCESS",
        paidAt: new Date(),
        gatewayResponse: result,
      },
    });

    await prisma.booking.update({
      where: { id: payment.bookingId },
      data: { status: "CONFIRMED" },
    });

    await prisma.notification.create({
      data: {
        userId: payment.userId,
        title: "Payment successful",
        message: `Payment for booking ${payment.booking.bookingReference} was successful.`,
        type: "PAYMENT",
      },
    });
  }

  res.json({
    success: true,
    verified: result.status === "success",
    data: result,
  });
});