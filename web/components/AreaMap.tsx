"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, GeoJSON, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const interviewIcon = new L.DivIcon({
  html: `<div style="width:10px;height:10px;border-radius:50%;background:#C41E1E;border:2px solid #1A1A1A"></div>`,
  iconSize: [10, 10],
  iconAnchor: [5, 5],
  className: "",
});

const INTERVIEW_PINS = [
  { lat: 51.5189, lng: 0.0642, label: "Near slag heap (Beckton Alps)", voices: 2 },
  { lat: 51.5155, lng: 0.0601, label: "Beckton retail park", voices: 3 },
  { lat: 51.5138, lng: 0.0574, label: "West Ham Foundation pitch", voices: 2 },
  { lat: 51.5165, lng: 0.0555, label: "Near Aldi / bus stop", voices: 1 },
  { lat: 51.5148, lng: 0.0632, label: "Local pub", voices: 1 },
  { lat: 51.5172, lng: 0.0588, label: "Street near shops", voices: 2 },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function BoundaryLayers() {
  const map = useMap();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [ward, setWard] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [constituency, setConstituency] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [borough, setBorough] = useState<any>(null);

  useEffect(() => {
    Promise.all([
      fetch("/boundaries/beckton-ward.geojson").then(r => r.json()).catch(() => null),
      fetch("/boundaries/west-ham-and-beckton-constituency.geojson").then(r => r.json()).catch(() => null),
      fetch("/boundaries/newham-borough.geojson").then(r => r.json()).catch(() => null),
    ]).then(([w, c, b]) => {
      setWard(w);
      setConstituency(c);
      setBorough(b);
      if (w) {
        const layer = L.geoJSON(w);
        map.fitBounds(layer.getBounds(), { padding: [20, 20] });
      }
    });
  }, [map]);

  return (
    <>
      {borough && <GeoJSON data={borough} style={{ color: "#B3B3B3", weight: 1, fillOpacity: 0, dashArray: "8,4" }} />}
      {constituency && <GeoJSON data={constituency} style={{ color: "#6B6B6B", weight: 1.5, fillOpacity: 0.02, fillColor: "#6B6B6B", dashArray: "4,4" }} />}
      {ward && <GeoJSON data={ward} style={{ color: "#C41E1E", weight: 2, fillOpacity: 0.04, fillColor: "#C41E1E" }} />}
    </>
  );
}

export function AreaMap() {
  return (
    <MapContainer
      center={[51.516, 0.060]}
      zoom={14}
      style={{ height: "100%", width: "100%", background: "#F0F0F0" }}
      scrollWheelZoom={true}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org">OSM</a> &copy; <a href="https://carto.com">CARTO</a>'
      />
      <BoundaryLayers />
      {INTERVIEW_PINS.map((pin, i) => (
        <Marker key={i} position={[pin.lat, pin.lng]} icon={interviewIcon}>
          <Popup>
            <div style={{ fontSize: 13 }}>
              <strong>{pin.label}</strong><br />
              <span style={{ color: "#6B6B6B" }}>{pin.voices} voice{pin.voices !== 1 ? "s" : ""}</span>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
