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
      "Olumo Rock is one of Nigeria’s most iconic tourist attractions, offering panoramic views, cultural history, and a memorable climb experience.",
    location: "Abeokuta",
    state: "Ogun",
    country: "Nigeria",
    address: "Ikija, Abeokuta",
    price: 15000,
    featured: true,
    isPublished: true,
    category: "HISTORICAL",
    images: [
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
    ],
    tags: ["history", "rock", "culture"],
    bestTime: "October - February",
    mapLink: "https://maps.google.com",
  });

  destinations.lekki = await upsertDestination({
    name: "Lekki Conservation Centre",
    slug: "lekki-conservation-centre",
    shortDescription: "Nature reserve and canopy walkway.",
    description:
      "Lekki Conservation Centre is ideal for nature lovers, with scenic greenery, wildlife, and one of Africa’s longest canopy walkways.",
    location: "Lekki",
    state: "Lagos",
    country: "Nigeria",
    address: "Lekki-Epe Expressway",
    price: 20000,
    featured: true,
    isPublished: true,
    category: "NATURE",
    images: [
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1400&auto=format&fit=crop",
    ],
    tags: ["nature", "canopy", "wildlife"],
    bestTime: "November - March",
    mapLink: "https://maps.google.com",
  });

  destinations.yankari = await upsertDestination({
    name: "Yankari Game Reserve",
    slug: "yankari-game-reserve",
    shortDescription: "Wildlife and safari experience.",
    description:
      "Yankari offers one of the most exciting wildlife experiences in Nigeria, with safari activities, warm springs, and natural scenery.",
    location: "Bauchi",
    state: "Bauchi",
    country: "Nigeria",
    address: "Main Reserve Road, Bauchi",
    price: 35000,
    featured: false,
    isPublished: true,
    category: "WILDLIFE",
    images: [
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1200&auto=format&fit=crop",
    ],
    tags: ["safari", "wildlife", "adventure"],
    bestTime: "December - April",
    mapLink: "https://maps.google.com",
  });

  destinations.obudu = await upsertDestination({
    name: "Obudu Mountain Resort",
    slug: "obudu-mountain-resort",
    shortDescription: "Cool-weather mountain resort escape.",
    description:
      "Obudu Mountain Resort is famous for its breathtaking mountain scenery, cool climate, cable car, and premium leisure atmosphere.",
    location: "Obudu",
    state: "Cross River",
    country: "Nigeria",
    address: "Obudu Plateau",
    price: 60000,
    featured: true,
    isPublished: true,
    category: "RESORT",
    images: [
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?q=80&w=1400&auto=format&fit=crop",
    ],
    tags: ["mountain", "resort", "luxury"],
    bestTime: "November - February",
    mapLink: "https://maps.google.com",
  });

  destinations.erin = await upsertDestination({
    name: "Erin Ijesha Waterfalls",
    slug: "erin-ijesha-waterfalls",
    shortDescription: "Scenic multi-level waterfall adventure.",
    description:
      "Erin Ijesha Waterfalls offers a refreshing blend of adventure, hiking, and natural beauty with multiple levels of falls to explore.",
    location: "Erin Ijesha",
    state: "Osun",
    country: "Nigeria",
    address: "Erin Ijesha, Osun State",
    price: 18000,
    featured: true,
    isPublished: true,
    category: "WATERFALL",
    images: [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1400&auto=format&fit=crop",
    ],
    tags: ["waterfall", "hiking", "nature"],
    bestTime: "September - January",
    mapLink: "https://maps.google.com",
  });

  destinations.kajuru = await upsertDestination({
    name: "Kajuru Castle",
    slug: "kajuru-castle",
    shortDescription: "Unique castle stay and scenic escape.",
    description:
      "Kajuru Castle combines dramatic architecture with a peaceful hilltop setting, making it one of the most unique travel stays in Nigeria.",
    location: "Kajuru",
    state: "Kaduna",
    country: "Nigeria",
    address: "Kajuru, Kaduna State",
    price: 50000,
    featured: true,
    isPublished: true,
    category: "RESORT",
    images: [
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=1400&auto=format&fit=crop",
    ],
    tags: ["castle", "luxury", "getaway"],
    bestTime: "October - February",
    mapLink: "https://maps.google.com",
  });

  destinations.ikogosi = await upsertDestination({
    name: "Ikogosi Warm Springs",
    slug: "ikogosi-warm-springs",
    shortDescription: "Warm and cold springs meeting naturally.",
    description:
      "Ikogosi is a fascinating natural attraction known for its warm and cold springs flowing side by side within a peaceful resort environment.",
    location: "Ikogosi",
    state: "Ekiti",
    country: "Nigeria",
    address: "Ikogosi, Ekiti State",
    price: 25000,
    featured: false,
    isPublished: true,
    category: "NATURE",
    images: [
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1400&auto=format&fit=crop",
    ],
    tags: ["springs", "nature", "resort"],
    bestTime: "November - March",
    mapLink: "https://maps.google.com",
  });

  destinations.idanre = await upsertDestination({
    name: "Idanre Hills",
    slug: "idanre-hills",
    shortDescription: "Ancient hill settlement and hiking location.",
    description:
      "Idanre Hills offers a dramatic landscape, historic sites, and a rewarding climb for travelers who enjoy culture and adventure.",
    location: "Idanre",
    state: "Ondo",
    country: "Nigeria",
    address: "Idanre, Ondo State",
    price: 22000,
    featured: false,
    isPublished: true,
    category: "ADVENTURE",
    images: [
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1200&auto=format&fit=crop",
    ],
    tags: ["hills", "adventure", "history"],
    bestTime: "October - February",
    mapLink: "https://maps.google.com",
  });

  destinations.ngwo = await upsertDestination({
    name: "Ngwo Pine Forest & Cave",
    slug: "ngwo-pine-forest-cave",
    shortDescription: "Forest trails, cave, and waterfall scenery.",
    description:
      "Ngwo Pine Forest is a calm and visually striking destination, combining pine trails, cave exploration, and natural waterfall views.",
    location: "Enugu",
    state: "Enugu",
    country: "Nigeria",
    address: "Ngwo, Enugu State",
    price: 17000,
    featured: false,
    isPublished: true,
    category: "NATURE",
    images: [
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1400&auto=format&fit=crop",
    ],
    tags: ["forest", "cave", "waterfall"],
    bestTime: "November - February",
    mapLink: "https://maps.google.com",
  });

  destinations.zuma = await upsertDestination({
    name: "Zuma Rock",
    slug: "zuma-rock",
    shortDescription: "Massive rock formation near Abuja.",
    description:
      "Zuma Rock is one of Nigeria’s most recognizable natural landmarks and a must-see stop for travelers exploring the Abuja region.",
    location: "Madalla",
    state: "Niger",
    country: "Nigeria",
    address: "Along Abuja-Kaduna Road",
    price: 12000,
    featured: false,
    isPublished: true,
    category: "HISTORICAL",
    images: [
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
    ],
    tags: ["rock", "landmark", "abuja"],
    bestTime: "All year",
    mapLink: "https://maps.google.com",
  });

  destinations.tarkwa = await upsertDestination({
    name: "Tarkwa Bay",
    slug: "tarkwa-bay",
    shortDescription: "Beach escape accessible by boat.",
    description:
      "Tarkwa Bay is a laid-back beach destination ideal for water activities, beach relaxation, and a quick premium escape from Lagos city life.",
    location: "Lagos",
    state: "Lagos",
    country: "Nigeria",
    address: "Tarkwa Bay Beach",
    price: 30000,
    featured: true,
    isPublished: true,
    category: "BEACH",
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1400&auto=format&fit=crop",
    ],
    tags: ["beach", "lagos", "boat trip"],
    bestTime: "November - March",
    mapLink: "https://maps.google.com",
  });

  destinations.ogbunike = await upsertDestination({
    name: "Ogbunike Caves",
    slug: "ogbunike-caves",
    shortDescription: "UNESCO-recognized cave destination.",
    description:
      "Ogbunike Caves is a fascinating heritage destination with cave chambers, sacred significance, and a memorable exploration experience.",
    location: "Ogbunike",
    state: "Anambra",
    country: "Nigeria",
    address: "Ogbunike, Anambra State",
    price: 16000,
    featured: false,
    isPublished: true,
    category: "HISTORICAL",
    images: [
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1200&auto=format&fit=crop",
    ],
    tags: ["caves", "heritage", "history"],
    bestTime: "November - February",
    mapLink: "https://maps.google.com",
  });

  await upsertTour({
    title: "Olumo Rock Weekend Tour",
    slug: "olumo-rock-weekend-tour",
    shortDescription: "A short premium cultural escape.",
    description:
      "A curated weekend tour to Olumo Rock with guided exploration, local food experience, and comfortable travel arrangements.",
    price: 45000,
    discountPrice: 40000,
    duration: "2 days",
    availableSlots: 20,
    minGroupSize: 1,
    maxGroupSize: 10,
    featured: true,
    isPublished: true,
    type: "GROUP",
    images: [
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
    ],
    itinerary: "Day 1 arrival and city tour. Day 2 rock climb and return.",
    included: ["Transport", "Guide", "Refreshments"],
    excluded: ["Personal shopping"],
    destinationId: destinations.olumo.id,
  });

  await upsertTour({
    title: "Lekki Nature Experience",
    slug: "lekki-nature-experience",
    shortDescription: "A refreshing city nature getaway.",
    description:
      "Explore Lekki Conservation Centre with a premium, easy-going itinerary designed for couples, friends, and solo travelers.",
    price: 55000,
    duration: "1 day",
    availableSlots: 15,
    minGroupSize: 1,
    maxGroupSize: 8,
    featured: true,
    isPublished: true,
    type: "COUPLE",
    images: [
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1400&auto=format&fit=crop",
    ],
    itinerary: "Morning arrival, canopy walk, picnic, photo session.",
    included: ["Entry", "Guide", "Snacks"],
    excluded: ["Hotel"],
    destinationId: destinations.lekki.id,
  });

  await upsertTour({
    title: "Yankari Safari Adventure",
    slug: "yankari-safari-adventure",
    shortDescription: "Adventure and wildlife in one package.",
    description:
      "A richer safari experience with guided reserve access, spring relaxation, and a structured adventure plan.",
    price: 120000,
    duration: "3 days",
    availableSlots: 12,
    minGroupSize: 1,
    maxGroupSize: 6,
    featured: false,
    isPublished: true,
    type: "ADVENTURE",
    images: [
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1200&auto=format&fit=crop",
    ],
    itinerary: "Safari, warm spring visit, guided exploration.",
    included: ["Transport", "Accommodation", "Guide"],
    excluded: ["Personal expenses"],
    destinationId: destinations.yankari.id,
  });

  await upsertTour({
    title: "Obudu Luxury Mountain Retreat",
    slug: "obudu-luxury-mountain-retreat",
    shortDescription: "Premium mountain resort package.",
    description:
      "A premium resort retreat featuring cool weather, scenic views, quality lodging, and a relaxing mountain experience.",
    price: 180000,
    duration: "3 days",
    availableSlots: 10,
    minGroupSize: 1,
    maxGroupSize: 5,
    featured: true,
    isPublished: true,
    type: "LUXURY",
    images: [
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?q=80&w=1400&auto=format&fit=crop",
    ],
    itinerary: "Arrival, resort stay, cable car, sightseeing, departure.",
    included: ["Accommodation", "Transport", "Breakfast"],
    excluded: ["Personal shopping"],
    destinationId: destinations.obudu.id,
  });

  await upsertTour({
    title: "Erin Ijesha Adventure Escape",
    slug: "erin-ijesha-adventure-escape",
    shortDescription: "Hiking and waterfall discovery package.",
    description:
      "An energetic tour built around waterfall exploration, movement, nature, and shared adventure moments.",
    price: 65000,
    duration: "2 days",
    availableSlots: 18,
    minGroupSize: 1,
    maxGroupSize: 12,
    featured: true,
    isPublished: true,
    type: "ADVENTURE",
    images: [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1400&auto=format&fit=crop",
    ],
    itinerary: "Travel, waterfall hike, relaxation, return.",
    included: ["Transport", "Entry", "Guide"],
    excluded: ["Extra meals"],
    destinationId: destinations.erin.id,
  });

  await upsertTour({
    title: "Kajuru Castle Romantic Getaway",
    slug: "kajuru-castle-romantic-getaway",
    shortDescription: "Premium couple-focused castle escape.",
    description:
      "A refined tour ideal for couples seeking privacy, dramatic scenery, and a special luxury stay.",
    price: 200000,
    duration: "2 days",
    availableSlots: 6,
    minGroupSize: 2,
    maxGroupSize: 4,
    featured: true,
    isPublished: true,
    type: "COUPLE",
    images: [
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=1400&auto=format&fit=crop",
    ],
    itinerary: "Arrival, castle stay, dinner, leisure, departure.",
    included: ["Accommodation", "Dinner", "Breakfast"],
    excluded: ["Transport to pickup point"],
    destinationId: destinations.kajuru.id,
  });

  await upsertTour({
    title: "Ikogosi Springs Family Retreat",
    slug: "ikogosi-springs-family-retreat",
    shortDescription: "Relaxed family-friendly resort package.",
    description:
      "A comfortable and easy-paced retreat designed for family bonding, nature walks, and resort relaxation.",
    price: 90000,
    duration: "2 days",
    availableSlots: 16,
    minGroupSize: 2,
    maxGroupSize: 8,
    featured: false,
    isPublished: true,
    type: "FAMILY",
    images: [
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1400&auto=format&fit=crop",
    ],
    itinerary: "Arrival, spring visit, resort rest, family time, departure.",
    included: ["Accommodation", "Breakfast", "Guide"],
    excluded: ["Private shopping"],
    destinationId: destinations.ikogosi.id,
  });

  await upsertTour({
    title: "Idanre Hills Explorer Tour",
    slug: "idanre-hills-explorer-tour",
    shortDescription: "Guided hill adventure and heritage walk.",
    description:
      "A guided adventure package for travelers who enjoy movement, heritage, and strong scenic moments.",
    price: 70000,
    duration: "2 days",
    availableSlots: 14,
    minGroupSize: 1,
    maxGroupSize: 10,
    featured: false,
    isPublished: true,
    type: "ADVENTURE",
    images: [
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1200&auto=format&fit=crop",
    ],
    itinerary: "Arrival, hill climb, heritage walk, rest, departure.",
    included: ["Guide", "Transport", "Refreshments"],
    excluded: ["Extra food"],
    destinationId: destinations.idanre.id,
  });

  await upsertTour({
    title: "Ngwo Forest Discovery Tour",
    slug: "ngwo-forest-discovery-tour",
    shortDescription: "Forest, cave, and waterfall experience.",
    description:
      "A calm but memorable tour that blends forest exploration with cave and waterfall scenery.",
    price: 50000,
    duration: "1 day",
    availableSlots: 20,
    minGroupSize: 1,
    maxGroupSize: 10,
    featured: false,
    isPublished: true,
    type: "GROUP",
    images: [
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1400&auto=format&fit=crop",
    ],
    itinerary: "Travel, exploration, picnic, return.",
    included: ["Guide", "Entry"],
    excluded: ["Meals"],
    destinationId: destinations.ngwo.id,
  });

  await upsertTour({
    title: "Tarkwa Bay Coastal Escape",
    slug: "tarkwa-bay-coastal-escape",
    shortDescription: "Beach and boat day experience.",
    description:
      "A stylish beach package with a smoother coastal vibe, ideal for city dwellers wanting a quick premium escape.",
    price: 80000,
    duration: "1 day",
    availableSlots: 25,
    minGroupSize: 1,
    maxGroupSize: 15,
    featured: true,
    isPublished: true,
    type: "GROUP",
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1400&auto=format&fit=crop",
    ],
    itinerary: "Boat ride, beach relaxation, activities, return.",
    included: ["Boat transfer", "Entry", "Refreshments"],
    excluded: ["Private cabana"],
    destinationId: destinations.tarkwa.id,
  });

  await upsertTour({
    title: "Ogbunike Heritage Cave Tour",
    slug: "ogbunike-heritage-cave-tour",
    shortDescription: "Guided cave and heritage exploration.",
    description:
      "A cultural exploration experience focused on local heritage, cave discovery, and storytelling.",
    price: 48000,
    duration: "1 day",
    availableSlots: 18,
    minGroupSize: 1,
    maxGroupSize: 12,
    featured: false,
    isPublished: true,
    type: "GROUP",
    images: [
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1200&auto=format&fit=crop",
    ],
    itinerary: "Travel, guided cave tour, heritage exploration, return.",
    included: ["Guide", "Entry", "Water"],
    excluded: ["Meals"],
    destinationId: destinations.ogbunike.id,
  });

  console.log("Large seed completed successfully.");
}

main()
  .catch((e) => {
    console.error("SEED ERROR:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });