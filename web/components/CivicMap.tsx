"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip, GeoJSON, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { MapPoint } from "@/lib/becktonMapPoints";

const SENTIMENT_COLORS: Record<string, string> = {
  negative: "#C41E1E",
  positive: "#1B7A4A",
  nostalgic: "#6B6B6B",
  neutral: "#B3B3B3",
};

const TYPE_RADIUS: Record<string, number> = {
  issue: 8,
  landmark: 6,
  positive: 7,
  memory: 6,
  service: 5,
};

function Boundaries() {
  const map = useMap();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [ward, setWard] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [constituency, setConstituency] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [borough, setBorough] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [lsoas, setLsoas] = useState<any>(null);

  useEffect(() => {
    Promise.all([
      fetch("/boundaries/beckton-ward.geojson").then(r => r.json()).catch(() => null),
      fetch("/boundaries/west-ham-and-beckton-constituency.geojson").then(r => r.json()).catch(() => null),
      fetch("/boundaries/newham-borough.geojson").then(r => r.json()).catch(() => null),
      fetch("/boundaries/beckton-lsoas.geojson").then(r => r.json()).catch(() => null),
    ]).then(([w, c, b, l]) => {
      setWard(w);
      setConstituency(c);
      setBorough(b);
      setLsoas(l);
      if (w) map.fitBounds(L.geoJSON(w).getBounds(), { padding: [20, 20] });
    });
  }, [map]);

  return (
    <>
      {/* Outermost: Borough of Newham */}
      {borough && <GeoJSON data={borough} style={{ color: "#B3B3B3", weight: 1, fillOpacity: 0, dashArray: "8,6" }} />}
      {/* Constituency */}
      {constituency && <GeoJSON data={constituency} style={{ color: "#6B6B6B", weight: 1, fillOpacity: 0, dashArray: "4,4" }} />}
      {/* LSOAs within the ward */}
      {lsoas && <GeoJSON data={lsoas} style={{ color: "#E0E0E0", weight: 0.5, fillOpacity: 0 }} />}
      {/* Innermost: Beckton ward — the primary boundary */}
      {ward && <GeoJSON data={ward} style={{ color: "#C41E1E", weight: 2.5, fillOpacity: 0.03, fillColor: "#C41E1E" }} />}
    </>
  );
}

interface CivicMapProps {
  points: MapPoint[];
  filter?: string;
}

export function CivicMap({ points, filter }: CivicMapProps) {
  const [selectedPoint, setSelectedPoint] = useState<MapPoint | null>(null);

  const filtered = filter && filter !== "all"
    ? points.filter(p => p.sentiment === filter || p.type === filter)
    : points;

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

      {filtered.map((point) => (
        <CircleMarker
          key={point.id}
          center={[point.lat, point.lng]}
          radius={TYPE_RADIUS[point.type] || 6}
          pathOptions={{
            color: SENTIMENT_COLORS[point.sentiment] || "#6B6B6B",
            fillColor: SENTIMENT_COLORS[point.sentiment] || "#6B6B6B",
            fillOpacity: 0.6,
            weight: 1.5,
          }}
        >
          <Tooltip sticky direction="top" offset={[0, -10]}>
            <div style={{ maxWidth: 280, fontFamily: "-apple-system, sans-serif", padding: 2 }}>
              <p style={{ fontSize: 12, fontWeight: 500, marginBottom: 3, color: "#1A1A1A" }}>{point.name}</p>
              <p style={{ fontSize: 11, fontStyle: "italic", color: "#404040", marginBottom: 3, lineHeight: 1.4 }}>
                &ldquo;{point.quote.length > 100 ? point.quote.slice(0, 100) + "..." : point.quote}&rdquo;
              </p>
              <p style={{ fontSize: 10, color: "#6B6B6B" }}>{point.speaker}{point.issue ? ` · ${point.issue}` : ""}</p>
            </div>
          </Tooltip>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
