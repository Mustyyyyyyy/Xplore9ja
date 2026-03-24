const router = require("express").Router();
const controller = require("../controllers/review.controller");
const { protect } = require("../middlewares/auth.middleware");

router.post("/", protect, controller.createReview);
router.delete("/:id", protect, controller.deleteReview);

module.exports = router;