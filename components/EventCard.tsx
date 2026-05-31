import { FeedEvent } from "@/lib/types";
import { formatEventDate, avatarFor } from "@/lib/format";

export default function EventCard({ event }: { event: FeedEvent }) {
  const organizerPhoto = event.organizer.photoUrl || avatarFor(event.organizer.id);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-3xl bg-neutral-800 shadow-card">
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
        <div className="absolute inset-0 bg-gradient-to-br from-grass-700 to-grass-900" />
      )}

      {/* Gradient for legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/30" />

      {/* Top badges */}
      <div className="absolute left-4 right-4 top-4 flex items-start justify-between">
        {event.isBoosted ? (
          <span className="flex items-center gap-1 rounded-full bg-amber-400 px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-amber-950 shadow">
            ⚡ Boost
          </span>
        ) : (
          <span />
        )}
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            event.isPublic
              ? "bg-grass-500/90 text-neutral-950"
              : "bg-neutral-900/80 text-neutral-200 ring-1 ring-white/20"
          }`}
        >
          {event.isPublic ? "Public" : "Private"}
        </span>
      </div>

      {/* Bottom content */}
      <div className="absolute inset-x-0 bottom-0 p-5">
        <div className="mb-2 flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={organizerPhoto}
            alt={event.organizer.name}
            className="h-7 w-7 rounded-full object-cover ring-2 ring-white/30"
            draggable={false}
          />
          <span className="text-sm font-medium text-neutral-200">
            {event.organizer.name}
          </span>
        </div>

        <h2 className="text-2xl font-extrabold leading-tight">{event.title}</h2>

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-neutral-300">
          <span className="flex items-center gap-1">📅 {formatEventDate(event.date)}</span>
          {event.locationName && (
            <span className="flex items-center gap-1">📍 {event.locationName}</span>
          )}
        </div>

        {event.description && (
          <p className="mt-2 line-clamp-3 text-sm text-neutral-300/90">
            {event.description}
          </p>
        )}
      </div>
    </div>
  );
}
