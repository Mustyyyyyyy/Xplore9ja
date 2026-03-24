const express = require("express");
const router = express.Router();

const {
  getTours,
  getTourBySlug,
  createTour,
  updateTour,
  deleteTour,
} = require("../controllers/tour.controller");

const { verifyToken, requireAdmin } = require("../middlewares/auth.middleware");

router.get("/", getTours);
router.get("/:slug", getTourBySlug);

router.post("/", verifyToken, requireAdmin, createTour);
router.patch("/:id", verifyToken, requireAdmin, updateTour);
router.delete("/:id", verifyToken, requireAdmin, deleteTour);

module.exports = router;