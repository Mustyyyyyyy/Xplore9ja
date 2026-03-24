const cloudinary = require("../config/cloudinary");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.uploadSingleImage = catchAsync(async (req, res) => {
  if (!req.file) {
    throw new AppError("No file uploaded.", 400);
  }

  const b64 = Buffer.from(req.file.buffer).toString("base64");
  const dataURI = `data:${req.file.mimetype};base64,${b64}`;

  const result = await cloudinary.uploader.upload(dataURI, {
    folder: "xplore9ja",
  });

  res.status(201).json({
    success: true,
    message: "Image uploaded successfully.",
    file: {
      url: result.secure_url,
      publicId: result.public_id,
    },
  });
});