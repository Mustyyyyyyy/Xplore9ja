const router = require("express").Router();
const controller = require("../controllers/payment.controller");
const { protect } = require("../middlewares/auth.middleware");

router.post("/initialize", protect, controller.initializePayment);
router.get("/verify", controller.verifyPayment);

module.exports = router;