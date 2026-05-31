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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center">
      <div className="w-full max-w-md animate-fade-up rounded-t-[2rem] border-t border-white/10 bg-ink-800 p-5 shadow-card sm:rounded-[2rem]">
        {done ? (
          <div className="py-6 text-center">
            <div className="mb-3 text-5xl">{done === "ACCEPTED" ? "🎉" : "📨"}</div>
            <h3 className="font-display text-xl font-bold">
              {done === "ACCEPTED" ? "You're in!" : "Request sent"}
            </h3>
            <p className="mt-2 text-sm text-neutral-400">
              {done === "ACCEPTED"
                ? `This public event was added to your map. See you at ${event.title}!`
                : `${event.organizer.name} will review your request for this private event.`}
            </p>
            <button onClick={onClose} className="btn-primary mt-5 w-full py-3">
              Keep swiping
            </button>
          </div>
        ) : (
          <>
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-white/15" />
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-300">
              You&apos;re interested
            </p>
            <h3 className="mt-1 font-display text-xl font-bold leading-tight">
              {event.title}
            </h3>
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
              className="input mt-1 resize-none"
            />

            {!event.isPublic && (
              <p className="mt-2 text-xs text-lime-400/90">
                Private event — the host approves requests.
              </p>
            )}

            <div className="mt-4 flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 rounded-2xl border border-white/10 py-3 font-semibold text-neutral-300 transition active:scale-[0.98]"
              >
                Maybe later
              </button>
              <button
                disabled={loading}
                onClick={submit}
                className="btn-primary flex-1 py-3"
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
