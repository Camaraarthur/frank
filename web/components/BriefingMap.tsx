"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const pinIcon = new L.DivIcon({
  html: `<div style="width:10px;height:10px;border-radius:50%;background:#C41E1E;border:2px solid #1A1A1A"></div>`,
  iconSize: [10, 10],
  iconAnchor: [5, 5],
  className: "",
});

interface BriefingMapProps {
  lat: number;
  lng: number;
  areaName: string;
}

function FetchBoundary({ lat, lng, areaName }: BriefingMapProps) {
  const map = useMap();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [boundary, setBoundary] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [subBoundaries, setSubBoundaries] = useState<any[]>([]);

  useEffect(() => {
    // Try to get the admin boundary from Nominatim
    async function fetchBoundary() {
      try {
        // Search for the area to get its OSM ID
        const searchRes = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(areaName)}&format=json&polygon_geojson=1&limit=1`,
          { headers: { "User-Agent": "Frank/1.0 civic-intelligence" } }
        );
        const searchData = await searchRes.json();
        const result = searchData[0];

        if (result?.geojson) {
          const geojson = {
            type: "Feature" as const,
            geometry: result.geojson,
            properties: { name: result.display_name },
          };
          setBoundary(geojson);

          const layer = L.geoJSON(geojson as GeoJSON.Feature);
          map.fitBounds(layer.getBounds(), { padding: [30, 30] });

          // Try to find sub-divisions (admin_level one deeper)
          if (result.osm_id) {
            try {
              const subQuery = `[out:json][timeout:10];
                rel(${result.osm_id});
                rel(r);
                out geom;`;
              const overpassRes = await fetch("https://overpass-api.de/api/interpreter", {
                method: "POST",
                body: `data=${encodeURIComponent(subQuery)}`,
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
              });
              const overpassData = await overpassRes.json();

              // Convert Overpass relations to simple polygons for display
              const subs = (overpassData.elements || [])
                .filter((el: { type: string; tags?: { name?: string } }) => el.type === "relation" && el.tags?.name)
                .slice(0, 30);

              if (subs.length > 0) {
                setSubBoundaries(subs);
              }
            } catch {
              // Overpass query failed — that's OK, we still have the main boundary
            }
          }
        } else {
          // No polygon returned — just center on the point
          map.setView([lat, lng], 12);
        }
      } catch {
        map.setView([lat, lng], 12);
      }
    }

    fetchBoundary();
  }, [map, lat, lng, areaName]);

  return (
    <>
      {boundary && (
        <GeoJSON
          data={boundary}
          style={{ color: "#C41E1E", weight: 2, fillColor: "#C41E1E", fillOpacity: 0.04 }}
        />
      )}
    </>
  );
}

export function BriefingMap({ lat, lng, areaName }: BriefingMapProps) {
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={12}
      style={{ height: "100%", width: "100%", background: "#F0F0F0" }}
      scrollWheelZoom={true}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; OSM &copy; CARTO'
      />
      <FetchBoundary lat={lat} lng={lng} areaName={areaName} />
      <Marker position={[lat, lng]} icon={pinIcon} />
    </MapContainer>
  );
}
