"use client";

import { useEffect, useState } from "react";

interface SourcedValue {
  value: string | number;
  source: string;
  sourceUrl: string;
}

interface Representative {
  name: SourcedValue;
  party: SourcedValue;
  constituency: SourcedValue;
  thumbnailUrl?: SourcedValue;
  profileUrl: SourcedValue;
}

interface CensusBreakdown {
  category: string;
  count: number;
  percentage: number;
}

interface CensusTopic {
  topic: string;
  source: string;
  sourceUrl: string;
  total: number;
  breakdown: CensusBreakdown[];
}

interface DeprivationData {
  imdRank: SourcedValue;
  imdDecile: SourcedValue;
  imdScore: SourcedValue;
  [key: string]: SourcedValue;
}

interface CivicData {
  geography: Record<string, SourcedValue>;
  representatives: Representative[];
  census: CensusTopic[];
  deprivation: DeprivationData;
  errors: string[];
}

function Src({ url, label }: { url: string; label: string }) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="font-mono"
      style={{ fontSize: 11, color: "#6B6B6B", textDecoration: "underline", textUnderlineOffset: 2 }}>
      {label}
    </a>
  );
}

export function CivicDataPanel({ postcode }: { postcode: string }) {
  const [data, setData] = useState<CivicData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/area-data?postcode=${encodeURIComponent(postcode)}`)
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch((e) => { setError(e.message); setLoading(false); });
  }, [postcode]);

  if (loading) return <p style={{ fontSize: 13, color: "#6B6B6B" }}>Loading civic data...</p>;
  if (error || !data) return <p style={{ fontSize: 13, color: "#C41E1E" }}>Failed to load: {error}</p>;

  const decile = typeof data.deprivation?.imdDecile?.value === "number"
    ? data.deprivation.imdDecile.value
    : parseInt(String(data.deprivation?.imdDecile?.value || "0"));

  return (
    <div>
      {/* Representatives */}
      {data.representatives.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 8 }}>Representatives</p>
          <div style={{ borderTop: "1px solid #E0E0E0" }}>
            {data.representatives.map((rep, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "8px 0", borderBottom: "1px solid #E0E0E0" }}>
                <div>
                  <span style={{ fontSize: 14, fontWeight: 500 }}>{String(rep.name.value)}</span>
                  <span style={{ fontSize: 13, color: "#6B6B6B", marginLeft: 8 }}>({String(rep.party.value)})</span>
                  <span style={{ fontSize: 13, color: "#6B6B6B", marginLeft: 8 }}>{String(rep.constituency.value)}</span>
                </div>
                <Src url={String(rep.profileUrl.sourceUrl)} label="src" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Deprivation */}
      {data.deprivation?.imdDecile && (
        <div style={{ marginBottom: 32 }}>
          <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 8 }}>Deprivation index</p>
          <div style={{ borderTop: "1px solid #E0E0E0", paddingTop: 8 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 8 }}>
              <span className="font-mono" style={{ fontSize: 24, fontWeight: 700, color: decile <= 3 ? "#C41E1E" : "#1A1A1A" }}>
                {decile}/10
              </span>
              <span style={{ fontSize: 14, color: "#404040" }}>
                {decile === 1 ? "Most deprived 10% in England" :
                  decile <= 3 ? `Most deprived ${decile}0%` :
                  `Decile ${decile} of 10`}
              </span>
            </div>
            <p className="font-mono" style={{ fontSize: 12, color: "#6B6B6B", marginBottom: 8 }}>
              Rank {String(data.deprivation.imdRank?.value || "N/A")} of 33,755
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px 24px" }}>
              {["incomeRank", "employmentRank", "educationRank", "healthRank", "crimeRank", "housingRank"].map((key) => {
                const val = data.deprivation[key]?.value;
                if (!val) return null;
                const rank = typeof val === "number" ? val : parseInt(String(val));
                const pct = Math.round((rank / 33755) * 100);
                const label = key.replace("Rank", "");
                return (
                  <div key={key} style={{ display: "flex", justifyContent: "space-between", padding: "2px 0" }}>
                    <span style={{ fontSize: 13, color: "#6B6B6B", textTransform: "capitalize" }}>{label}</span>
                    <span className="font-mono" style={{ fontSize: 12, color: pct <= 20 ? "#C41E1E" : "#404040" }}>
                      {pct <= 10 ? "worst 10%" : pct <= 20 ? "worst 20%" : `top ${100 - pct}%`}
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="font-mono" style={{ fontSize: 11, color: "#B3B3B3", marginTop: 8 }}>
              <Src url={String(data.deprivation.imdDecile.sourceUrl)} label="English Indices of Deprivation, GOV.UK" />
            </p>
          </div>
        </div>
      )}

      {/* Census */}
      {data.census.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 8 }}>Census 2021</p>
          {data.census.map((topic, i) => (
            <div key={i} style={{ borderTop: "1px solid #E0E0E0", paddingTop: 8, paddingBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 500 }}>{topic.topic}</span>
                <Src url={topic.sourceUrl} label="src" />
              </div>
              <p className="font-mono" style={{ fontSize: 11, color: "#6B6B6B", marginBottom: 4 }}>
                n={topic.total.toLocaleString()}
              </p>
              {topic.breakdown
                .filter((b) => b.percentage >= 3)
                .sort((a, b) => b.count - a.count)
                .slice(0, 6)
                .map((b, j) => (
                  <div key={j} style={{ display: "flex", justifyContent: "space-between", padding: "1px 0" }}>
                    <span style={{ fontSize: 13, color: "#404040" }}>{b.category}</span>
                    <span className="font-mono" style={{ fontSize: 12, color: "#1A1A1A" }}>{b.percentage.toFixed(1)}%</span>
                  </div>
                ))}
            </div>
          ))}
        </div>
      )}

      {data.errors.length > 0 && (
        <p className="font-mono" style={{ fontSize: 11, color: "#C41E1E" }}>
          Unavailable: {data.errors.join(", ")}
        </p>
      )}
    </div>
  );
}
