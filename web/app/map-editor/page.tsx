"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";

const MapEditor = dynamic(() => import("@/components/MapEditor").then((m) => m.MapEditor), { ssr: false });

interface Pin {
  id: string;
  lat: number;
  lng: number;
  label: string;
  voices: number;
  issue: string;
}

const INITIAL_PINS: Pin[] = [
  { id: "1", lat: 51.5189, lng: 0.0642, label: "Near slag heap", voices: 2, issue: "Community identity loss" },
  { id: "2", lat: 51.5155, lng: 0.0601, label: "Retail park", voices: 3, issue: "Atomisation / pass-through" },
  { id: "3", lat: 51.5138, lng: 0.0574, label: "West Ham Foundation", voices: 2, issue: "Community through sport" },
  { id: "4", lat: 51.5165, lng: 0.0555, label: "Near Aldi / bus stop", voices: 1, issue: "Integration barriers" },
  { id: "5", lat: 51.5148, lng: 0.0632, label: "Local pub", voices: 1, issue: "General dissatisfaction" },
  { id: "6", lat: 51.5172, lng: 0.0588, label: "Street near shops", voices: 2, issue: "Property displacement" },
];

export default function MapEditorPage() {
  const [pins, setPins] = useState<Pin[]>(INITIAL_PINS);
  const [exported, setExported] = useState(false);

  const handlePinMove = useCallback((id: string, lat: number, lng: number) => {
    setPins((prev) => prev.map((p) => p.id === id ? { ...p, lat, lng } : p));
  }, []);

  function exportPins() {
    const code = pins.map((p) =>
      `  { lat: ${p.lat.toFixed(4)}, lng: ${p.lng.toFixed(4)}, label: "${p.label}", voices: ${p.voices} },`
    ).join("\n");
    navigator.clipboard.writeText(`const INTERVIEW_PINS = [\n${code}\n];`);
    setExported(true);
    setTimeout(() => setExported(false), 2000);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#FFFFFF" }}>
      <header style={{ borderBottom: "1px solid #E0E0E0", padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <span style={{ fontWeight: 600 }}>Map Editor</span>
          <span style={{ fontSize: 13, color: "#6B6B6B", marginLeft: 12 }}>Drag pins to real interview locations</span>
        </div>
        <button onClick={exportPins} style={{ fontSize: 13, background: exported ? "#C41E1E" : "#1A1A1A", color: "#FFF", border: "none", padding: "8px 20px", cursor: "pointer", borderRadius: 0 }}>
          {exported ? "Copied!" : "Copy pin code"}
        </button>
      </header>

      <div style={{ height: "calc(100vh - 200px)" }}>
        <MapEditor pins={pins} onPinMove={handlePinMove} />
      </div>

      {/* Pin list */}
      <div style={{ padding: "12px 20px", borderTop: "1px solid #E0E0E0", maxHeight: 150, overflowY: "auto" }}>
        {pins.map((p) => (
          <div key={p.id} className="font-mono" style={{ fontSize: 12, color: "#404040", marginBottom: 2 }}>
            #{p.id} {p.label} — {p.lat.toFixed(4)}, {p.lng.toFixed(4)} — {p.issue}
          </div>
        ))}
      </div>
    </div>
  );
}
