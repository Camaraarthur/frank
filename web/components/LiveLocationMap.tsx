"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const youIcon = new L.DivIcon({
  html: `<div style="width:14px;height:14px;border-radius:50%;background:#C41E1E;border:3px solid #FFFFFF;box-shadow:0 1px 4px rgba(0,0,0,0.3)"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
  className: "",
});

function FollowUser({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], 16);
  }, [map, lat, lng]);
  return null;
}

interface LiveLocationMapProps {
  lat: number | null;
  lng: number | null;
  isRecording: boolean;
}

export function LiveLocationMap({ lat, lng, isRecording }: LiveLocationMapProps) {
  if (!lat || !lng) {
    return (
      <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#F0F0F0", color: "#6B6B6B", fontSize: 13 }}>
        Enable GPS to see your location
      </div>
    );
  }

  return (
    <MapContainer
      center={[lat, lng]}
      zoom={16}
      style={{ height: "100%", width: "100%", background: "#F0F0F0" }}
      scrollWheelZoom={true}
      zoomControl={false}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; OSM &copy; CARTO'
      />
      <FollowUser lat={lat} lng={lng} />
      <Marker position={[lat, lng]} icon={youIcon} />
      {/* Accuracy circle */}
      <Circle
        center={[lat, lng]}
        radius={50}
        pathOptions={{
          color: isRecording ? "#C41E1E" : "#6B6B6B",
          fillColor: isRecording ? "#C41E1E" : "#6B6B6B",
          fillOpacity: 0.08,
          weight: 1,
        }}
      />
    </MapContainer>
  );
}
