const router = require("express").Router();
const controller = require("../controllers/notification.controller");
const { protect } = require("../middlewares/auth.middleware");

router.get("/mine", protect, controller.getMyNotifications);
router.patch("/:id/read", protect, controller.markAsRead);

module.exports = router;