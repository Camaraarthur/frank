"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);

  function go() {
    const q = query.trim();
    if (!q) return;
    setSearching(true);
    router.push(`/briefing/${encodeURIComponent(q.toLowerCase().replace(/\s+/g, "-"))}`);
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "40px 20px" }}>
      <div style={{ maxWidth: 480, width: "100%", textAlign: "center" }}>

        <h1 style={{ fontSize: 18, fontWeight: 600, marginBottom: 4, color: "#1A1A1A" }}>
          <span style={{ color: "#C41E1E" }}>&ldquo;</span>frank
        </h1>

        <p style={{ fontSize: 14, color: "#6B6B6B", marginBottom: 32 }}>
          Your community, frank about what it needs.
        </p>

        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && go()}
            placeholder="Enter your area or postcode"
            disabled={searching}
            style={{
              flex: 1, padding: "12px 16px", fontSize: 16,
              border: "1px solid #E0E0E0", borderRadius: 0,
              background: "#FFFFFF", color: "#1A1A1A", outline: "none",
            }}
          />
          <button
            onClick={go}
            disabled={!query.trim() || searching}
            style={{
              padding: "12px 24px", fontSize: 14, fontWeight: 500,
              background: !query.trim() || searching ? "#E0E0E0" : "#1A1A1A",
              color: "#FFFFFF", border: "none", borderRadius: 0,
              cursor: !query.trim() || searching ? "default" : "pointer",
            }}
          >
            {searching ? "..." : "Research"}
          </button>
        </div>

        <div style={{ marginTop: 48 }}>
          <p style={{ fontSize: 12, color: "#B3B3B3", marginBottom: 8 }}>See it in action</p>
          <button
            onClick={() => router.push("/beckton")}
            style={{
              fontSize: 14, color: "#C41E1E", background: "none",
              border: "none", cursor: "pointer", padding: 0,
              textDecoration: "underline", textUnderlineOffset: 3,
            }}
          >
            Beckton, London — real field data
          </button>
        </div>
      </div>

      <footer style={{ position: "fixed", bottom: 16, fontSize: 12, color: "#B3B3B3" }}>
        Open source · AGPL v3
      </footer>
    </div>
  );
}
