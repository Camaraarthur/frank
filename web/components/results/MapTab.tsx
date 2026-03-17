"use client";

import { useEffect, useState } from "react";
import type { Session, AnalysisResult } from "@/lib/api";

interface MapTabProps {
  sessions: Session[];
  voices: AnalysisResult["voices"];
  issues: AnalysisResult["issues"];
  area: string;
}

// Dynamic import of leaflet to avoid SSR issues
export function MapTab({ sessions, voices, issues, area }: MapTabProps) {
  const [MapComponent, setMapComponent] = useState<React.ComponentType<MapTabProps> | null>(null);

  useEffect(() => {
    // Dynamically load the leaflet-dependent component client-side only
    import("./MapTabInner").then((mod) => {
      setMapComponent(() => mod.MapTabInner);
    });
  }, []);

  if (!MapComponent) {
    return (
      <div className="flex items-center justify-center" style={{ height: 480 }}>
        <p style={{ color: "#8A7E72" }}>Loading map...</p>
      </div>
    );
  }

  return <MapComponent sessions={sessions} voices={voices} issues={issues} area={area} />;
}
