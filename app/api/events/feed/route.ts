import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ events: [] }, { status: 401 });

  const swiped = await prisma.swipe.findMany({
    where: { userId: user.id },
    select: { eventId: true },
  });
  const swipedIds = swiped.map((s) => s.eventId);

  const events = await prisma.event.findMany({
    where: {
      organizerId: { not: user.id },
      id: { notIn: swipedIds.length ? swipedIds : ["__none__"] },
    },
    include: {
      organizer: { select: { id: true, name: true, photoUrl: true } },
    },
    // Boosted events surface first; then soonest upcoming.
    orderBy: [{ isBoosted: "desc" }, { date: "asc" }],
  });

  return NextResponse.json({ events });
}
