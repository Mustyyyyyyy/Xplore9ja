const router = require("express").Router();
const controller = require("../controllers/contact.controller");
const { protect } = require("../middlewares/auth.middleware");
const { allowRoles } = require("../middlewares/admin.middleware");

router.post("/", controller.createContactMessage);
router.get("/", protect, allowRoles("ADMIN", "SUPERADMIN"), controller.getContactMessages);
router.patch("/:id", protect, allowRoles("ADMIN", "SUPERADMIN"), controller.updateContactStatus);

module.exports = router;