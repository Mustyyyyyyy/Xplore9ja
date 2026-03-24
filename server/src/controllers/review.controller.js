const prisma = require("../lib/prisma");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

async function updateDestinationRating(destinationId) {
  const reviews = await prisma.review.findMany({
    where: { destinationId, isPublished: true },
    select: { rating: true },
  });

  const reviewCount = reviews.length;
  const averageRating =
    reviewCount > 0
      ? reviews.reduce((sum, item) => sum + item.rating, 0) / reviewCount
      : 0;

  await prisma.destination.update({
    where: { id: destinationId },
    data: {
      reviewCount,
      averageRating,
    },
  });
}

exports.createReview = catchAsync(async (req, res) => {
  const { destinationId, rating, comment } = req.body;

  if (!destinationId || !rating || !comment) {
    throw new AppError("destinationId, rating and comment are required.", 400);
  }

  if (rating < 1 || rating > 5) {
    throw new AppError("Rating must be between 1 and 5.", 400);
  }

  const destination = await prisma.destination.findUnique({
    where: { id: destinationId },
  });

  if (!destination) {
    throw new AppError("Destination not found.", 404);
  }

  const review = await prisma.review.create({
    data: {
      userId: req.user.id,
      destinationId,
      rating: Number(rating),
      comment,
    },
    include: {
      user: {
        select: { id: true, fullName: true, avatar: true },
      },
    },
  });

  await updateDestinationRating(destinationId);

  await prisma.notification.create({
    data: {
      userId: req.user.id,
      title: "Review added",
      message: `Your review for ${destination.name} has been submitted.`,
      type: "REVIEW",
    },
  });

  res.status(201).json({
    success: true,
    message: "Review submitted successfully.",
    review,
  });
});

exports.deleteReview = catchAsync(async (req, res) => {
  const { id } = req.params;

  const review = await prisma.review.findUnique({ where: { id } });

  if (!review) throw new AppError("Review not found.", 404);

  if (review.userId !== req.user.id && !["ADMIN", "SUPERADMIN"].includes(req.user.role)) {
    throw new AppError("Not allowed to delete this review.", 403);
  }

  await prisma.review.delete({ where: { id } });
  await updateDestinationRating(review.destinationId);

  res.json({
    success: true,
    message: "Review deleted successfully.",
  });
});