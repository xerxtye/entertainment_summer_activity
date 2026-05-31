"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";

const pin = L.divIcon({
  className: "",
  html: `<div style="font-size:30px;line-height:30px;filter:drop-shadow(0 2px 3px rgba(0,0,0,.5))">📍</div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

function ClickCapture({
  onPick,
}: {
  onPick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function LocationPicker({
  value,
  onPick,
}: {
  value: { lat: number; lng: number } | null;
  onPick: (lat: number, lng: number) => void;
}) {
  const center: [number, number] = value
    ? [value.lat, value.lng]
    : [37.7749, -122.4194];

  return (
    <MapContainer center={center} zoom={12} className="h-48 w-full rounded-2xl">
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ClickCapture onPick={onPick} />
      {value && <Marker position={[value.lat, value.lng]} icon={pin} />}
    </MapContainer>
  );
}
