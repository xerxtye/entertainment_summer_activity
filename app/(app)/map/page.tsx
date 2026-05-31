"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { MapEvent } from "@/components/MapView";

const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-sm text-neutral-500">
      Loading map…
    </div>
  ),
});

type LoadState = "loading" | "empty" | "ready" | "error";

export default function MapPage() {
  const [events, setEvents] = useState<MapEvent[]>([]);
  const [state, setState] = useState<LoadState>("loading");

  useEffect(() => {
    fetch("/api/events/map")
      .then((r) => r.json())
      .then((d) => {
        const evs: MapEvent[] = d.events ?? [];
        setEvents(evs);
        setState(evs.length > 0 ? "ready" : "empty");
      })
      .catch(() => setState("error"));
  }, []);

  const acceptedCount = events.filter((e) => e.isAccepted).length;
  const totalCount = events.length;

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center justify-between px-5 pb-2 pt-5">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight">
            Map
          </h1>
          <p className="text-xs text-neutral-500">
            {state === "ready"
              ? `${totalCount} events nearby · ${acceptedCount} you're going to`
              : "Public events around you"}
          </p>
        </div>
      </header>

      {/* Legend */}
      {state === "ready" && (
        <div className="flex flex-wrap gap-2 px-5 pb-2">
          <span className="chip">🟢 Going ({acceptedCount})</span>
          <span className="chip">📍 Open ({totalCount - acceptedCount})</span>
          {events.some((e) => e.isBoosted) && <span className="chip">⚡ Boosted</span>}
        </div>
      )}

      <div className="relative mx-4 mb-3 flex-1 overflow-hidden rounded-[1.75rem] ring-1 ring-white/10">
        {state === "loading" && (
          <div className="flex h-full items-center justify-center text-sm text-neutral-500">
            Loading…
          </div>
        )}

        {state === "error" && (
          <div className="flex h-full flex-col items-center justify-center px-8 text-center">
            <div className="text-4xl">⚠️</div>
            <p className="mt-3 text-sm text-neutral-400">
              Could not load map data. Check your connection and try again.
            </p>
          </div>
        )}

        {state === "empty" && (
          <div className="flex h-full flex-col items-center justify-center px-8 text-center">
            <div className="text-5xl">🧭</div>
            <h2 className="mt-3 font-display text-lg font-bold">No events yet</h2>
            <p className="mt-2 text-sm text-neutral-400">
              Create an event or wait for others to post — public events will
              appear here automatically.
            </p>
          </div>
        )}

        {state === "ready" && <MapView events={events} />}
      </div>
    </div>
  );
}
