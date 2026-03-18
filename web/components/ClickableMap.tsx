"use client";

import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const pinIcon = new L.DivIcon({
  html: `<div style="width:14px;height:14px;border-radius:50%;background:#C41E1E;border:2px solid #1A1A1A;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
  className: "",
});

interface ClickableMapProps {
  onLocationSelect: (lat: number, lng: number, name: string) => void;
}

function MapClickHandler({ onSelect }: { onSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export function ClickableMap({ onLocationSelect }: ClickableMapProps) {
  const [pin, setPin] = useState<{ lat: number; lng: number } | null>(null);
  const [resolving, setResolving] = useState(false);
  const [name, setName] = useState("");

  async function handleClick(lat: number, lng: number) {
    setPin({ lat, lng });
    setResolving(true);
    setName("Resolving...");

    try {
      // Reverse geocode to get the place name
      const res = await fetch(`/api/gis/geocode/reverse?lat=${lat}&lng=${lng}`);
      const data = await res.json();
      const addr = data.address || {};
      const placeName = addr.suburb || addr.city_district || addr.town || addr.city || addr.village || addr.county || "Unknown";
      const region = addr.state || addr.country || "";
      const display = region ? `${placeName}, ${region}` : placeName;
      setName(display);
      setResolving(false);
    } catch {
      setName(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
      setResolving(false);
    }
  }

  function research() {
    if (!pin || !name || resolving) return;
    onLocationSelect(pin.lat, pin.lng, name);
  }

  return (
    <div>
      <div style={{ height: 280, border: "1px solid #E0E0E0", position: "relative" }}>
        <MapContainer
          center={[30, 0]}
          zoom={2}
          style={{ height: "100%", width: "100%", background: "#F0F0F0" }}
          scrollWheelZoom={true}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; OSM &copy; CARTO'
          />
          <MapClickHandler onSelect={handleClick} />
          {pin && (
            <Marker position={[pin.lat, pin.lng]} icon={pinIcon}>
              <Popup>
                <div style={{ fontSize: 13 }}>
                  <strong>{resolving ? "Resolving..." : name}</strong>
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>

        {/* Instruction — above the map, not overlaid */}
      </div>

      {/* Selected location bar */}
      {pin && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", marginTop: 4 }}>
          <span style={{ fontSize: 14, color: resolving ? "#6B6B6B" : "#1A1A1A" }}>
            {resolving ? "Resolving location..." : name}
          </span>
          <button
            onClick={research}
            disabled={resolving}
            style={{
              fontSize: 13, fontWeight: 500,
              background: resolving ? "#E0E0E0" : "#1A1A1A", color: "#FFF",
              border: "none", padding: "6px 20px", cursor: resolving ? "default" : "pointer", borderRadius: 0,
            }}
          >
            Research this area →
          </button>
        </div>
      )}
    </div>
  );
}
