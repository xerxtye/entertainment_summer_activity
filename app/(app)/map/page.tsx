"use client";

import { useEffect, useState } from "react";
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

type LoadState = "loading" | "empty" | "ready" | "error";

export default function MapPage() {
  const [events, setEvents] = useState<FeedEvent[]>([]);
  const [state, setState] = useState<LoadState>("loading");

  useEffect(() => {
    fetch("/api/events/accepted")
      .then((r) => r.json())
      .then((d) => {
        const evs: FeedEvent[] = d.events ?? [];
        setEvents(evs);
        setState(evs.length > 0 ? "ready" : "empty");
      })
      .catch(() => setState("error"));
  }, []);

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center justify-between px-5 pb-2 pt-5">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight">
            My Map
          </h1>
          <p className="text-xs text-neutral-500">Events you&apos;re going to</p>
        </div>
        {state === "ready" && (
          <span className="chip">{events.length} accepted</span>
        )}
      </header>

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
              Swipe right on events and join them — accepted ones appear here on
              the map.
            </p>
          </div>
        )}

        {state === "ready" && <MapView events={events} />}
      </div>
    </div>
  );
}
