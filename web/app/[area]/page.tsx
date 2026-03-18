"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { FrankHeader } from "@/components/FrankHeader";
import { CivicDataPanel } from "@/components/CivicDataPanel";
import { researchArea, listSessions } from "@/lib/api";
import dynamic from "next/dynamic";
import type { AreaBriefing, Session, AnalysisIssue, PolicyProposal } from "@/lib/api";

const BriefingMap = dynamic(() => import("@/components/BriefingMap").then(m => m.BriefingMap), { ssr: false });

// ── Types ──

type Tab = "overview" | "issues" | "data" | "proposals";

interface LoadingStep {
  id: string;
  label: string;
  status: "pending" | "loading" | "done" | "error";
  detail?: string;
}

interface GeoResult {
  postcode: string;
  ward: string;
  constituency: string;
  adminDistrict: string;
  lat: number;
  lng: number;
  displayName: string;
}

interface Comment {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

// ── Helpers ──

function titleCase(s: string): string {
  return s.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

function slugToName(slug: string): string {
  return decodeURIComponent(slug).replace(/-/g, " ");
}

// ── Page ──

export default function AreaPage() {
  const params = useParams();
  const router = useRouter();
  const areaSlug = params.area as string;
  const areaName = slugToName(areaSlug);

  const [tab, setTab] = useState<Tab>("overview");
  const [geo, setGeo] = useState<GeoResult | null>(null);
  const [briefing, setBriefing] = useState<AreaBriefing | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [analysisIssues, setAnalysisIssues] = useState<AnalysisIssue[]>([]);
  const [proposals, setProposals] = useState<PolicyProposal[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [expandedIssue, setExpandedIssue] = useState<string | null>(null);
  const [expandedPolicy, setExpandedPolicy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [steps, setSteps] = useState<LoadingStep[]>([
    { id: "geocode", label: "Resolving location", status: "pending" },
    { id: "civic", label: "Loading civic data", status: "pending" },
    { id: "research", label: "Researching governance and issues", status: "pending" },
    { id: "interviews", label: "Checking for interview data", status: "pending" },
  ]);

  const updateStep = useCallback((id: string, update: Partial<LoadingStep>) => {
    setSteps(prev => prev.map(s => s.id === id ? { ...s, ...update } : s));
  }, []);

  const allDone = steps.every(s => s.status === "done" || s.status === "error");
  const hasInterviews = sessions.length > 0;

  // ── Load everything ──

  useEffect(() => {
    let cancelled = false;

    async function load() {
      // -- Step 1: Geocode --
      updateStep("geocode", { status: "loading", detail: `Searching for "${areaName}"...` });

      let geoResult: GeoResult | null = null;

      try {
        // Try Google geocoding first
        let result: { lat: number; lng: number; display_name?: string; address?: Record<string, string>; formattedAddress?: string } | null = null;

        try {
          const googleRes = await fetch(`/api/google/geocode?q=${encodeURIComponent(areaName)}`);
          const googleData = await googleRes.json();
          const gr = googleData.results?.[0];
          if (gr) {
            result = {
              lat: gr.lat,
              lng: gr.lng,
              display_name: gr.formattedAddress,
              formattedAddress: gr.formattedAddress,
              address: {},
            };
            const parts = (gr.formattedAddress || "").split(",").map((s: string) => s.trim());
            if (parts.length >= 2) {
              result.address = { suburb: parts[0], city: parts[1], city_district: parts[1] };
            }
          }
        } catch { /* fall back to Nominatim */ }

        // Fall back to Nominatim
        if (!result) {
          const geoRes = await fetch(`/api/gis/geocode/search?q=${encodeURIComponent(areaName)}`);
          const geoData = await geoRes.json();
          result = geoData.results?.[0] || null;
        }

        if (result) {
          // Reverse geocode for postcode
          const reverseRes = await fetch(`/api/gis/geocode/reverse?lat=${result.lat}&lng=${result.lng}`);
          const reverseData = await reverseRes.json();
          const postcode = reverseData.address?.postcode || "";

          let ward = "", constituency = "", adminDistrict = "";

          if (postcode) {
            try {
              const pcRes = await fetch(`/api/area-data?postcode=${encodeURIComponent(postcode)}`);
              const pcData = await pcRes.json();
              ward = pcData.geography?.ward?.value || "";
              constituency = pcData.geography?.constituency?.value || "";
              adminDistrict = pcData.geography?.adminDistrict?.value || "";
            } catch { /* continue */ }
          }

          geoResult = {
            postcode,
            ward: ward || result.address?.suburb || result.display_name?.split(",")[0] || areaName,
            constituency,
            adminDistrict: adminDistrict || result.address?.city_district || result.address?.city || "",
            lat: result.lat,
            lng: result.lng,
            displayName: result.formattedAddress || result.display_name || areaName,
          };

          if (!cancelled) {
            setGeo(geoResult);
            updateStep("geocode", {
              status: "done",
              detail: `${geoResult.ward}${geoResult.adminDistrict ? `, ${geoResult.adminDistrict}` : ""}${postcode ? ` (${postcode})` : ""}`,
            });

            // Civic data resolves via the CivicDataPanel component
            if (postcode) {
              updateStep("civic", { status: "done", detail: `Found ${postcode} — loading representatives, demographics, deprivation` });
            } else {
              updateStep("civic", { status: "done", detail: "Using worldwide data sources (Wikidata, World Bank, Google APIs)" });
            }
          }
        } else {
          if (!cancelled) {
            updateStep("geocode", { status: "done", detail: `Resolved: ${areaName}` });
            updateStep("civic", { status: "done", detail: "Location resolved — searching for data" });
          }
        }
      } catch {
        if (!cancelled) {
          updateStep("geocode", { status: "error", detail: `Could not resolve "${areaName}"` });
          updateStep("civic", { status: "error", detail: "Skipped — location not found" });
        }
      }

      // -- Step 2: Check for existing interview sessions --
      if (!cancelled) {
        updateStep("interviews", { status: "loading", detail: "Searching for recorded interviews..." });
      }
      try {
        const sessData = await listSessions(areaName);
        if (!cancelled) {
          setSessions(sessData.sessions || []);
          if (sessData.sessions.length > 0) {
            updateStep("interviews", { status: "done", detail: `${sessData.sessions.length} interview${sessData.sessions.length !== 1 ? "s" : ""} found` });
          } else {
            updateStep("interviews", { status: "done", detail: "No interviews recorded yet" });
          }
        }
      } catch {
        if (!cancelled) {
          updateStep("interviews", { status: "done", detail: "No interviews found" });
        }
      }

      // -- Step 3: Fetch comments --
      try {
        const commRes = await fetch(`/api/comments/${encodeURIComponent(areaSlug)}`);
        if (commRes.ok) {
          const commData = await commRes.json();
          if (!cancelled) setComments(commData.comments || []);
        }
      } catch { /* no comments endpoint or no comments */ }

      // -- Step 4: Deep research --
      if (!cancelled) {
        updateStep("research", { status: "loading", detail: "Running web research and AI synthesis..." });
      }
      try {
        // Check sessionStorage cache
        const cached = typeof window !== "undefined" ? sessionStorage.getItem(`briefing:${areaSlug}`) : null;
        if (cached) {
          const b = JSON.parse(cached) as AreaBriefing;
          if (!cancelled) {
            setBriefing(b);
            updateStep("research", { status: "done", detail: `${b.contestedIssues?.length || 0} issues, ${b.governingBodies?.length || 0} governing bodies (cached)` });
          }
        } else {
          const b = await researchArea(areaName, "researcher");
          if (typeof window !== "undefined") {
            sessionStorage.setItem(`briefing:${areaSlug}`, JSON.stringify(b));
          }
          if (!cancelled) {
            setBriefing(b);
            updateStep("research", { status: "done", detail: `${b.contestedIssues?.length || 0} issues found, ${b.governingBodies?.length || 0} governing bodies identified` });
          }
        }
      } catch (err) {
        if (!cancelled) {
          updateStep("research", { status: "error", detail: "Research failed — try again or try a more specific area" });
          setError(err instanceof Error ? err.message : "Research failed");
        }
      }
    }

    load();
    return () => { cancelled = true; };
  }, [areaSlug, areaName, updateStep]);

  // ── Derived display values ──

  const displayName = geo?.ward
    ? `${titleCase(geo.ward)}${geo.adminDistrict ? `, ${geo.adminDistrict}` : ""}`
    : titleCase(areaName);

  const subtitle = [
    geo?.adminDistrict,
    geo?.postcode,
    geo?.ward ? `Ward: ${geo.ward}` : null,
    geo?.constituency ? `Constituency: ${geo.constituency}` : null,
  ].filter(Boolean).join(" · ");

  // Issues: prefer analyzed interview issues, fall back to AI-researched
  const displayIssues: Array<{
    id: string;
    title: string;
    description: string;
    severity: number | string;
    frequency?: number;
    quotes?: Array<{ text: string; speakerDescription?: string }>;
    sources?: string[];
    isFromInterviews: boolean;
    score?: AnalysisIssue["score"];
  }> = analysisIssues.length > 0
    ? analysisIssues.map(issue => ({
        id: issue.id,
        title: issue.title,
        description: issue.description,
        severity: issue.score.severity,
        frequency: issue.score.frequency,
        quotes: issue.quotes,
        sources: [],
        isFromInterviews: true,
        score: issue.score,
      }))
    : (briefing?.contestedIssues || []).map((issue, i) => ({
        id: `ai-${i}`,
        title: issue.title,
        description: issue.description,
        severity: issue.severity === "high" ? 4 : issue.severity === "medium" ? 3 : 2,
        sources: issue.sources,
        isFromInterviews: false,
      }));

  // ── Styles ──

  const tabStyle = (t: Tab): React.CSSProperties => ({
    padding: "10px 16px",
    fontSize: 13,
    fontWeight: tab === t ? 500 : 400,
    color: tab === t ? "#1A1A1A" : "#6B6B6B",
    background: "none",
    border: "none",
    borderBottom: tab === t ? "2px solid #C41E1E" : "2px solid transparent",
    cursor: "pointer",
    marginBottom: -1,
  });

  // ── Render ──

  return (
    <div style={{ minHeight: "100vh", background: "#FFFFFF" }}>
      <FrankHeader area={titleCase(areaName)} />

      {/* Tabs */}
      <nav style={{ borderBottom: "1px solid #E0E0E0", position: "sticky", top: 49, background: "#FFFFFF", zIndex: 40 }}>
        <div style={{ maxWidth: 640, margin: "0 auto", display: "flex", padding: "0 20px" }}>
          {(["overview", "issues", "data", "proposals"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)} style={tabStyle(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </nav>

      {/* Loading indicator — shown until all steps complete */}
      {!allDone && (
        <div style={{ maxWidth: 640, margin: "0 auto", padding: "24px 20px 0" }}>
          <div style={{ borderLeft: "1px solid #E0E0E0", paddingLeft: 16, marginBottom: 24 }}>
            {steps.map(step => (
              <div key={step.id} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 14, width: 14, textAlign: "center" }}>
                    {step.status === "loading" ? "\u25CC" : step.status === "done" ? "\u2713" : step.status === "error" ? "\u2717" : "\u00B7"}
                  </span>
                  <span style={{
                    fontSize: 14,
                    fontWeight: step.status === "loading" ? 500 : 400,
                    color: step.status === "error" ? "#C41E1E" : step.status === "loading" ? "#1A1A1A" : "#6B6B6B",
                  }}>
                    {step.label}
                  </span>
                </div>
                {step.detail && (
                  <p className="font-mono" style={{ fontSize: 12, color: step.status === "error" ? "#C41E1E" : "#B3B3B3", marginLeft: 22, marginTop: 2 }}>
                    {step.detail}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      <main style={{ maxWidth: 640, margin: "0 auto", padding: "24px 20px" }}>

        {/* ── OVERVIEW TAB ── */}
        {tab === "overview" && (
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 4 }}>{displayName}</h1>
            {subtitle && (
              <p className="font-mono" style={{ fontSize: 12, color: "#6B6B6B", marginBottom: 16 }}>
                {subtitle}
              </p>
            )}

            {/* Summary */}
            {briefing?.summary && (
              <p style={{ fontSize: 14, color: "#404040", lineHeight: 1.6, marginBottom: 24 }}>
                {briefing.summary}
              </p>
            )}

            {/* Map */}
            {geo && (
              <div style={{ height: 360, border: "1px solid #E0E0E0", marginBottom: 24 }}>
                <BriefingMap lat={geo.lat} lng={geo.lng} areaName={areaName} />
              </div>
            )}

            {/* ── Interview data section ── */}
            {hasInterviews && (
              <div style={{ borderTop: "2px solid #C41E1E", paddingTop: 16, marginBottom: 32 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
                  <p style={{ fontSize: 14, fontWeight: 500 }}>From interviews</p>
                  <span className="font-mono" style={{ fontSize: 11, color: "#6B6B6B" }}>
                    {sessions.length} conversation{sessions.length !== 1 ? "s" : ""} · field research
                  </span>
                </div>
                <p style={{ fontSize: 12, color: "#6B6B6B", marginBottom: 12 }}>
                  Issues and quotes from recorded conversations with residents. Anonymised, GPS-randomised, consent given.
                </p>
              </div>
            )}

            {/* Top issues preview */}
            {displayIssues.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 8 }}>
                  {hasInterviews ? "Top issues raised" : "Known issues"}
                </p>
                {displayIssues.slice(0, 3).map(issue => (
                  <div key={issue.id} style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
                    {issue.frequency != null && (
                      <span className="font-mono" style={{ fontSize: 12, color: "#C41E1E" }}>{issue.frequency}\u00D7</span>
                    )}
                    <span style={{ fontSize: 14 }}>{issue.title}</span>
                    {!issue.isFromInterviews && (
                      <span className="font-mono" style={{ fontSize: 10, color: "#B3B3B3" }}>
                        {typeof issue.severity === "string" ? issue.severity : ""}
                      </span>
                    )}
                  </div>
                ))}
                <button onClick={() => setTab("issues")} style={{
                  fontSize: 13, color: "#C41E1E", background: "none", border: "none", cursor: "pointer",
                  padding: 0, marginTop: 8, textDecoration: "underline", textUnderlineOffset: 3,
                }}>
                  See all {displayIssues.length} issues →
                </button>
              </div>
            )}

            {/* Lead quote from interviews */}
            {displayIssues[0]?.quotes?.[0] && (
              <blockquote style={{ borderLeft: "2px solid #C41E1E", paddingLeft: 16, margin: "0 0 24px 0" }}>
                <p style={{ fontSize: 14, fontStyle: "italic", color: "#404040", marginBottom: 4 }}>
                  &ldquo;{displayIssues[0].quotes[0].text}&rdquo;
                </p>
                {displayIssues[0].quotes[0].speakerDescription && (
                  <cite className="font-mono" style={{ fontSize: 11, color: "#6B6B6B", fontStyle: "normal" }}>
                    {displayIssues[0].quotes[0].speakerDescription}
                  </cite>
                )}
              </blockquote>
            )}

            {/* ── Open data section ── */}
            {briefing && (
              <div style={{ borderTop: "2px solid #1A1A1A", paddingTop: 16, marginBottom: 32 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
                  <p style={{ fontSize: 14, fontWeight: 500 }}>Open data</p>
                  <span className="font-mono" style={{ fontSize: 11, color: "#6B6B6B" }}>official sources · APIs · public records</span>
                </div>
                <p style={{ fontSize: 12, color: "#6B6B6B", marginBottom: 12 }}>
                  Data from official government APIs and public datasets. Every value links to its source.
                </p>
              </div>
            )}

            {/* Governing bodies */}
            {briefing && briefing.governingBodies.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 8 }}>Who governs</p>
                <div style={{ borderTop: "1px solid #E0E0E0" }}>
                  {briefing.governingBodies.map((gov, i) => {
                    const termDates = (gov as Record<string, unknown>).termDates as string | undefined;
                    const officialUrl = (gov as Record<string, unknown>).officialUrl as string | undefined;

                    let timeInOffice = "";
                    if (termDates) {
                      const startMatch = termDates.match(/(\d{4})/);
                      if (startMatch) {
                        const startYear = parseInt(startMatch[1]);
                        const years = new Date().getFullYear() - startYear;
                        const months = new Date().getMonth();
                        if (years > 0) timeInOffice = `${years}y ${months}m in office`;
                        else timeInOffice = `${months}m in office`;
                      }
                    }

                    return (
                      <div key={i} style={{ padding: "8px 0", borderBottom: "1px solid #E0E0E0" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                          <span style={{ fontSize: 14, fontWeight: 500 }}>
                            {officialUrl ? (
                              <a href={officialUrl} target="_blank" rel="noopener" style={{ color: "#1A1A1A", textDecoration: "underline", textUnderlineOffset: 2 }}>
                                {gov.name}
                              </a>
                            ) : gov.name}
                          </span>
                          <span className="font-mono" style={{ fontSize: 11, color: "#6B6B6B" }}>{gov.level}</span>
                        </div>
                        <p style={{ fontSize: 13, color: "#404040" }}>
                          {gov.representative}{gov.party ? ` (${gov.party})` : ""}
                        </p>
                        {(termDates || timeInOffice) && (
                          <p className="font-mono" style={{ fontSize: 11, color: "#B3B3B3" }}>
                            {termDates}{timeInOffice ? ` · ${timeInOffice}` : ""}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* No interviews CTA */}
            {!hasInterviews && allDone && (
              <div style={{ borderTop: "1px solid #E0E0E0", paddingTop: 24, textAlign: "center", marginTop: 16 }}>
                <p style={{ fontSize: 13, color: "#6B6B6B", marginBottom: 12 }}>
                  No interviews recorded for {titleCase(areaName)} yet.
                </p>
                <button
                  onClick={() => router.push(`/record?area=${encodeURIComponent(areaName)}`)}
                  style={{
                    fontSize: 14, fontWeight: 500, background: "#1A1A1A", color: "#FFFFFF",
                    border: "none", padding: "12px 32px", cursor: "pointer", borderRadius: 0,
                  }}
                >
                  Be the first to record
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── ISSUES TAB ── */}
        {tab === "issues" && (
          <div>
            <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>
              {hasInterviews ? "What people said" : "Known issues"}
            </p>
            <p className="font-mono" style={{ fontSize: 12, color: "#6B6B6B", marginBottom: 16 }}>
              {hasInterviews
                ? `${displayIssues.length} issues · ${sessions.length} conversations`
                : `${displayIssues.length} issues identified from research`
              }
            </p>

            {displayIssues.length === 0 && allDone && (
              <p style={{ fontSize: 14, color: "#6B6B6B" }}>No issues identified yet. Research may still be loading.</p>
            )}

            {displayIssues.map(issue => {
              const expanded = expandedIssue === issue.id;
              const severityNum = typeof issue.severity === "number" ? issue.severity : (issue.severity === "high" ? 4 : issue.severity === "medium" ? 3 : 2);
              return (
                <div key={issue.id} style={{
                  borderLeft: `2px solid ${severityNum >= 4 ? "#C41E1E" : "#E0E0E0"}`,
                  paddingLeft: 16, marginBottom: 8, paddingTop: 12, paddingBottom: 12,
                }}>
                  <button onClick={() => setExpandedIssue(expanded ? null : issue.id)} style={{
                    background: "none", border: "none", cursor: "pointer", width: "100%", textAlign: "left", padding: 0,
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <span style={{ fontSize: 15, fontWeight: 500 }}>{issue.title}</span>
                      {issue.frequency != null && (
                        <span className="font-mono" style={{ fontSize: 12, color: "#6B6B6B", flexShrink: 0, marginLeft: 12 }}>
                          {issue.frequency}\u00D7
                        </span>
                      )}
                    </div>
                    {!expanded && issue.quotes?.[0] && (
                      <p style={{ fontSize: 13, fontStyle: "italic", color: "#6B6B6B", marginTop: 4 }}>
                        &ldquo;{issue.quotes[0].text.slice(0, 120)}...&rdquo;
                      </p>
                    )}
                    {!expanded && !issue.quotes?.[0] && issue.description && (
                      <p style={{ fontSize: 13, color: "#6B6B6B", marginTop: 4 }}>
                        {issue.description.slice(0, 140)}...
                      </p>
                    )}
                  </button>

                  {expanded && (
                    <div style={{ marginTop: 12 }}>
                      <p style={{ fontSize: 14, color: "#404040", lineHeight: 1.6, marginBottom: 12 }}>{issue.description}</p>

                      {issue.score?.isSystemic && issue.score.systemicNote && (
                        <p style={{ fontSize: 13, color: "#C41E1E", marginBottom: 12 }}>Root cause: {issue.score.systemicNote}</p>
                      )}

                      {/* Quotes from interviews */}
                      {issue.quotes?.map((q, i) => (
                        <div key={i} style={{ marginBottom: 8 }}>
                          <p style={{ fontSize: 13, fontStyle: "italic" }}>&ldquo;{q.text}&rdquo;</p>
                          {q.speakerDescription && (
                            <p className="font-mono" style={{ fontSize: 11, color: "#6B6B6B" }}>{q.speakerDescription}</p>
                          )}
                        </div>
                      ))}

                      {/* Sources from AI research */}
                      {issue.sources && issue.sources.length > 0 && (
                        <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: "4px 8px" }}>
                          {issue.sources.map((src, si) => {
                            const isUrl = src.startsWith("http");
                            return isUrl ? (
                              <a key={si} href={src} target="_blank" rel="noopener"
                                style={{ fontSize: 11, color: "#C41E1E", textDecoration: "underline", textUnderlineOffset: 2 }}>
                                {new URL(src).hostname.replace("www.", "")}
                              </a>
                            ) : (
                              <a key={si} href={`https://www.google.com/search?q=${encodeURIComponent(src)}`} target="_blank" rel="noopener"
                                style={{ fontSize: 11, color: "#C41E1E", textDecoration: "underline", textUnderlineOffset: 2 }}>
                                {src}
                              </a>
                            );
                          })}
                        </div>
                      )}

                      {issue.score && (
                        <p className="font-mono" style={{ fontSize: 12, color: "#6B6B6B", marginTop: 8 }}>
                          severity {issue.score.severity}/5 · cost {issue.score.costToFix}/5 · complexity {issue.score.complexity}/5
                        </p>
                      )}

                      {issue.isFromInterviews && (
                        <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                          <button style={{ fontSize: 12, color: "#6B6B6B", background: "none", border: "1px solid #E0E0E0", padding: "4px 12px", cursor: "pointer", borderRadius: 0 }}>
                            +1 this affects me
                          </button>
                          <button style={{ fontSize: 12, color: "#6B6B6B", background: "none", border: "1px solid #E0E0E0", padding: "4px 12px", cursor: "pointer", borderRadius: 0 }}>
                            add voice
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {!hasInterviews && allDone && displayIssues.length > 0 && (
              <div style={{ borderTop: "1px solid #E0E0E0", paddingTop: 16, marginTop: 16, textAlign: "center" }}>
                <p style={{ fontSize: 13, color: "#6B6B6B", marginBottom: 8 }}>
                  These issues were identified from news and public data.
                  Record interviews to add real voices.
                </p>
                <button
                  onClick={() => router.push(`/record?area=${encodeURIComponent(areaName)}`)}
                  style={{ fontSize: 13, color: "#C41E1E", background: "none", border: "1px solid #E0E0E0", padding: "8px 20px", cursor: "pointer", borderRadius: 0 }}
                >
                  Record an interview
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── DATA TAB ── */}
        {tab === "data" && (
          <div>
            <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>Official data</p>
            <p className="font-mono" style={{ fontSize: 12, color: "#6B6B6B", marginBottom: 16 }}>
              Live from official sources — every value cited
            </p>
            {geo ? (
              <CivicDataPanel postcode={geo.postcode || undefined} lat={geo.lat} lng={geo.lng} />
            ) : (
              <p style={{ fontSize: 13, color: "#6B6B6B" }}>Resolving location...</p>
            )}
          </div>
        )}

        {/* ── PROPOSALS TAB ── */}
        {tab === "proposals" && (
          <div>
            <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>Policy proposals</p>
            <p className="font-mono" style={{ fontSize: 12, color: "#6B6B6B", marginBottom: 16 }}>
              What could be done, by whom, at what cost
            </p>

            {proposals.length > 0 ? (
              proposals.map(p => {
                const expanded = expandedPolicy === p.id;
                return (
                  <div key={p.id} style={{ border: "1px solid #E0E0E0", padding: 16, marginBottom: 8 }}>
                    <button onClick={() => setExpandedPolicy(expanded ? null : p.id)} style={{
                      background: "none", border: "none", cursor: "pointer", width: "100%", textAlign: "left", padding: 0,
                    }}>
                      <p style={{ fontSize: 15, fontWeight: 500, marginBottom: 4 }}>{p.title}</p>
                      <p className="font-mono" style={{ fontSize: 12, color: "#6B6B6B" }}>
                        {p.estimatedCost.range} · {p.timeToImplement.range} · {p.feasibility} feasibility
                      </p>
                      <p style={{ fontSize: 13, color: "#404040", marginTop: 8 }}>{p.summary}</p>
                    </button>
                    {expanded && (
                      <div style={{ marginTop: 16, borderTop: "1px solid #E0E0E0", paddingTop: 16 }}>
                        <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>What the council can do</p>
                        <p style={{ fontSize: 13, color: "#404040", marginBottom: 16 }}>{p.councilAction}</p>

                        {p.pathToImplementation?.length > 0 && (
                          <div style={{ marginBottom: 16 }}>
                            <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>Steps</p>
                            <ol style={{ paddingLeft: 20, margin: 0 }}>
                              {p.pathToImplementation.map((step, i) => (
                                <li key={i} style={{ fontSize: 13, color: "#404040", marginBottom: 4 }}>{step}</li>
                              ))}
                            </ol>
                          </div>
                        )}

                        {p.drawbacks?.length > 0 && (
                          <div style={{ marginBottom: 16 }}>
                            <p style={{ fontSize: 13, fontWeight: 500, color: "#C41E1E", marginBottom: 4 }}>Drawbacks</p>
                            {p.drawbacks.map((d, i) => (
                              <div key={i} style={{ marginBottom: 8 }}>
                                <p style={{ fontSize: 13, fontWeight: 500, color: "#404040" }}>{d.title}</p>
                                <p style={{ fontSize: 13, color: "#6B6B6B" }}>{d.description}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>Who to contact</p>
                        <p style={{ fontSize: 13, color: "#404040", marginBottom: 16 }}>{p.contactPath}</p>

                        <p className="font-mono" style={{ fontSize: 11, color: "#6B6B6B", marginBottom: 8 }}>
                          Cost basis: {p.estimatedCost.basis}
                        </p>

                        {p.sources?.length > 0 && (
                          <div style={{ marginTop: 8 }}>
                            <p className="font-mono" style={{ fontSize: 11, color: "#6B6B6B", marginBottom: 4 }}>Sources:</p>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 8px" }}>
                              {p.sources.map((src, si) => (
                                <a key={si} href={`https://www.google.com/search?q=${encodeURIComponent(src)}`} target="_blank" rel="noopener"
                                  style={{ fontSize: 11, color: "#C41E1E", textDecoration: "underline", textUnderlineOffset: 2 }}>
                                  {src}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div style={{ textAlign: "center", padding: "32px 0" }}>
                {hasInterviews ? (
                  <>
                    <p style={{ fontSize: 14, color: "#6B6B6B", marginBottom: 12 }}>
                      Proposals are generated from interview analysis.
                    </p>
                    <p style={{ fontSize: 13, color: "#B3B3B3" }}>
                      Once enough interviews are analyzed, evidence-based policy proposals will appear here.
                    </p>
                  </>
                ) : (
                  <>
                    <p style={{ fontSize: 14, color: "#6B6B6B", marginBottom: 12 }}>
                      Record interviews to generate proposals
                    </p>
                    <p style={{ fontSize: 13, color: "#B3B3B3", marginBottom: 16 }}>
                      Policy proposals are generated from real conversations with residents.
                      They require interview data to ensure proposals reflect actual community needs.
                    </p>
                    <button
                      onClick={() => router.push(`/record?area=${encodeURIComponent(areaName)}`)}
                      style={{
                        fontSize: 14, fontWeight: 500, background: "#1A1A1A", color: "#FFFFFF",
                        border: "none", padding: "12px 32px", cursor: "pointer", borderRadius: 0,
                      }}
                    >
                      Record an interview
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* Error state — only if no briefing loaded at all */}
        {error && !briefing && allDone && (
          <div style={{ textAlign: "center", padding: "32px 0" }}>
            <p style={{ fontSize: 14, color: "#C41E1E", marginBottom: 12 }}>{error}</p>
            <button onClick={() => router.push("/")}
              style={{ fontSize: 13, color: "#6B6B6B", background: "none", border: "1px solid #E0E0E0", padding: "8px 20px", cursor: "pointer", borderRadius: 0 }}>
              ← try another area
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #E0E0E0", padding: "12px 20px", display: "flex", justifyContent: "space-between", fontSize: 12, color: "#B3B3B3" }}>
        <span>frank · open source · AGPL v3</span>
        <button onClick={() => router.push("/")} style={{ color: "#6B6B6B", background: "none", border: "none", cursor: "pointer", fontSize: 12 }}>
          ← research another area
        </button>
      </footer>
    </div>
  );
}
