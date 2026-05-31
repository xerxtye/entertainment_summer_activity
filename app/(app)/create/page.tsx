"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

const LocationPicker = dynamic(() => import("@/components/LocationPicker"), {
  ssr: false,
  loading: () => (
    <div className="flex h-48 items-center justify-center rounded-2xl bg-ink-700 text-sm text-neutral-500">
      Loading map…
    </div>
  ),
});

const PHOTO_SUGGESTIONS = [
  "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=70",
  "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?w=800&q=70",
  "https://images.unsplash.com/photo-1526401485004-46910ecc8e51?w=800&q=70",
  "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=70",
];

export default function CreatePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [locationName, setLocationName] = useState("");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [date, setDate] = useState("");
  const [photoUrl, setPhotoUrl] = useState(PHOTO_SUGGESTIONS[0]);
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const valid = title.trim() && date && coords;

  async function submit() {
    if (!valid) {
      setError("Add a title, date and tap the map to set a location.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          locationName,
          lat: coords!.lat,
          lng: coords!.lng,
          date,
          photoUrl,
          isPublic,
        }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Could not create event");
      }
      router.push("/profile");
      router.refresh();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto no-scrollbar">
      <header className="px-5 pb-1 pt-5">
        <h1 className="font-display text-2xl font-extrabold tracking-tight">
          Create event
        </h1>
        <p className="text-xs text-neutral-500">
          Get people off the couch and onto the grass.
        </p>
      </header>

      <div className="space-y-4 px-5 py-3 pb-8">
        <Field label="Title">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Sunrise hike at Twin Peaks"
            className="input"
          />
        </Field>

        <Field label="Description">
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What's the plan? Skill level, what to bring..."
            className="input resize-none"
          />
        </Field>

        <Field label="Location name">
          <input
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
            placeholder="Twin Peaks, San Francisco"
            className="input"
          />
        </Field>

        <Field label="Pin it on the map (tap to set)">
          <LocationPicker
            value={coords}
            onPick={(lat, lng) => setCoords({ lat, lng })}
          />
          <p className="mt-1 text-xs text-neutral-500">
            {coords
              ? `Selected: ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`
              : "No location selected yet."}
          </p>
        </Field>

        <Field label="Date & time">
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="input"
          />
        </Field>

        <Field label="Cover photo">
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {PHOTO_SUGGESTIONS.map((p) => (
              <button
                key={p}
                onClick={() => setPhotoUrl(p)}
                className={`h-16 w-24 shrink-0 overflow-hidden rounded-xl ring-2 ${
                  photoUrl === p ? "ring-brand-400" : "ring-transparent"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
          <input
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
            placeholder="…or paste an image URL"
            className="input mt-2 text-xs"
          />
        </Field>

        <Field label="Visibility">
          <div className="flex gap-2">
            <Toggle
              active={isPublic}
              onClick={() => setIsPublic(true)}
              title="Public"
              subtitle="Anyone can join instantly"
            />
            <Toggle
              active={!isPublic}
              onClick={() => setIsPublic(false)}
              title="Private"
              subtitle="You approve each request"
            />
          </div>
        </Field>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          disabled={loading}
          onClick={submit}
          className="btn-primary w-full py-3.5 text-lg"
        >
          {loading ? "Publishing…" : "Publish event"}
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-neutral-300">
        {label}
      </label>
      {children}
    </div>
  );
}

function Toggle({
  active,
  onClick,
  title,
  subtitle,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  subtitle: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 rounded-2xl border p-3 text-left transition active:scale-[0.98] ${
        active
          ? "border-brand-400 bg-brand-500/15"
          : "border-white/10 bg-ink-700"
      }`}
    >
      <div className="text-sm font-semibold">{title}</div>
      <div className="text-xs text-neutral-400">{subtitle}</div>
    </button>
  );
}
