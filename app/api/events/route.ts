import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const {
    title,
    description,
    locationName,
    lat,
    lng,
    date,
    photoUrl,
    isPublic,
  } = body;

  if (!title || !date || typeof lat !== "number" || typeof lng !== "number") {
    return NextResponse.json(
      { error: "Title, date and a map location are required." },
      { status: 400 }
    );
  }

  const event = await prisma.event.create({
    data: {
      title: String(title).slice(0, 120),
      description: String(description || "").slice(0, 1000),
      locationName: String(locationName || "").slice(0, 160),
      lat,
      lng,
      date: new Date(date),
      photoUrl: String(photoUrl || ""),
      isPublic: isPublic !== false,
      // New events inherit the organizer's Boost subscription.
      isBoosted: user.isBoosted,
      organizerId: user.id,
    },
  });

  return NextResponse.json({ event });
}
