import { FeedEvent } from "@/lib/types";
import { formatEventDate, avatarFor } from "@/lib/format";

export default function EventCard({ event }: { event: FeedEvent }) {
  const organizerPhoto = event.organizer.photoUrl || avatarFor(event.organizer.id);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-[2rem] bg-ink-700 shadow-card ring-1 ring-white/10">
      {/* Photo */}
      {event.photoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={event.photoUrl}
          alt={event.title}
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600 to-ink-900" />
      )}

      {/* Gradient for legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/25 to-black/40" />

      {/* Top badges */}
      <div className="absolute left-4 right-4 top-4 flex items-start justify-between">
        {event.isBoosted ? (
          <span className="flex items-center gap-1 rounded-full bg-brand-gradient px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-ink-900 shadow-glow">
            ⚡ Boost
          </span>
        ) : (
          <span />
        )}
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold backdrop-blur ${
            event.isPublic
              ? "bg-brand-500/90 text-ink-900"
              : "bg-black/40 text-neutral-100 ring-1 ring-white/20"
          }`}
        >
          {event.isPublic ? "Public" : "Private"}
        </span>
      </div>

      {/* Bottom glass info panel */}
      <div className="absolute inset-x-3 bottom-3">
        <div className="glass rounded-[1.5rem] p-4">
          <div className="mb-2 flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={organizerPhoto}
              alt={event.organizer.name}
              className="h-7 w-7 rounded-full object-cover ring-2 ring-brand-400/50"
              draggable={false}
            />
            <span className="text-sm font-medium text-neutral-200">
              {event.organizer.name}
            </span>
          </div>

          <h2 className="font-display text-2xl font-extrabold leading-tight tracking-tight">
            {event.title}
          </h2>

          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            <span className="chip">📅 {formatEventDate(event.date)}</span>
            {event.locationName && (
              <span className="chip">📍 {event.locationName}</span>
            )}
          </div>

          {event.description && (
            <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-neutral-300/90">
              {event.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
