"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface FrankHeaderProps {
  area?: string;
  section?: string;
  showRecord?: boolean;
}

export function FrankHeader({ area, section, showRecord = true }: FrankHeaderProps) {
  const router = useRouter();
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState("");

  function search() {
    const q = query.trim();
    if (!q) return;
    setSearching(false);
    setQuery("");
    router.push(`/briefing/${encodeURIComponent(q.toLowerCase().replace(/\s+/g, "-"))}`);
  }

  return (
    <header style={{ borderBottom: "1px solid #E0E0E0", padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, background: "#FFFFFF", zIndex: 50 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
        <button onClick={() => router.push("/")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, fontWeight: 600, flexShrink: 0 }}>
          <span style={{ color: "#C41E1E" }}>&ldquo;</span>frank
        </button>

        {area && !searching && (
          <>
            <span style={{ color: "#E0E0E0" }}>/</span>
            <span style={{ fontSize: 14, fontWeight: 500, textTransform: "capitalize" }}>{area}</span>
          </>
        )}

        {section && !searching && (
          <>
            <span style={{ color: "#E0E0E0" }}>/</span>
            <span style={{ fontSize: 14 }}>{section}</span>
          </>
        )}

        {/* Search toggle / inline search */}
        {searching ? (
          <div style={{ display: "flex", gap: 4, flex: 1, marginLeft: 4 }}>
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") search();
                if (e.key === "Escape") { setSearching(false); setQuery(""); }
              }}
              placeholder="Search any area..."
              style={{ flex: 1, padding: "4px 8px", fontSize: 14, border: "1px solid #E0E0E0", background: "#FFFFFF", outline: "none", borderRadius: 0, minWidth: 0 }}
            />
            <button onClick={search} style={{ fontSize: 13, background: "#1A1A1A", color: "#FFF", border: "none", padding: "4px 12px", cursor: "pointer", borderRadius: 0 }}>→</button>
            <button onClick={() => { setSearching(false); setQuery(""); }} style={{ fontSize: 13, color: "#6B6B6B", background: "none", border: "none", cursor: "pointer" }}>✕</button>
          </div>
        ) : (
          <button
            onClick={() => setSearching(true)}
            style={{ marginLeft: 8, fontSize: 12, color: "#B3B3B3", background: "none", border: "1px solid #E0E0E0", padding: "4px 10px", cursor: "pointer", borderRadius: 0, display: "flex", alignItems: "center", gap: 4 }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            search
          </button>
        )}
      </div>

      {showRecord && area && !searching && (
        <button
          onClick={() => router.push(`/record?area=${encodeURIComponent(area)}`)}
          style={{ fontSize: 13, color: "#C41E1E", background: "none", border: "1px solid #E0E0E0", padding: "6px 16px", cursor: "pointer", borderRadius: 0, display: "flex", alignItems: "center", gap: 6, flexShrink: 0, marginLeft: 12 }}
        >
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#C41E1E", display: "inline-block" }} />
          Record
        </button>
      )}
    </header>
  );
}
