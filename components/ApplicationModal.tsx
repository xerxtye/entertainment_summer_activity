"use client";

import { useState } from "react";
import { FeedEvent } from "@/lib/types";
import { formatEventDate } from "@/lib/format";

export default function ApplicationModal({
  event,
  onClose,
}: {
  event: FeedEvent;
  onClose: () => void;
}) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<null | "ACCEPTED" | "PENDING">(null);

  async function submit() {
    setLoading(true);
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId: event.id, message }),
      });
      const data = await res.json();
      setDone(data.status === "ACCEPTED" ? "ACCEPTED" : "PENDING");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 sm:items-center">
      <div className="w-full max-w-md rounded-t-3xl border-t border-neutral-800 bg-neutral-900 p-5 sm:rounded-3xl">
        {done ? (
          <div className="py-6 text-center">
            <div className="mb-3 text-5xl">{done === "ACCEPTED" ? "🎉" : "📨"}</div>
            <h3 className="text-xl font-bold">
              {done === "ACCEPTED" ? "You're in!" : "Request sent"}
            </h3>
            <p className="mt-2 text-sm text-neutral-400">
              {done === "ACCEPTED"
                ? `This public event was added to your map. See you at ${event.title}!`
                : `${event.organizer.name} will review your request for this private event.`}
            </p>
            <button
              onClick={onClose}
              className="mt-5 w-full rounded-2xl bg-grass-500 py-3 font-semibold text-neutral-950"
            >
              Keep swiping
            </button>
          </div>
        ) : (
          <>
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-neutral-700" />
            <p className="text-xs font-semibold uppercase tracking-wide text-grass-400">
              You&apos;re interested
            </p>
            <h3 className="mt-1 text-xl font-bold leading-tight">{event.title}</h3>
            <p className="mt-1 text-sm text-neutral-400">
              {formatEventDate(event.date)} · hosted by {event.organizer.name}
            </p>

            <label className="mt-4 block text-sm font-medium text-neutral-300">
              Message to organizer
            </label>
            <textarea
              autoFocus
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Hey! I'd love to join — a bit about me..."
              className="mt-1 w-full resize-none rounded-2xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-sm outline-none focus:border-grass-500"
            />

            {!event.isPublic && (
              <p className="mt-2 text-xs text-amber-400/90">
                Private event — the host approves requests.
              </p>
            )}

            <div className="mt-4 flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 rounded-2xl border border-neutral-700 py-3 font-semibold text-neutral-300"
              >
                Maybe later
              </button>
              <button
                disabled={loading}
                onClick={submit}
                className="flex-1 rounded-2xl bg-grass-500 py-3 font-semibold text-neutral-950 disabled:opacity-50"
              >
                {loading ? "Sending..." : event.isPublic ? "Join event" : "Send request"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
