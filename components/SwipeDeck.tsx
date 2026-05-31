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
  const third = events[index + 2];

  function recordSwipe(eventId: string, direction: "LIKE" | "SKIP") {
    fetch("/api/swipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId, direction }),
    }).catch(() => {});
  }

  function commit(direction: "left" | "right") {
    if (!current || flyingOut) return;
    setFlyingOut(direction);
    const liked = direction === "right";
    recordSwipe(current.id, liked ? "LIKE" : "SKIP");
    const swiped = current;
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
        <h2 className="mt-4 font-display text-xl font-bold">
          You&apos;ve seen them all
        </h2>
        <p className="mt-2 text-sm text-neutral-400">
          Check back later for new events — or create your own and get people
          off the couch.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="relative flex-1 px-4 pb-3">
        {/* Third card (deep peek) */}
        {third && (
          <div className="absolute inset-x-4 inset-y-0 scale-[0.9] opacity-30">
            <EventCard event={third} />
          </div>
        )}
        {/* Next card (peek) */}
        {next && (
          <div className="absolute inset-x-4 inset-y-0 scale-[0.95] opacity-70">
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
          {/* SAVE / SKIP stamps */}
          <div
            className="pointer-events-none absolute left-6 top-8 z-10 rotate-[-16deg] rounded-2xl border-4 border-brand-400 bg-brand-500/15 px-4 py-1.5 text-2xl font-extrabold uppercase tracking-wide text-brand-300 backdrop-blur"
            style={{ opacity: likeOpacity }}
          >
            Interested
          </div>
          <div
            className="pointer-events-none absolute right-6 top-8 z-10 rotate-[16deg] rounded-2xl border-4 border-red-400 bg-red-500/15 px-4 py-1.5 text-2xl font-extrabold uppercase tracking-wide text-red-300 backdrop-blur"
            style={{ opacity: skipOpacity }}
          >
            Skip
          </div>

          <EventCard event={current} />
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-center gap-5 px-4 pb-1 pt-1">
        <button
          aria-label="Skip"
          onClick={() => commit("left")}
          className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-ink-700 text-2xl text-red-400 shadow-soft transition hover:border-red-400/40 active:scale-90"
        >
          ✕
        </button>
        <button
          aria-label="Interested"
          onClick={() => commit("right")}
          className="flex h-[68px] w-[68px] items-center justify-center rounded-full bg-brand-gradient text-3xl text-ink-900 shadow-glow transition active:scale-90"
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
