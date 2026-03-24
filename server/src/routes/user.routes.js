const router = require("express").Router();
const userController = require("../controllers/user.controller");
const { verifyToken } = require("../middlewares/auth.middleware");
const { allowRoles } = require("../middlewares/admin.middleware");

router.patch("/profile", verifyToken, userController.updateProfile);
router.get("/", verifyToken, allowRoles("ADMIN", "SUPERADMIN"), userController.getAllUsers);
router.patch("/:userId/role", verifyToken, allowRoles("SUPERADMIN"), userController.updateUserRole);

module.exports = router;