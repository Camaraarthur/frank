"use client";

import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { Session, AnalysisResult } from "@/lib/api";

interface MapTabProps {
  sessions: Session[];
  voices: AnalysisResult["voices"];
  issues: AnalysisResult["issues"];
  area: string;
}

export function MapTabInner({ sessions, voices, issues, area }: MapTabProps) {
  // Filter sessions with GPS data
  const geoSessions = sessions.filter((s) => s.gpsLat !== 0 && s.gpsLng !== 0);

  // Default center — use average of sessions, or London
  const center: [number, number] =
    geoSessions.length > 0
      ? [
          geoSessions.reduce((sum, s) => sum + s.gpsLat, 0) / geoSessions.length,
          geoSessions.reduce((sum, s) => sum + s.gpsLng, 0) / geoSessions.length,
        ]
      : [51.5074, -0.1278];

  return (
    <div style={{ height: 480, position: "relative" }}>
      <MapContainer
        center={center}
        zoom={geoSessions.length > 0 ? 14 : 12}
        style={{ height: "100%", width: "100%", borderRadius: "2px" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {geoSessions.map((session) => {
          const voice = voices.find((v) => v.sessionId === session.id);
          const mainIssue = voice ? issues.find((i) => i.id === voice.mainIssue) : null;
          const severity = mainIssue?.severity ?? 2;
          const opacity = 0.3 + (severity / 5) * 0.6;

          return (
            <CircleMarker
              key={session.id}
              center={[session.gpsLat, session.gpsLng]}
              radius={10 + severity * 2}
              pathOptions={{
                color: "#D42B1E",
                fillColor: "#D42B1E",
                fillOpacity: opacity,
                weight: 1.5,
              }}
            >
              <Popup>
                <div style={{ minWidth: 160 }}>
                  {voice && (
                    <p style={{ fontWeight: 600, marginBottom: 6, fontSize: 13 }}>
                      {voice.positioningOneLiner}
                    </p>
                  )}
                  {mainIssue && (
                    <p style={{ color: "#D42B1E", fontSize: 12, marginBottom: 4 }}>
                      {mainIssue.title}
                    </p>
                  )}
                  {voice?.keyQuote && (
                    <p style={{ fontSize: 12, fontStyle: "italic", color: "#5C4D3C" }}>
                      "{voice.keyQuote.slice(0, 100)}..."
                    </p>
                  )}
                  {!voice && (
                    <p style={{ fontSize: 12, color: "#8A7E72" }}>
                      Session recorded — no analysis yet
                    </p>
                  )}
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>

      {geoSessions.length === 0 && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ backgroundColor: "#FAF9F688", zIndex: 1000 }}
        >
          <div
            className="text-center p-6"
            style={{ backgroundColor: "#F0EFEC", border: "1px solid #D4D0CA", borderRadius: "2px" }}
          >
            <p style={{ color: "#5C4D3C" }}>No GPS data yet.</p>
            <p className="text-sm mt-1" style={{ color: "#8A7E72" }}>
              Record interviews with location enabled to see them on the map.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
