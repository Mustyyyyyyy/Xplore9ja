const router = require("express").Router();
const controller = require("../controllers/promo.controller");
const { protect } = require("../middlewares/auth.middleware");
const { allowRoles } = require("../middlewares/admin.middleware");

router.get("/", protect, allowRoles("ADMIN", "SUPERADMIN"), controller.getPromoCodes);
router.post("/", protect, allowRoles("ADMIN", "SUPERADMIN"), controller.createPromoCode);

module.exports = router;