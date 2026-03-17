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
  person?: string;
  quote?: string;
  audio?: string;
}

const INITIAL_PINS: Pin[] = [
  {
    id: "ian",
    lat: 51.5148, lng: 0.0632,
    label: "Britvic factory / pub area",
    voices: 1,
    issue: "Community identity loss, property displacement, closed community centres",
    person: "Factory worker, 50s — grew up in Stratford, works at Britvic 10+ years, moved 35km away",
    quote: "The area loses its identity. It's a conveyor belt of changing people.",
    audio: "/recordings/Untill Ian interviews beckton 1.m4a",
  },
  {
    id: "sahib",
    lat: 51.5138, lng: 0.0574,
    label: "West Ham Foundation pitch",
    voices: 1,
    issue: "Community through sport",
    person: "Footballer, 20s — came back for memorial tournament despite moving away",
    quote: "I came only for this event — a memorial for someone who passed away. They raised money for charity.",
  },
  {
    id: "20yr-resident",
    lat: 51.5165, lng: 0.0598,
    label: "Near shopping centre",
    voices: 1,
    issue: "Community identity loss",
    person: "Long-term resident, 60s — lived here 20 years, knows nobody anymore",
    quote: "Too many ethnic minorities. No one he knows lives here anymore.",
  },
  {
    id: "bus-shopper",
    lat: 51.5160, lng: 0.0555,
    label: "Near Aldi / bus stop",
    voices: 1,
    issue: "Atomisation — transactional visits",
    person: "Shopper, 40s — commutes 45 min by bus for specific shops",
    quote: "Home Bargains and the Lithuanian shop. Then I go home.",
  },
  {
    id: "7yr-resident",
    lat: 51.5155, lng: 0.0601,
    label: "Beckton retail park",
    voices: 1,
    issue: "Retail diversity as asset",
    person: "Resident, 7 years — loves the area's diversity of shops",
    quote: "Supermarkets, builder shops, the Asian shop. It's really quite a nice place.",
  },
  {
    id: "pub-regular",
    lat: 51.5145, lng: 0.0640,
    label: "Local pub",
    voices: 1,
    issue: "General dissatisfaction",
    person: "Pub regular, 50s-60s — blunt about decline",
    quote: "Everything is messed up. No strippers, smelling rubbish everywhere.",
    audio: "/recordings/Bring srippers, beckton pub.m4a",
  },
  {
    id: "traffic-passerby",
    lat: 51.5170, lng: 0.0585,
    label: "Near shopping centre entrance",
    voices: 1,
    issue: "Traffic and unsafe driving",
    person: "Passer-by — frustrated, brief exchange",
    quote: "Very congested. The drivers are very undisciplined.",
  },
  {
    id: "new-arrivals",
    lat: 51.5140, lng: 0.0580,
    label: "Near football pitch",
    voices: 3,
    issue: "Integration barriers, limited local knowledge",
    person: "Group of recent arrivals — limited English, only know shopping centre",
    quote: "We know the Beckton shopping centre and that's it. Here is nothing, I think.",
  },
];

export default function MapEditorPage() {
  const [pins, setPins] = useState<Pin[]>(INITIAL_PINS);
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null);
  const [exported, setExported] = useState(false);

  const handlePinMove = useCallback((id: string, lat: number, lng: number) => {
    setPins((prev) => prev.map((p) => p.id === id ? { ...p, lat, lng } : p));
  }, []);

  function exportPins() {
    const code = JSON.stringify(pins.map(p => ({
      id: p.id, lat: +p.lat.toFixed(4), lng: +p.lng.toFixed(4),
      label: p.label, person: p.person, quote: p.quote, issue: p.issue,
    })), null, 2);
    navigator.clipboard.writeText(code);
    setExported(true);
    setTimeout(() => setExported(false), 2000);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#FFFFFF", display: "flex", flexDirection: "column" }}>
      <header style={{ borderBottom: "1px solid #E0E0E0", padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <span style={{ fontWeight: 600 }}>Beckton — Map Editor</span>
          <span style={{ fontSize: 13, color: "#6B6B6B", marginLeft: 12 }}>Drag pins to real interview locations · Click a pin to see details</span>
        </div>
        <button onClick={exportPins} style={{ fontSize: 13, background: exported ? "#C41E1E" : "#1A1A1A", color: "#FFF", border: "none", padding: "8px 20px", cursor: "pointer", borderRadius: 0 }}>
          {exported ? "Copied!" : "Export pin data"}
        </button>
      </header>

      <div style={{ flex: 1, display: "flex" }}>
        {/* Map */}
        <div style={{ flex: 1 }}>
          <MapEditor pins={pins} onPinMove={handlePinMove} />
        </div>

        {/* Sidebar — pin details */}
        <div style={{ width: 320, borderLeft: "1px solid #E0E0E0", overflowY: "auto" }}>
          <div style={{ padding: 16 }}>
            <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 12 }}>{pins.length} interview locations</p>
            {pins.map((p) => (
              <div
                key={p.id}
                onClick={() => setSelectedPin(selectedPin?.id === p.id ? null : p)}
                style={{
                  padding: "8px 0", borderBottom: "1px solid #E0E0E0", cursor: "pointer",
                  background: selectedPin?.id === p.id ? "#F0F0F0" : "transparent",
                  marginLeft: -16, marginRight: -16, paddingLeft: 16, paddingRight: 16,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{p.label}</span>
                  <span className="font-mono" style={{ fontSize: 11, color: "#6B6B6B" }}>{p.lat.toFixed(4)}, {p.lng.toFixed(4)}</span>
                </div>

                {p.person && (
                  <p style={{ fontSize: 12, color: "#404040", marginTop: 2 }}>{p.person}</p>
                )}

                {selectedPin?.id === p.id && (
                  <div style={{ marginTop: 8 }}>
                    {p.quote && (
                      <p style={{ fontSize: 12, fontStyle: "italic", color: "#6B6B6B", marginBottom: 4 }}>
                        &ldquo;{p.quote}&rdquo;
                      </p>
                    )}
                    <p style={{ fontSize: 11, color: "#B3B3B3" }}>Issue: {p.issue}</p>
                    {p.audio && (
                      <audio controls style={{ width: "100%", marginTop: 8, height: 32 }}>
                        <source src={p.audio} type="audio/mp4" />
                      </audio>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
