const prisma = require("../lib/prisma");

function makeSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

exports.getTours = async (req, res) => {
  try {
    const tours = await prisma.tour.findMany({
      include: {
        destination: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      success: true,
      tours,
    });
  } catch (error) {
    console.error("GET TOURS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch tours",
    });
  }
};

exports.getTourBySlug = async (req, res) => {
  try {
    const tour = await prisma.tour.findUnique({
      where: { slug: req.params.slug },
      include: {
        destination: true,
      },
    });

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: "Tour not found",
      });
    }

    return res.status(200).json({
      success: true,
      tour,
    });
  } catch (error) {
    console.error("GET TOUR ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch tour",
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const {
      title,
      shortDescription,
      description,
      price,
      discountPrice,
      duration,
      availableSlots,
      minGroupSize,
      maxGroupSize,
      featured,
      isPublished,
      type,
      images,
      itinerary,
      included,
      excluded,
      destinationId,
    } = req.body;

    if (!title || !description || !price || !duration || !type || !destinationId) {
      return res.status(400).json({
        success: false,
        message: "Title, description, price, duration, type and destinationId are required",
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

    let baseSlug = makeSlug(title);
    let slug = baseSlug;
    let count = 1;

    while (await prisma.tour.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${count++}`;
    }

    const tour = await prisma.tour.create({
      data: {
        title,
        slug,
        shortDescription: shortDescription || null,
        description,
        price: Number(price),
        discountPrice: discountPrice ? Number(discountPrice) : null,
        duration,
        availableSlots: availableSlots ? Number(availableSlots) : 0,
        minGroupSize: minGroupSize ? Number(minGroupSize) : 1,
        maxGroupSize: maxGroupSize ? Number(maxGroupSize) : null,
        featured: !!featured,
        isPublished: isPublished !== undefined ? !!isPublished : true,
        type,
        images: Array.isArray(images) ? images : [],
        itinerary: itinerary || null,
        included: Array.isArray(included) ? included : [],
        excluded: Array.isArray(excluded) ? excluded : [],
        destinationId,
      },
      include: {
        destination: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    return res.status(201).json({
      success: true,
      message: "Tour created successfully",
      tour,
    });
  } catch (error) {
    console.error("CREATE TOUR ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create tour",
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await prisma.tour.findUnique({ where: { id } });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Tour not found",
      });
    }

    const {
      title,
      shortDescription,
      description,
      price,
      discountPrice,
      duration,
      availableSlots,
      minGroupSize,
      maxGroupSize,
      featured,
      isPublished,
      type,
      images,
      itinerary,
      included,
      excluded,
      destinationId,
    } = req.body;

    let slug = existing.slug;

    if (title && title !== existing.title) {
      let baseSlug = makeSlug(title);
      slug = baseSlug;
      let count = 1;

      while (true) {
        const found = await prisma.tour.findUnique({ where: { slug } });
        if (!found || found.id === id) break;
        slug = `${baseSlug}-${count++}`;
      }
    }

    if (destinationId) {
      const destination = await prisma.destination.findUnique({
        where: { id: destinationId },
      });

      if (!destination) {
        return res.status(404).json({
          success: false,
          message: "Destination not found",
        });
      }
    }

    const tour = await prisma.tour.update({
      where: { id },
      data: {
        title: title ?? existing.title,
        slug,
        shortDescription: shortDescription ?? existing.shortDescription,
        description: description ?? existing.description,
        price: price !== undefined ? Number(price) : existing.price,
        discountPrice:
          discountPrice !== undefined
            ? discountPrice
              ? Number(discountPrice)
              : null
            : existing.discountPrice,
        duration: duration ?? existing.duration,
        availableSlots:
          availableSlots !== undefined ? Number(availableSlots) : existing.availableSlots,
        minGroupSize:
          minGroupSize !== undefined ? Number(minGroupSize) : existing.minGroupSize,
        maxGroupSize:
          maxGroupSize !== undefined
            ? maxGroupSize
              ? Number(maxGroupSize)
              : null
            : existing.maxGroupSize,
        featured: featured !== undefined ? !!featured : existing.featured,
        isPublished: isPublished !== undefined ? !!isPublished : existing.isPublished,
        type: type ?? existing.type,
        images: Array.isArray(images) ? images : existing.images,
        itinerary: itinerary ?? existing.itinerary,
        included: Array.isArray(included) ? included : existing.included,
        excluded: Array.isArray(excluded) ? excluded : existing.excluded,
        destinationId: destinationId ?? existing.destinationId,
      },
      include: {
        destination: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: "Tour updated successfully",
      tour,
    });
  } catch (error) {
    console.error("UPDATE TOUR ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update tour",
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.tour.findUnique({ where: { id } });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Tour not found",
      });
    }

    await prisma.tour.delete({ where: { id } });

    return res.status(200).json({
      success: true,
      message: "Tour deleted successfully",
    });
  } catch (error) {
    console.error("DELETE TOUR ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete tour",
    });
  }
};