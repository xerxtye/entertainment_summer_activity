"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { FeedEvent } from "@/lib/types";

const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-sm text-neutral-500">
      Loading map…
    </div>
  ),
});

export default function MapPage() {
  const [events, setEvents] = useState<FeedEvent[] | null>(null);

  useEffect(() => {
    fetch("/api/events/accepted")
      .then((r) => r.json())
      .then((d) => setEvents(d.events ?? []))
      .catch(() => setEvents([]));
  }, []);

  const count = events?.length ?? 0;
  const map = useMemo(() => <MapView events={events ?? []} />, [events]);

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center justify-between px-5 pb-2 pt-5">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight">
            My Map
          </h1>
          <p className="text-xs text-neutral-500">Events you&apos;re going to</p>
        </div>
        <span className="chip">{count} accepted</span>
      </header>

      <div className="relative mx-4 mb-3 flex-1 overflow-hidden rounded-[1.75rem] ring-1 ring-white/10">
        {events === null ? (
          <div className="flex h-full items-center justify-center text-sm text-neutral-500">
            Loading…
          </div>
        ) : count === 0 ? (
          <div className="flex h-full flex-col items-center justify-center px-8 text-center">
            <div className="text-5xl">🧭</div>
            <h2 className="mt-3 text-lg font-bold">No events yet</h2>
            <p className="mt-2 text-sm text-neutral-400">
              Swipe right on events you like. Accepted ones show up here on the
              map.
            </p>
          </div>
        ) : (
          map
        )}
      </div>
    </div>
  );
}
