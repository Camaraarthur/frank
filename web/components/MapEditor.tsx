"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Tooltip, GeoJSON, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;

interface Pin {
  id: string;
  lat: number;
  lng: number;
  label: string;
  voices: number;
  issue: string;
}

interface MapEditorProps {
  pins: Pin[];
  onPinMove: (id: string, lat: number, lng: number) => void;
}

function makePinIcon(issue: string) {
  const colors: Record<string, string> = {
    "Community identity loss": "#C41E1E",
    "Atomisation / pass-through": "#404040",
    "Community through sport": "#1B7A4A",
    "Integration barriers": "#6B6B6B",
    "General dissatisfaction": "#B3B3B3",
    "Property displacement": "#C41E1E",
  };
  const c = colors[issue] || "#C41E1E";
  return new L.DivIcon({
    html: `<div style="width:14px;height:14px;border-radius:50%;background:${c};border:2px solid #1A1A1A;cursor:grab"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
    className: "",
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Boundaries() {
  const map = useMap();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [ward, setWard] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [constituency, setConstituency] = useState<any>(null);

  useEffect(() => {
    Promise.all([
      fetch("/boundaries/beckton-ward.geojson").then(r => r.json()).catch(() => null),
      fetch("/boundaries/west-ham-and-beckton-constituency.geojson").then(r => r.json()).catch(() => null),
    ]).then(([w, c]) => {
      setWard(w);
      setConstituency(c);
      if (w) map.fitBounds(L.geoJSON(w).getBounds(), { padding: [40, 40] });
    });
  }, [map]);

  return (
    <>
      {constituency && <GeoJSON data={constituency} style={{ color: "#B3B3B3", weight: 1, fillOpacity: 0, dashArray: "6,4" }} />}
      {ward && <GeoJSON data={ward} style={{ color: "#C41E1E", weight: 2, fillOpacity: 0.03, fillColor: "#C41E1E" }} />}
    </>
  );
}

function DraggablePin({ pin, onMove }: { pin: Pin; onMove: (lat: number, lng: number) => void }) {
  return (
    <Marker
      position={[pin.lat, pin.lng]}
      icon={makePinIcon(pin.issue)}
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          const latlng = e.target.getLatLng();
          onMove(latlng.lat, latlng.lng);
        },
      }}
    >
      <Tooltip permanent direction="right" offset={[10, 0]} className="">
        <span style={{ fontSize: 11, fontWeight: 500 }}>#{pin.id} {pin.label}</span>
      </Tooltip>
      <Popup>
        <div style={{ fontSize: 13 }}>
          <strong>{pin.label}</strong><br />
          <span style={{ color: "#6B6B6B" }}>{pin.voices} voices · {pin.issue}</span><br />
          <span className="font-mono" style={{ fontSize: 11 }}>{pin.lat.toFixed(4)}, {pin.lng.toFixed(4)}</span>
        </div>
      </Popup>
    </Marker>
  );
}

export function MapEditor({ pins, onPinMove }: MapEditorProps) {
  return (
    <MapContainer
      center={[51.516, 0.060]}
      zoom={15}
      style={{ height: "100%", width: "100%", background: "#F0F0F0" }}
      scrollWheelZoom={true}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; OSM &copy; CARTO'
      />
      <Boundaries />
      {pins.map((pin) => (
        <DraggablePin
          key={pin.id}
          pin={pin}
          onMove={(lat, lng) => onPinMove(pin.id, lat, lng)}
        />
      ))}
    </MapContainer>
  );
}
