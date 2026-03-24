const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const morgan = require("morgan");
const env = require("./config/env");

const { apiLimiter, authLimiter } = require("./middlewares/rateLimit.middleware");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const destinationRoutes = require("./routes/destination.routes");
const tourRoutes = require("./routes/tour.routes");
const bookingRoutes = require("./routes/booking.routes");
const reviewRoutes = require("./routes/review.routes");
const wishlistRoutes = require("./routes/wishlist.routes");
const newsletterRoutes = require("./routes/newsletter.routes");
const contactRoutes = require("./routes/contact.routes");
const notificationRoutes = require("./routes/notification.routes");
const promoRoutes = require("./routes/promo.routes");
const paymentRoutes = require("./routes/payment.routes");
const uploadRoutes = require("./routes/upload.routes");

const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/error.middleware");

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);

app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(apiLimiter);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Xplore9ja API is running",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server healthy",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/destinations", destinationRoutes);
app.use("/api/tours", tourRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/promos", promoRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/uploads", uploadRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;