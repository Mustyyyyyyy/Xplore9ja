const router = require("express").Router();
const controller = require("../controllers/wishlist.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

router.get("/mine", verifyToken, controller.getMyWishlist);
router.get("/check/:destinationId", verifyToken, controller.checkWishlistStatus);
router.post("/", verifyToken, controller.addToWishlist);
router.delete("/:destinationId", verifyToken, controller.removeFromWishlist);

module.exports = router;