"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { formatEventDate } from "@/lib/format";

export type MapEvent = {
  id: string;
  title: string;
  description: string;
  locationName: string;
  lat: number;
  lng: number;
  date: string;
  photoUrl: string;
  isPublic: boolean;
  isBoosted: boolean;
  isAccepted?: boolean;
  isOwn?: boolean;
  organizer: { id: string; name: string; photoUrl: string };
};

function pinIcon(type: "accepted" | "open" | "own" | "boosted") {
  const icons: Record<typeof type, string> = {
    accepted: "🟢",  // you're going
    boosted: "⚡",   // boosted open event
    own: "🏠",       // your own event
    open: "📍",      // open public event
  };
  const size = type === "accepted" ? 36 : 28;
  return L.divIcon({
    className: "",
    html: `<div style="font-size:${size}px;line-height:${size}px;filter:drop-shadow(0 2px 4px rgba(0,0,0,.6))">${icons[type]}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size - 4],
  });
}

export default function MapView({ events }: { events: MapEvent[] }) {
  const center: [number, number] =
    events.length > 0 ? [events[0].lat, events[0].lng] : [37.7749, -122.4194];

  function getType(e: MapEvent): "accepted" | "boosted" | "own" | "open" {
    if (e.isOwn) return "own";
    if (e.isAccepted) return "accepted";
    if (e.isBoosted) return "boosted";
    return "open";
  }

  return (
    <MapContainer center={center} zoom={12} scrollWheelZoom className="h-full w-full">
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {events.map((e) => (
        <Marker key={e.id} position={[e.lat, e.lng]} icon={pinIcon(getType(e))}>
          <Popup>
            <div style={{ minWidth: 180, fontFamily: "system-ui, sans-serif" }}>
              {e.photoUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={e.photoUrl}
                  alt=""
                  style={{ width: "100%", height: 90, objectFit: "cover", borderRadius: 8, marginBottom: 8 }}
                />
              )}
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                {e.isAccepted && (
                  <span style={{ background: "#10b981", color: "#fff", borderRadius: 20, padding: "1px 8px", fontSize: 11, fontWeight: 700 }}>
                    ✓ Going
                  </span>
                )}
                {e.isOwn && (
                  <span style={{ background: "#6366f1", color: "#fff", borderRadius: 20, padding: "1px 8px", fontSize: 11, fontWeight: 700 }}>
                    Your event
                  </span>
                )}
                {e.isBoosted && !e.isAccepted && !e.isOwn && (
                  <span style={{ background: "#f59e0b", color: "#000", borderRadius: 20, padding: "1px 8px", fontSize: 11, fontWeight: 700 }}>
                    ⚡ Boost
                  </span>
                )}
              </div>
              <strong style={{ display: "block", fontSize: 14, marginBottom: 2 }}>{e.title}</strong>
              <span style={{ fontSize: 12, color: "#666" }}>{formatEventDate(e.date)}</span>
              {e.locationName && (
                <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>📍 {e.locationName}</div>
              )}
              {e.description && (
                <p style={{ fontSize: 12, color: "#555", marginTop: 4, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                  {e.description}
                </p>
              )}
              <div style={{ fontSize: 11, color: "#888", marginTop: 4 }}>
                Host: {e.organizer.name}
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
