import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { handle } from "@/lib/api-handler";

export const dynamic = "force-dynamic";

// Returns all public upcoming events, flagging which ones the current user
// has been accepted into. This populates the map from the start — no need
// to have swiped yet.
export const GET = handle(async () => {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ events: [] }, { status: 401 });

  const now = new Date();

  // Events the user was accepted into
  const accepted = await prisma.application.findMany({
    where: { applicantId: user.id, status: "ACCEPTED" },
    select: { eventId: true },
  });
  const acceptedIds = new Set(accepted.map((a) => a.eventId));

  // All public events (upcoming + past 24h)
  const events = await prisma.event.findMany({
    where: {
      isPublic: true,
      date: { gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) },
    },
    include: {
      organizer: { select: { id: true, name: true, photoUrl: true } },
    },
    orderBy: [{ isBoosted: "desc" }, { date: "asc" }],
  });

  const result = events.map((e) => ({
    id: e.id,
    title: e.title,
    description: e.description,
    locationName: e.locationName,
    lat: e.lat,
    lng: e.lng,
    date: e.date.toISOString(),
    photoUrl: e.photoUrl,
    isPublic: e.isPublic,
    isBoosted: e.isBoosted,
    organizer: e.organizer,
    isAccepted: acceptedIds.has(e.id),
    isOwn: e.organizerId === user.id,
  }));

  return NextResponse.json({ events: result });
});
