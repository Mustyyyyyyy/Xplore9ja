const prisma = require("../lib/prisma");

function makeSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

exports.getDestinations = async (req, res) => {
  try {
    const destinations = await prisma.destination.findMany({
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      success: true,
      destinations,
    });
  } catch (error) {
    console.error("GET DESTINATIONS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch destinations",
    });
  }
};

exports.getDestinationBySlug = async (req, res) => {
  try {
    const destination = await prisma.destination.findUnique({
      where: { slug: req.params.slug },
    });

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: "Destination not found",
      });
    }

    return res.status(200).json({
      success: true,
      destination,
    });
  } catch (error) {
    console.error("GET DESTINATION ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch destination",
    });
  }
};

exports.createDestination = async (req, res) => {
  try {
    const {
      name,
      shortDescription,
      description,
      location,
      state,
      country,
      address,
      price,
      featured,
      isPublished,
      category,
      images,
      tags,
      bestTime,
      mapLink,
    } = req.body;

    if (!name || !description || !location || !state || !category) {
      return res.status(400).json({
        success: false,
        message: "Name, description, location, state and category are required",
      });
    }

    let baseSlug = makeSlug(name);
    let slug = baseSlug;
    let count = 1;

    while (await prisma.destination.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${count++}`;
    }

    const destination = await prisma.destination.create({
      data: {
        name,
        slug,
        shortDescription: shortDescription || null,
        description,
        location,
        state,
        country: country || "Nigeria",
        address: address || null,
        price: price ? Number(price) : null,
        featured: !!featured,
        isPublished: isPublished !== undefined ? !!isPublished : true,
        category,
        images: Array.isArray(images) ? images : [],
        tags: Array.isArray(tags) ? tags : [],
        bestTime: bestTime || null,
        mapLink: mapLink || null,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Destination created successfully",
      destination,
    });
  } catch (error) {
    console.error("CREATE DESTINATION ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create destination",
    });
  }
};

exports.updateDestination = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await prisma.destination.findUnique({ where: { id } });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Destination not found",
      });
    }

    const {
      name,
      shortDescription,
      description,
      location,
      state,
      country,
      address,
      price,
      featured,
      isPublished,
      category,
      images,
      tags,
      bestTime,
      mapLink,
    } = req.body;

    let slug = existing.slug;

    if (name && name !== existing.name) {
      let baseSlug = makeSlug(name);
      slug = baseSlug;
      let count = 1;

      while (true) {
        const found = await prisma.destination.findUnique({ where: { slug } });
        if (!found || found.id === id) break;
        slug = `${baseSlug}-${count++}`;
      }
    }

    const destination = await prisma.destination.update({
      where: { id },
      data: {
        name: name ?? existing.name,
        slug,
        shortDescription: shortDescription ?? existing.shortDescription,
        description: description ?? existing.description,
        location: location ?? existing.location,
        state: state ?? existing.state,
        country: country ?? existing.country,
        address: address ?? existing.address,
        price: price !== undefined ? (price ? Number(price) : null) : existing.price,
        featured: featured !== undefined ? !!featured : existing.featured,
        isPublished: isPublished !== undefined ? !!isPublished : existing.isPublished,
        category: category ?? existing.category,
        images: Array.isArray(images) ? images : existing.images,
        tags: Array.isArray(tags) ? tags : existing.tags,
        bestTime: bestTime ?? existing.bestTime,
        mapLink: mapLink ?? existing.mapLink,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Destination updated successfully",
      destination,
    });
  } catch (error) {
    console.error("UPDATE DESTINATION ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update destination",
    });
  }
};

exports.deleteDestination = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.destination.findUnique({ where: { id } });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Destination not found",
      });
    }

    await prisma.destination.delete({ where: { id } });

    return res.status(200).json({
      success: true,
      message: "Destination deleted successfully",
    });
  } catch (error) {
    console.error("DELETE DESTINATION ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete destination",
    });
  }
};