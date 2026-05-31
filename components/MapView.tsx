"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { FeedEvent } from "@/lib/types";
import { formatEventDate } from "@/lib/format";

// DivIcon avoids the broken default-marker asset paths in bundlers.
function pinIcon(boosted: boolean) {
  return L.divIcon({
    className: "",
    html: `<div style="font-size:30px;line-height:30px;filter:drop-shadow(0 2px 3px rgba(0,0,0,.5))">${
      boosted ? "⚡" : "📍"
    }</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
  });
}

export default function MapView({ events }: { events: FeedEvent[] }) {
  const center: [number, number] = events.length
    ? [events[0].lat, events[0].lng]
    : [37.7749, -122.4194];

  return (
    <MapContainer
      center={center}
      zoom={12}
      scrollWheelZoom
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {events.map((e) => (
        <Marker key={e.id} position={[e.lat, e.lng]} icon={pinIcon(e.isBoosted)}>
          <Popup>
            <div className="min-w-[160px]">
              <strong className="block text-sm">{e.title}</strong>
              <span className="text-xs text-neutral-600">
                {formatEventDate(e.date)}
              </span>
              {e.locationName && (
                <div className="mt-1 text-xs text-neutral-600">
                  📍 {e.locationName}
                </div>
              )}
              <div className="mt-1 text-xs text-neutral-600">
                Host: {e.organizer.name}
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
