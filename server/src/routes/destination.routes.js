const express = require("express");
const router = express.Router();

const {
  getDestinations,
  getDestinationBySlug,
  createDestination,
  updateDestination,
  deleteDestination,
} = require("../controllers/destination.controller");

const { verifyToken, requireAdmin } = require("../middlewares/auth.middleware");

router.get("/", getDestinations);
router.get("/:slug", getDestinationBySlug);

router.post("/", verifyToken, requireAdmin, createDestination);
router.patch("/:id", verifyToken, requireAdmin, updateDestination);
router.delete("/:id", verifyToken, requireAdmin, deleteDestination);

module.exports = router;