import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import SwipeDeck from "@/components/SwipeDeck";
import { FeedEvent } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function FeedPage() {
  const user = await getCurrentUser();

  const swiped = user
    ? (
        await prisma.swipe.findMany({
          where: { userId: user.id },
          select: { eventId: true },
        })
      ).map((s) => s.eventId)
    : [];

  const events = await prisma.event.findMany({
    where: {
      organizerId: user ? { not: user.id } : undefined,
      id: { notIn: swiped.length ? swiped : ["__none__"] },
    },
    include: {
      organizer: { select: { id: true, name: true, photoUrl: true } },
    },
    orderBy: [{ isBoosted: "desc" }, { date: "asc" }],
  });

  const feed: FeedEvent[] = events.map((e) => ({
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
  }));

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center justify-between px-5 pb-2 pt-4">
        <h1 className="text-xl font-extrabold">
          🌱 <span className="align-middle">Discover</span>
        </h1>
        <span className="text-xs text-neutral-500">Swipe right to join</span>
      </header>
      <SwipeDeck initial={feed} />
    </div>
  );
}
