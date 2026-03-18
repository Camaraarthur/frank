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

export function CivicDataPanel({ postcode, lat, lng }: { postcode?: string; lat?: number; lng?: number }) {
  const [data, setData] = useState<CivicData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);

    // Try UK postcode first, fall back to worldwide lat/lng
    const tryUK = postcode
      ? fetch(`/api/area-data?postcode=${encodeURIComponent(postcode)}`).then((r) => r.json())
      : Promise.resolve(null);

    tryUK.then((ukData) => {
      // If UK data has real results (not just errors), use it
      if (ukData && ukData.representatives?.length > 0) {
        setData(ukData);
        setLoading(false);
        return;
      }

      // Otherwise try worldwide endpoint if we have coordinates
      if (lat != null && lng != null) {
        fetch(`/api/area-data/worldwide?lat=${lat}&lng=${lng}`)
          .then((r) => r.json())
          .then((wwData) => {
            // Map worldwide format to CivicData format
            const mapped: CivicData = {
              geography: ukData?.geography || {},
              representatives: (wwData.representatives || []).map((r: Record<string, string>) => ({
                name: { value: r.name, source: r.source || "Worldwide", sourceUrl: "" },
                party: { value: r.party, source: "", sourceUrl: "" },
                constituency: { value: r.office || r.constituency || "", source: "", sourceUrl: "" },
                profileUrl: { value: "", source: "", sourceUrl: r.url || r.profileUrl || "" },
              })),
              deprivation: ukData?.deprivation || null,
              census: ukData?.census?.length > 0 ? ukData.census : (wwData.demographics || []).map((d: Record<string, unknown>) => ({
                topic: String(d.label || ""),
                source: String(d.source || "World Bank"),
                sourceUrl: String(d.sourceUrl || "https://data.worldbank.org"),
                total: Number(d.value) || 0,
                breakdown: [],
              })),
              errors: [],
            };
            setData(mapped);
            setLoading(false);
          })
          .catch(() => {
            // If worldwide also fails, show whatever UK returned
            if (ukData) { setData(ukData); }
            setLoading(false);
          });
      } else if (ukData) {
        setData(ukData);
        setLoading(false);
      } else {
        setError("No location data available");
        setLoading(false);
      }
    }).catch((e) => { setError(e.message); setLoading(false); });
  }, [postcode, lat, lng]);

  if (loading) {
    return (
      <div style={{ padding: "8px 0" }}>
        <p style={{ fontSize: 13, color: "#6B6B6B" }}>Searching official data sources...</p>
      </div>
    );
  }
  if (error || !data) return <p style={{ fontSize: 13, color: "#6B6B6B" }}>No civic data available for this location yet.</p>;

  const decile = typeof data.deprivation?.imdDecile?.value === "number"
    ? data.deprivation.imdDecile.value
    : parseInt(String(data.deprivation?.imdDecile?.value || "0"));

  return (
    <div>
      {/* Representatives — only show if we have a reasonable number (API result, not Wikidata dump) */}
      {data.representatives.length > 0 && data.representatives.length <= 30 && (
        <div style={{ marginBottom: 32 }}>
          <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>Representatives</p>
          <div style={{ borderTop: "1px solid #E0E0E0" }}>
            {data.representatives.filter(r => !String(r.name.value).startsWith("Q")).slice(0, 15).map((rep, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "8px 0", borderBottom: "1px solid #E0E0E0" }}>
                <div>
                  <span style={{ fontSize: 14, fontWeight: 500 }}>{String(rep.name.value)}</span>
                  <span style={{ fontSize: 13, color: "#6B6B6B", marginLeft: 8 }}>({String(rep.party.value)})</span>
                  <span style={{ fontSize: 13, color: "#6B6B6B", marginLeft: 8 }}>{String(rep.constituency.value)}</span>
                </div>
                <Src url={String(rep.profileUrl.sourceUrl)} label={String(rep.profileUrl.sourceUrl).includes("parliament.uk") ? "Parliament UK →" : String(rep.profileUrl.sourceUrl).includes("wikidata") ? "Wikidata →" : String(rep.profileUrl.sourceUrl).includes("represent") ? "Represent API →" : "source →"} />
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
          <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 8 }}>
            {data.census.some(t => t.source?.includes("Census") || t.source?.includes("Nomis")) ? "Census 2021" : "Demographics"}
          </p>
          {data.census.map((topic, i) => {
            const isWorldBank = topic.source?.includes("World Bank");
            const isCensus = topic.source?.includes("Census") || topic.source?.includes("Nomis");
            const sourceLabel = isWorldBank ? "World Bank →" : isCensus ? "ONS Census 2021 →" : `${topic.source} →`;

            return (
              <div key={i} style={{ borderTop: "1px solid #E0E0E0", paddingTop: 8, paddingBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{topic.topic}</span>
                  <Src url={topic.sourceUrl} label={sourceLabel} />
                </div>

                {/* World Bank data: show as a single value, not a breakdown */}
                {isWorldBank || topic.breakdown.length === 0 ? (
                  <p className="font-mono" style={{ fontSize: 14, color: "#1A1A1A" }}>
                    {typeof topic.total === "number" && topic.total > 1000000
                      ? `${(topic.total / 1000000).toFixed(1)}M`
                      : typeof topic.total === "number" && topic.total > 1000
                      ? topic.total.toLocaleString()
                      : typeof topic.total === "number"
                      ? topic.total.toFixed(1)
                      : topic.total}
                  </p>
                ) : (
                  <>
                    <p style={{ fontSize: 11, color: "#6B6B6B", marginBottom: 6 }}>
                      {topic.total.toLocaleString()} people surveyed in this ward
                    </p>
                    {topic.breakdown
                      .filter((b) => (b.percentage ?? (b.count / (topic.total || 1) * 100)) >= 3)
                      .sort((a, b) => b.count - a.count)
                      .slice(0, 6)
                      .map((b, j) => {
                        const pct = b.percentage ?? (b.count / (topic.total || 1) * 100);
                        return (
                          <div key={j} style={{ display: "flex", justifyContent: "space-between", padding: "1px 0" }}>
                            <span style={{ fontSize: 13, color: "#404040" }}>{b.category}</span>
                            <span className="font-mono" style={{ fontSize: 12, color: "#1A1A1A" }}>{pct.toFixed(1)}%</span>
                          </div>
                        );
                      })}
                  </>
                )}
              </div>
            );
          })}
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
