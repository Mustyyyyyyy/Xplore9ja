const prisma = require("../lib/prisma");

exports.getMyWishlist = async (req, res) => {
  try {
    const wishlist = await prisma.savedDestination.findMany({
      where: { userId: req.user.id },
      include: {
        destination: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      success: true,
      wishlist,
    });
  } catch (error) {
    console.error("GET WISHLIST ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch wishlist",
    });
  }
};

exports.addToWishlist = async (req, res) => {
  try {
    const { destinationId } = req.body;

    if (!destinationId) {
      return res.status(400).json({
        success: false,
        message: "destinationId is required",
      });
    }

    const destination = await prisma.destination.findUnique({
      where: { id: destinationId },
    });

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: "Destination not found",
      });
    }

    const existing = await prisma.savedDestination.findUnique({
      where: {
        userId_destinationId: {
          userId: req.user.id,
          destinationId,
        },
      },
    });

    if (existing) {
      return res.status(200).json({
        success: true,
        message: "Destination already in wishlist",
        wishlistItem: existing,
      });
    }

    const wishlistItem = await prisma.savedDestination.create({
      data: {
        userId: req.user.id,
        destinationId,
      },
      include: {
        destination: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Added to wishlist",
      wishlistItem,
    });
  } catch (error) {
    console.error("ADD TO WISHLIST ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to add to wishlist",
    });
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    const { destinationId } = req.params;

    const existing = await prisma.savedDestination.findUnique({
      where: {
        userId_destinationId: {
          userId: req.user.id,
          destinationId,
        },
      },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Wishlist item not found",
      });
    }

    await prisma.savedDestination.delete({
      where: {
        userId_destinationId: {
          userId: req.user.id,
          destinationId,
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: "Removed from wishlist",
    });
  } catch (error) {
    console.error("REMOVE WISHLIST ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to remove from wishlist",
    });
  }
};

exports.checkWishlistStatus = async (req, res) => {
  try {
    const { destinationId } = req.params;

    const existing = await prisma.savedDestination.findUnique({
      where: {
        userId_destinationId: {
          userId: req.user.id,
          destinationId,
        },
      },
    });

    return res.status(200).json({
      success: true,
      isSaved: !!existing,
    });
  } catch (error) {
    console.error("CHECK WISHLIST STATUS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to check wishlist status",
    });
  }
};