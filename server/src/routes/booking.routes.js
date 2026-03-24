const router = require("express").Router();
const controller = require("../controllers/booking.controller");
const { protect } = require("../middlewares/auth.middleware");
const { allowRoles } = require("../middlewares/admin.middleware");

router.post("/", protect, controller.createBooking);
router.get("/mine", protect, controller.getMyBookings);
router.get("/", protect, allowRoles("ADMIN", "SUPERADMIN"), controller.getAllBookings);
router.patch("/:id/status", protect, allowRoles("ADMIN", "SUPERADMIN"), controller.updateBookingStatus);

module.exports = router;