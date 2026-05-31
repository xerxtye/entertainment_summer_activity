import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function daysFromNow(d: number, hour = 10) {
  const date = new Date();
  date.setDate(date.getDate() + d);
  date.setHours(hour, 0, 0, 0);
  return date;
}

async function main() {
  console.log("Seeding Touch the Grass...");

  // Demo organizers so the feed/map look alive on first launch.
  const maya = await prisma.user.upsert({
    where: { phone: "+15550000001" },
    update: {},
    create: {
      phone: "+15550000001",
      name: "Maya R.",
      about: "Trail runner & weekend climber. Always down for sunrise hikes.",
      photoUrl: "https://i.pravatar.cc/300?img=47",
      isBoosted: true,
    },
  });

  const leo = await prisma.user.upsert({
    where: { phone: "+15550000002" },
    update: {},
    create: {
      phone: "+15550000002",
      name: "Leo P.",
      about: "Pickup soccer organizer. Coffee, code, cardio.",
      photoUrl: "https://i.pravatar.cc/300?img=12",
      isBoosted: false,
    },
  });

  // Wipe demo events so re-seeding stays idempotent.
  await prisma.event.deleteMany({
    where: { organizerId: { in: [maya.id, leo.id] } },
  });

  const events = [
    {
      title: "Sunrise Hike — Twin Peaks",
      description:
        "Catch the city waking up. ~5km loop, moderate pace. Coffee after for whoever's keen.",
      locationName: "Twin Peaks, San Francisco",
      lat: 37.7544,
      lng: -122.4477,
      date: daysFromNow(2, 6),
      photoUrl:
        "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=70",
      isPublic: true,
      isBoosted: true,
      organizerId: maya.id,
    },
    {
      title: "Saturday Pickup Soccer",
      description:
        "Casual 5-a-side. All skill levels. Bring a light & dark shirt.",
      locationName: "Mission Playground",
      lat: 37.7615,
      lng: -122.4216,
      date: daysFromNow(3, 11),
      photoUrl:
        "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?w=800&q=70",
      isPublic: true,
      isBoosted: false,
      organizerId: leo.id,
    },
    {
      title: "Bouldering Session (Beginners OK)",
      description: "Indoor bouldering then tacos. I'll show you the ropes.",
      locationName: "Dogpatch Boulders",
      lat: 37.7576,
      lng: -122.3893,
      date: daysFromNow(4, 18),
      photoUrl:
        "https://images.unsplash.com/photo-1522163182402-834f871fd851?w=800&q=70",
      isPublic: false,
      isBoosted: false,
      organizerId: maya.id,
    },
    {
      title: "Golden Gate Park Picnic",
      description: "Blankets, snacks, frisbee. Bring something to share.",
      locationName: "Golden Gate Park",
      lat: 37.7694,
      lng: -122.4862,
      date: daysFromNow(5, 13),
      photoUrl:
        "https://images.unsplash.com/photo-1526401485004-46910ecc8e51?w=800&q=70",
      isPublic: true,
      isBoosted: true,
      organizerId: maya.id,
    },
    {
      title: "Morning Run Club — Embarcadero",
      description: "Easy 5k along the water. Negative splits optional :)",
      locationName: "The Embarcadero",
      lat: 37.7955,
      lng: -122.3937,
      date: daysFromNow(1, 7),
      photoUrl:
        "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=70",
      isPublic: true,
      isBoosted: false,
      organizerId: leo.id,
    },
    {
      title: "Sunset Yoga at Dolores",
      description: "Bring a mat. Beginner-friendly flow as the sun drops.",
      locationName: "Dolores Park",
      lat: 37.7596,
      lng: -122.4269,
      date: daysFromNow(2, 18),
      photoUrl:
        "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=70",
      isPublic: true,
      isBoosted: false,
      organizerId: maya.id,
    },
    {
      title: "Kayaking Meetup",
      description: "Rent-and-paddle around the bay. Some experience helpful.",
      locationName: "South Beach Harbor",
      lat: 37.7825,
      lng: -122.3874,
      date: daysFromNow(6, 9),
      photoUrl:
        "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&q=70",
      isPublic: false,
      isBoosted: false,
      organizerId: leo.id,
    },
    {
      title: "Board Games & Beer",
      description: "Catan, Codenames, whatever you bring. Chill vibes.",
      locationName: "Outer Sunset",
      lat: 37.7558,
      lng: -122.4943,
      date: daysFromNow(4, 19),
      photoUrl:
        "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=800&q=70",
      isPublic: true,
      isBoosted: false,
      organizerId: leo.id,
    },
  ];

  for (const e of events) {
    await prisma.event.create({ data: e });
  }

  console.log(`Seeded ${events.length} events and 2 demo organizers.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
