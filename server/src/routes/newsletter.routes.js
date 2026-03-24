const router = require("express").Router();
const controller = require("../controllers/newsletter.controller");
const { protect } = require("../middlewares/auth.middleware");
const { allowRoles } = require("../middlewares/admin.middleware");

router.post("/subscribe", controller.subscribe);
router.get("/", protect, allowRoles("ADMIN", "SUPERADMIN"), controller.getSubscribers);

module.exports = router;