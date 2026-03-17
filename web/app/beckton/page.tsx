"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BECKTON_ANALYSIS, BECKTON_PROPOSALS, BECKTON_BRIEFING } from "@/lib/becktonData";
import { CivicDataPanel } from "@/components/CivicDataPanel";
import { FrankHeader } from "@/components/FrankHeader";
import dynamic from "next/dynamic";

const AreaMap = dynamic(() => import("@/components/AreaMap").then((m) => m.AreaMap), { ssr: false });

type Tab = "overview" | "issues" | "data" | "proposals";

export default function BecktonPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("overview");
  const [expandedIssue, setExpandedIssue] = useState<string | null>(null);
  const [expandedPolicy, setExpandedPolicy] = useState<string | null>(null);
  const b = BECKTON_BRIEFING;
  const issues = BECKTON_ANALYSIS.issues;
  const voices = BECKTON_ANALYSIS.voices;
  const proposals = BECKTON_PROPOSALS;

  return (
    <div style={{ minHeight: "100vh", background: "#FFFFFF" }}>

      <FrankHeader area="Beckton" />

      {/* Tabs */}
      <nav style={{ borderBottom: "1px solid #E0E0E0", position: "sticky", top: 49, background: "#FFFFFF", zIndex: 40 }}>
        <div style={{ maxWidth: 640, margin: "0 auto", display: "flex", padding: "0 20px" }}>
          {(["overview", "issues", "data", "proposals"] as Tab[]).map((t) => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: "10px 16px", fontSize: 13, fontWeight: tab === t ? 500 : 400,
              color: tab === t ? "#1A1A1A" : "#6B6B6B",
              background: "none", border: "none", borderBottom: tab === t ? "2px solid #C41E1E" : "2px solid transparent",
              cursor: "pointer", marginBottom: -1,
            }}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </nav>

      {/* Content */}
      <main style={{ maxWidth: 640, margin: "0 auto", padding: "24px 20px" }}>

        {/* ── OVERVIEW ── */}
        {tab === "overview" && (
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 4 }}>Beckton, London</h1>
            <p className="font-mono" style={{ fontSize: 12, color: "#6B6B6B", marginBottom: 16 }}>
              Newham · E6 · Ward: Beckton (E05013904) · Constituency: West Ham and Beckton
            </p>
            <p style={{ fontSize: 14, color: "#404040", lineHeight: 1.6, marginBottom: 24 }}>{b.summary}</p>

            {/* Map with real boundaries */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", gap: 12, marginBottom: 8 }}>
                <span style={{ fontSize: 11, color: "#6B6B6B", display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ width: 12, height: 2, background: "#C41E1E", display: "inline-block" }} /> Ward
                </span>
                <span style={{ fontSize: 11, color: "#6B6B6B", display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ width: 12, height: 2, background: "#6B6B6B", display: "inline-block", borderTop: "1px dashed #6B6B6B" }} /> Constituency
                </span>
                <span style={{ fontSize: 11, color: "#6B6B6B", display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#C41E1E", display: "inline-block" }} /> Interview
                </span>
              </div>
              <div style={{ height: 350, border: "1px solid #E0E0E0" }}>
                <AreaMap />
              </div>
              <p className="font-mono" style={{ fontSize: 11, color: "#B3B3B3", marginTop: 4 }}>
                Boundaries: ONS Open Geography Portal (May 2024). Interview pins randomised ~100m.
              </p>
            </div>

            {/* Top issues */}
            <div style={{ marginBottom: 24 }}>
              <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 8 }}>Top issues from {voices.length} interviews</p>
              {issues.slice(0, 3).map((issue) => (
                <div key={issue.id} style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
                  <span className="font-mono" style={{ fontSize: 12, color: "#C41E1E" }}>{issue.score.frequency}×</span>
                  <span style={{ fontSize: 14 }}>{issue.title}</span>
                </div>
              ))}
              <button onClick={() => setTab("issues")} style={{ fontSize: 13, color: "#C41E1E", background: "none", border: "none", cursor: "pointer", padding: 0, marginTop: 8, textDecoration: "underline", textUnderlineOffset: 3 }}>
                See all {issues.length} issues →
              </button>
            </div>

            {/* Lead quote */}
            {issues[0]?.quotes[0] && (
              <blockquote style={{ borderLeft: "2px solid #C41E1E", paddingLeft: 16, margin: "0 0 24px 0" }}>
                <p style={{ fontSize: 14, fontStyle: "italic", color: "#404040", marginBottom: 4 }}>
                  &ldquo;{issues[0].quotes[0].text}&rdquo;
                </p>
                <cite className="font-mono" style={{ fontSize: 11, color: "#6B6B6B", fontStyle: "normal" }}>
                  {issues[0].quotes[0].speakerDescription}
                </cite>
              </blockquote>
            )}

            {/* Governing bodies */}
            <div style={{ marginBottom: 24 }}>
              <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 8 }}>Who governs</p>
              <div style={{ borderTop: "1px solid #E0E0E0" }}>
                {b.governingBodies.map((gov, i) => {
                  // Calculate time in office from termDates if available
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
          </div>
        )}

        {/* ── ISSUES ── */}
        {tab === "issues" && (
          <div>
            <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>What people said</p>
            <p className="font-mono" style={{ fontSize: 12, color: "#6B6B6B", marginBottom: 16 }}>
              {issues.length} issues · {voices.length} conversations
            </p>

            {issues.map((issue) => {
              const expanded = expandedIssue === issue.id;
              return (
                <div key={issue.id} style={{ borderLeft: `2px solid ${issue.score.severity >= 4 ? "#C41E1E" : "#E0E0E0"}`, paddingLeft: 16, marginBottom: 8, paddingTop: 12, paddingBottom: 12 }}>
                  <button onClick={() => setExpandedIssue(expanded ? null : issue.id)} style={{ background: "none", border: "none", cursor: "pointer", width: "100%", textAlign: "left", padding: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <span style={{ fontSize: 15, fontWeight: 500 }}>{issue.title}</span>
                      <span className="font-mono" style={{ fontSize: 12, color: "#6B6B6B", flexShrink: 0, marginLeft: 12 }}>{issue.score.frequency}×</span>
                    </div>
                    {!expanded && issue.quotes[0] && (
                      <p style={{ fontSize: 13, fontStyle: "italic", color: "#6B6B6B", marginTop: 4 }}>
                        &ldquo;{issue.quotes[0].text.slice(0, 120)}...&rdquo;
                      </p>
                    )}
                  </button>
                  {expanded && (
                    <div style={{ marginTop: 12 }}>
                      <p style={{ fontSize: 14, color: "#404040", lineHeight: 1.6, marginBottom: 12 }}>{issue.description}</p>
                      {issue.score.isSystemic && issue.score.systemicNote && (
                        <p style={{ fontSize: 13, color: "#C41E1E", marginBottom: 12 }}>Root cause: {issue.score.systemicNote}</p>
                      )}
                      {issue.quotes.map((q, i) => (
                        <div key={i} style={{ marginBottom: 8 }}>
                          <p style={{ fontSize: 13, fontStyle: "italic" }}>&ldquo;{q.text}&rdquo;</p>
                          <p className="font-mono" style={{ fontSize: 11, color: "#6B6B6B" }}>{q.speakerDescription}</p>
                        </div>
                      ))}
                      <p className="font-mono" style={{ fontSize: 12, color: "#6B6B6B", marginTop: 8 }}>
                        severity {issue.score.severity}/5 · cost {issue.score.costToFix}/5 · complexity {issue.score.complexity}/5
                      </p>
                      <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                        <button style={{ fontSize: 12, color: "#6B6B6B", background: "none", border: "1px solid #E0E0E0", padding: "4px 12px", cursor: "pointer", borderRadius: 0 }}>+1 this affects me</button>
                        <button style={{ fontSize: 12, color: "#6B6B6B", background: "none", border: "1px solid #E0E0E0", padding: "4px 12px", cursor: "pointer", borderRadius: 0 }}>add voice</button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── DATA ── */}
        {tab === "data" && (
          <div>
            <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>Official data</p>
            <p className="font-mono" style={{ fontSize: 12, color: "#6B6B6B", marginBottom: 16 }}>
              Live from ONS, Parliament UK, GOV.UK — every value cited
            </p>
            <CivicDataPanel postcode="E6 5XT" />
          </div>
        )}

        {/* ── PROPOSALS ── */}
        {tab === "proposals" && (
          <div>
            <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>Policy proposals</p>
            <p className="font-mono" style={{ fontSize: 12, color: "#6B6B6B", marginBottom: 16 }}>
              What could be done, by whom, at what cost
            </p>
            {proposals.map((p) => {
              const expanded = expandedPolicy === p.id;
              return (
                <div key={p.id} style={{ border: "1px solid #E0E0E0", padding: 16, marginBottom: 8 }}>
                  <button onClick={() => setExpandedPolicy(expanded ? null : p.id)} style={{ background: "none", border: "none", cursor: "pointer", width: "100%", textAlign: "left", padding: 0 }}>
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
            })}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #E0E0E0", padding: "12px 20px", display: "flex", justifyContent: "space-between", fontSize: 12, color: "#B3B3B3" }}>
        <span>frank · open source · AGPL v3</span>
        <button onClick={() => router.push("/")} style={{ color: "#6B6B6B", background: "none", border: "none", cursor: "pointer", fontSize: 12 }}>← research another area</button>
      </footer>
    </div>
  );
}
