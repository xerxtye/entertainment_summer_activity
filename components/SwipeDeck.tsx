"use client";

import { useRef, useState } from "react";
import { FeedEvent } from "@/lib/types";
import EventCard from "./EventCard";
import ApplicationModal from "./ApplicationModal";

const SWIPE_THRESHOLD = 110;

export default function SwipeDeck({ initial }: { initial: FeedEvent[] }) {
  const [events] = useState<FeedEvent[]>(initial);
  const [index, setIndex] = useState(0);
  const [drag, setDrag] = useState({ x: 0, y: 0 });
  const [flyingOut, setFlyingOut] = useState<"left" | "right" | null>(null);
  const [pending, setPending] = useState<FeedEvent | null>(null);
  const startRef = useRef<{ x: number; y: number } | null>(null);
  const draggingRef = useRef(false);

  const current = events[index];
  const next = events[index + 1];

  function recordSwipe(eventId: string, direction: "LIKE" | "SKIP") {
    fetch("/api/swipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId, direction }),
    }).catch(() => {});
  }

  function commit(direction: "left" | "right") {
    if (!current) return;
    setFlyingOut(direction);
    const liked = direction === "right";
    recordSwipe(current.id, liked ? "LIKE" : "SKIP");
    const swiped = current;
    // Let the card animate off, then advance.
    setTimeout(() => {
      setIndex((i) => i + 1);
      setDrag({ x: 0, y: 0 });
      setFlyingOut(null);
      if (liked) setPending(swiped);
    }, 250);
  }

  function onPointerDown(e: React.PointerEvent) {
    if (flyingOut) return;
    draggingRef.current = true;
    startRef.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!draggingRef.current || !startRef.current) return;
    setDrag({
      x: e.clientX - startRef.current.x,
      y: e.clientY - startRef.current.y,
    });
  }
  function onPointerUp() {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    startRef.current = null;
    if (drag.x > SWIPE_THRESHOLD) commit("right");
    else if (drag.x < -SWIPE_THRESHOLD) commit("left");
    else setDrag({ x: 0, y: 0 });
  }

  const rotation = drag.x / 18;
  const likeOpacity = Math.max(0, Math.min(1, drag.x / SWIPE_THRESHOLD));
  const skipOpacity = Math.max(0, Math.min(1, -drag.x / SWIPE_THRESHOLD));

  const topTransform = flyingOut
    ? `translate(${flyingOut === "right" ? 1000 : -1000}px, ${drag.y}px) rotate(${
        flyingOut === "right" ? 30 : -30
      }deg)`
    : `translate(${drag.x}px, ${drag.y}px) rotate(${rotation}deg)`;

  if (!current) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
        <div className="text-6xl">🌾</div>
        <h2 className="mt-4 text-xl font-bold">You&apos;ve seen them all</h2>
        <p className="mt-2 text-sm text-neutral-400">
          Check back later for new events — or create your own and get people
          off the couch.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="relative flex-1 px-4 pb-4">
        {/* Next card (peek) */}
        {next && (
          <div className="absolute inset-x-4 inset-y-0 scale-[0.96] opacity-60">
            <EventCard event={next} />
          </div>
        )}

        {/* Top card */}
        <div
          className="absolute inset-x-4 inset-y-0 cursor-grab touch-none select-none active:cursor-grabbing"
          style={{
            transform: topTransform,
            transition: draggingRef.current ? "none" : "transform 0.25s ease-out",
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {/* LIKE / SKIP stamps */}
          <div
            className="pointer-events-none absolute left-5 top-6 z-10 rotate-[-18deg] rounded-xl border-4 border-grass-400 px-3 py-1 text-2xl font-extrabold uppercase text-grass-400"
            style={{ opacity: likeOpacity }}
          >
            Interested
          </div>
          <div
            className="pointer-events-none absolute right-5 top-6 z-10 rotate-[18deg] rounded-xl border-4 border-red-400 px-3 py-1 text-2xl font-extrabold uppercase text-red-400"
            style={{ opacity: skipOpacity }}
          >
            Skip
          </div>

          <EventCard event={current} />
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-center gap-6 px-4 pb-2 pt-1">
        <button
          aria-label="Skip"
          onClick={() => commit("left")}
          className="flex h-16 w-16 items-center justify-center rounded-full border border-neutral-700 bg-neutral-900 text-3xl text-red-400 shadow-lg transition active:scale-90"
        >
          ✕
        </button>
        <button
          aria-label="Interested"
          onClick={() => commit("right")}
          className="flex h-20 w-20 items-center justify-center rounded-full bg-grass-500 text-4xl text-neutral-950 shadow-lg transition active:scale-90"
        >
          ♥
        </button>
      </div>

      {pending && (
        <ApplicationModal event={pending} onClose={() => setPending(null)} />
      )}
    </div>
  );
}
