const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function upsertDestination(data) {
  return prisma.destination.upsert({
    where: { slug: data.slug },
    update: {},
    create: data,
  });
}

async function upsertTour(data) {
  return prisma.tour.upsert({
    where: { slug: data.slug },
    update: {},
    create: data,
  });
}

async function main() {
  const destinations = {};

  destinations.olumo = await upsertDestination({
    name: "Olumo Rock",
    slug: "olumo-rock",
    shortDescription: "Historic rock and cultural landmark.",
    description:
      "Olumo Rock is one of Nigeria’s most iconic tourist attractions.",
    location: "Abeokuta",
    state: "Ogun",
    country: "Nigeria",
    address: "Ikija, Abeokuta",
    price: 15000,
    featured: true,
    isPublished: true,
    category: "HISTORICAL",
    images: [
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200",
    ],
    tags: ["history"],
    bestTime: "October - February",
    mapLink: "https://maps.google.com",
  });

  destinations.lekki = await upsertDestination({
    name: "Lekki Conservation Centre",
    slug: "lekki-conservation-centre",
    shortDescription: "Nature reserve and canopy walkway.",
    description: "Beautiful nature reserve in Lagos.",
    location: "Lekki",
    state: "Lagos",
    country: "Nigeria",
    address: "Lekki-Epe Expressway",
    price: 20000,
    featured: true,
    isPublished: true,
    category: "NATURE",
    images: [
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1400",
    ],
    tags: ["nature"],
    bestTime: "November - March",
    mapLink: "https://maps.google.com",
  });

  destinations.obudu = await upsertDestination({
    name: "Obudu Mountain Resort",
    slug: "obudu-mountain-resort",
    shortDescription: "Mountain resort experience.",
    description: "Luxury resort in Cross River.",
    location: "Obudu",
    state: "Cross River",
    country: "Nigeria",
    address: "Obudu Plateau",
    price: 60000,
    featured: true,
    isPublished: true,
    category: "RESORT",
    images: [
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?q=80&w=1400",
    ],
    tags: ["luxury"],
    bestTime: "November - February",
    mapLink: "https://maps.google.com",
  });

  destinations.tarkwa = await upsertDestination({
    name: "Tarkwa Bay",
    slug: "tarkwa-bay",
    shortDescription: "Beach escape in Lagos.",
    description: "Relaxing beach experience.",
    location: "Lagos",
    state: "Lagos",
    country: "Nigeria",
    address: "Tarkwa Bay",
    price: 30000,
    featured: true,
    isPublished: true,
    category: "BEACH",
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1400",
    ],
    tags: ["beach"],
    bestTime: "November - March",
    mapLink: "https://maps.google.com",
  });

  await upsertTour({
    title: "Olumo Rock Tour",
    slug: "olumo-rock-tour",
    description: "Explore Olumo Rock.",
    price: 45000,
    duration: "2 days",
    availableSlots: 10,
    minGroupSize: 1,
    maxGroupSize: 5,
    featured: true,
    isPublished: true,
    type: "GROUP",
    images: [
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200",
    ],
    itinerary: "Day 1 arrival. Day 2 climb.",
    included: ["Transport"],
    excluded: ["Shopping"],
    destinationId: destinations.olumo.id,
  });

  await upsertTour({
    title: "Lekki Nature Tour",
    slug: "lekki-nature-tour",
    description: "Nature exploration.",
    price: 55000,
    duration: "1 day",
    availableSlots: 15,
    minGroupSize: 1,
    maxGroupSize: 8,
    featured: true,
    isPublished: true,
    type: "COUPLE",
    images: [
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1400",
    ],
    itinerary: "Walk and relax.",
    included: ["Entry"],
    excluded: ["Hotel"],
    destinationId: destinations.lekki.id,
  });

  const hashedPassword = await bcrypt.hash("Admin@12345", 12);

  await prisma.user.upsert({
    where: { email: "admin@xplore9ja.com" },
    update: {
      fullName: "Xplore9ja Admin",
      role: "SUPERADMIN",
      isVerified: true,
      isActive: true,
      password: hashedPassword,
    },
    create: {
      fullName: "Xplore9ja Admin",
      email: "admin@xplore9ja.com",
      password: hashedPassword,
      role: "SUPERADMIN",
      isVerified: true,
      isActive: true,
    },
  });

  console.log("✅ Seed completed successfully.");
}

main()
  .catch((e) => {
    console.error("SEED ERROR:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });