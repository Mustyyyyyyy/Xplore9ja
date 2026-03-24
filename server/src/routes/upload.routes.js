const router = require("express").Router();
const upload = require("../config/multer");
const controller = require("../controllers/upload.controller");
const { protect } = require("../middlewares/auth.middleware");

router.post("/image", protect, upload.single("image"), controller.uploadSingleImage);

module.exports = router;