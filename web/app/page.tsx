"use client";

import { useRouter } from "next/navigation";
import { FrankHeader } from "@/components/FrankHeader";
import { BECKTON_ANALYSIS, BECKTON_PROPOSALS } from "@/lib/becktonData";
import { useState } from "react";

export default function HomePage() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function go() {
    const q = query.trim();
    if (!q) return;
    router.push(`/briefing/${encodeURIComponent(q.toLowerCase().replace(/\s+/g, "-"))}`);
  }

  const topIssue = BECKTON_ANALYSIS.issues[0];
  const topProposal = BECKTON_PROPOSALS[BECKTON_PROPOSALS.length - 1]; // cheapest one

  return (
    <div style={{ minHeight: "100vh", background: "#FFFFFF" }}>
      <FrankHeader />

      <main style={{ maxWidth: 720, margin: "0 auto", padding: "32px 20px" }}>

        {/* Hero */}
        <section style={{ textAlign: "center", marginBottom: 48 }}>
          <h1 style={{ fontSize: 36, fontWeight: 600, marginBottom: 8, letterSpacing: "-0.02em" }}>
            <span style={{ color: "#C41E1E" }}>&ldquo;</span>frank
          </h1>
          <p style={{ fontSize: 18, color: "#1A1A1A", marginBottom: 8 }}>
            Civic intelligence powered by real conversations.
          </p>
          <p style={{ fontSize: 14, color: "#6B6B6B", marginBottom: 24 }}>
            Free. Open source. Works in 190+ countries.
          </p>

          {/* Embedded search */}
          <div style={{ maxWidth: 480, margin: "0 auto", display: "flex", gap: 8 }}>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && go()}
              placeholder="Type any area to try it"
              style={{ flex: 1, padding: "12px 16px", fontSize: 16, border: "1px solid #E0E0E0", borderRadius: 0, outline: "none" }}
            />
            <button onClick={go} disabled={!query.trim()}
              style={{ padding: "12px 24px", fontSize: 14, fontWeight: 500, background: query.trim() ? "#1A1A1A" : "#E0E0E0", color: "#FFF", border: "none", cursor: query.trim() ? "pointer" : "default", borderRadius: 0 }}>
              Research
            </button>
          </div>
        </section>

        {/* The one-liner */}
        <section style={{ borderTop: "1px solid #E0E0E0", borderBottom: "1px solid #E0E0E0", padding: "24px 0", marginBottom: 48, textAlign: "center" }}>
          <p style={{ fontSize: 15, color: "#404040", lineHeight: 1.7, maxWidth: 560, margin: "0 auto", fontStyle: "italic" }}>
            Frank doesn't ask people to participate more. It goes to where they already are and makes what they're already saying visible to the people with power to act.
          </p>
        </section>

        {/* How it works — visual pipeline */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 16, fontWeight: 500, marginBottom: 20, textAlign: "center" }}>How it works</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {[
              { icon: "1", title: "Research", desc: "Type any area. Frank pulls real representatives, demographics, deprivation data, air quality — from 16 official sources. Every number cited.", color: "#1A1A1A" },
              { icon: "2", title: "Prepare", desc: "AI generates an interview guide. A chat helps you refine your approach. Ask about burdens, not opinions.", color: "#404040" },
              { icon: "3", title: "Listen", desc: "Record conversations on your phone. On-device transcription. GPS randomised for privacy. Consent per-conversation.", color: "#404040" },
              { icon: "4", title: "Understand", desc: "AI ranks issues by severity, frequency, cost, complexity. Identifies root causes. Every finding traces to anonymised quotes.", color: "#404040" },
              { icon: "5", title: "Act", desc: "Policy proposals with costs, drawbacks, evidence of what worked elsewhere, who to contact. Published publicly.", color: "#C41E1E" },
            ].map((s, i) => (
              <div key={i} style={{ display: "flex", gap: 16, paddingBottom: 20, paddingLeft: 20, borderLeft: i < 4 ? "2px solid #E0E0E0" : "2px solid #C41E1E" }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: s.color, color: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, flexShrink: 0, marginLeft: -15, marginTop: -2 }}>
                  {s.icon}
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 2 }}>{s.title}</p>
                  <p style={{ fontSize: 13, color: "#6B6B6B", lineHeight: 1.5 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Beckton case study — real data */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 16, fontWeight: 500, marginBottom: 4 }}>Real example: Beckton, London</h2>
          <p style={{ fontSize: 13, color: "#6B6B6B", marginBottom: 16 }}>Built from actual field interviews. Not synthetic data.</p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            {/* Issue card */}
            <div style={{ border: "1px solid #E0E0E0", padding: 16 }}>
              <p className="font-mono" style={{ fontSize: 11, color: "#C41E1E", marginBottom: 4 }}>Top issue</p>
              <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 8 }}>{topIssue.title}</p>
              <p style={{ fontSize: 12, fontStyle: "italic", color: "#6B6B6B" }}>
                &ldquo;{topIssue.quotes[0]?.text.slice(0, 80)}...&rdquo;
              </p>
              <p className="font-mono" style={{ fontSize: 11, color: "#B3B3B3", marginTop: 8 }}>
                severity {topIssue.score.severity}/5 · {topIssue.score.frequency} mentions
              </p>
            </div>

            {/* Data card */}
            <div style={{ border: "1px solid #E0E0E0", padding: 16 }}>
              <p className="font-mono" style={{ fontSize: 11, color: "#C41E1E", marginBottom: 4 }}>Live data</p>
              <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 8 }}>IMD Decile 1/10</p>
              <p style={{ fontSize: 12, color: "#6B6B6B" }}>Most deprived 10% in England</p>
              <p style={{ fontSize: 12, color: "#6B6B6B", marginTop: 4 }}>MP: James Asser (Labour)</p>
              <p className="font-mono" style={{ fontSize: 11, color: "#B3B3B3", marginTop: 8 }}>
                src: Parliament UK, GOV.UK
              </p>
            </div>

            {/* Policy card */}
            <div style={{ border: "1px solid #E0E0E0", padding: 16 }}>
              <p className="font-mono" style={{ fontSize: 11, color: "#C41E1E", marginBottom: 4 }}>Policy proposal</p>
              <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 8 }}>{topProposal.title.slice(0, 40)}...</p>
              <p className="font-mono" style={{ fontSize: 12, color: "#6B6B6B" }}>
                {topProposal.estimatedCost.range}
              </p>
              <p style={{ fontSize: 12, color: "#6B6B6B", marginTop: 4 }}>
                Feasibility: {topProposal.feasibility}
              </p>
              <p className="font-mono" style={{ fontSize: 11, color: "#B3B3B3", marginTop: 8 }}>
                {topProposal.sources?.[0]}
              </p>
            </div>
          </div>

          <div style={{ marginTop: 12, textAlign: "center" }}>
            <button onClick={() => router.push("/beckton")} style={{ fontSize: 13, color: "#C41E1E", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 3 }}>
              Explore full Beckton demo →
            </button>
          </div>
        </section>

        {/* Stats */}
        <section style={{ borderTop: "1px solid #E0E0E0", padding: "32px 0", marginBottom: 48 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, textAlign: "center" }}>
            {[
              { n: "190+", l: "countries" },
              { n: "663K", l: "politicians indexed" },
              { n: "16", l: "official data sources" },
              { n: "0", l: "cost to use" },
            ].map((s) => (
              <div key={s.l}>
                <p className="font-mono" style={{ fontSize: 28, fontWeight: 700, color: "#1A1A1A" }}>{s.n}</p>
                <p style={{ fontSize: 12, color: "#6B6B6B" }}>{s.l}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Data sources */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 16, fontWeight: 500, marginBottom: 4 }}>Data sources</h2>
          <p style={{ fontSize: 13, color: "#6B6B6B", marginBottom: 16 }}>Every value cited. Every source linked. If something is wrong, verify it immediately.</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 32px" }}>
            {[
              { name: "UK Parliament API", region: "UK" },
              { name: "ONS Census 2021", region: "UK" },
              { name: "Index of Multiple Deprivation", region: "UK" },
              { name: "LG Inform (6,600+ metrics)", region: "UK" },
              { name: "US Census Bureau ACS", region: "US" },
              { name: "Google Civic Information", region: "US" },
              { name: "Canada Represent API", region: "CA" },
              { name: "Wikidata (663K+ politicians)", region: "Global" },
              { name: "World Bank Open Data", region: "Global" },
              { name: "Eurostat", region: "EU" },
              { name: "Google Places API", region: "Global" },
              { name: "Google Air Quality API", region: "Global" },
              { name: "Google Street View", region: "Global" },
              { name: "Nominatim / OpenStreetMap", region: "Global" },
              { name: "Postcodes.io", region: "UK" },
              { name: "Brave Search API", region: "Global" },
            ].map((s) => (
              <div key={s.name} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid #F0F0F0" }}>
                <span style={{ fontSize: 13, color: "#404040" }}>{s.name}</span>
                <span className="font-mono" style={{ fontSize: 11, color: "#B3B3B3" }}>{s.region}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Open source */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 16, fontWeight: 500, marginBottom: 8 }}>Open source</h2>
          <p style={{ fontSize: 14, color: "#404040", lineHeight: 1.7, marginBottom: 8 }}>
            AGPL v3. Every prompt auditable. Every data source cited. If a council acts on this, they see exactly how it was produced.
          </p>
          <a href="https://github.com/Camaraarthur/frank" target="_blank" rel="noopener"
            style={{ fontSize: 14, color: "#C41E1E", textDecoration: "underline", textUnderlineOffset: 3 }}>
            github.com/Camaraarthur/frank
          </a>
        </section>

        {/* Team */}
        <section style={{ borderTop: "1px solid #E0E0E0", paddingTop: 32, marginBottom: 48 }}>
          <h2 style={{ fontSize: 16, fontWeight: 500, marginBottom: 20 }}>Team</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
            <div>
              <div style={{ width: 120, height: 120, borderRadius: "50%", background: "#F0F0F0", overflow: "hidden", marginBottom: 12 }}>
                <img src="/arthur2.jpg" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              </div>
              <p style={{ fontSize: 16, fontWeight: 500, marginBottom: 4 }}>Arthur Camara</p>
              <p className="font-mono" style={{ fontSize: 12, color: "#C41E1E", marginBottom: 8 }}>Technical lead</p>
              <p style={{ fontSize: 13, color: "#6B6B6B", lineHeight: 1.6 }}>
                Graduate of the Bartlett School of Architecture at UCL. Published researcher in agent-based conversation analysis (AHFE 2024). Co-founder of Insights, an AI platform for processing conversation data. Currently AI Lead at Carlo Ratti Associati. Built the entire Frank platform.
              </p>
            </div>
            <div>
              <div style={{ width: 120, height: 120, borderRadius: "50%", background: "#F0F0F0", overflow: "hidden", marginBottom: 12 }}>
                <img src="/mikhail2.jpg" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              </div>
              <p style={{ fontSize: 16, fontWeight: 500, marginBottom: 4 }}>Mikhail Kobelyan</p>
              <p className="font-mono" style={{ fontSize: 12, color: "#C41E1E", marginBottom: 8 }}>Policy lead</p>
              <p style={{ fontSize: 13, color: "#6B6B6B", lineHeight: 1.6 }}>
                BA (Hons) in Politics and International Relations from UCL, specialising in European security. Contributed to the United Nations Office of Counter-Terrorism's capacity-building programmes. Leads Frank's policy methodology, stakeholder engagement, and research framework.
              </p>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section style={{ borderTop: "1px solid #E0E0E0", paddingTop: 32, textAlign: "center", marginBottom: 32 }}>
          <p style={{ fontSize: 14, color: "#6B6B6B", marginBottom: 16 }}>Research any area in the world</p>
          <div style={{ maxWidth: 480, margin: "0 auto", display: "flex", gap: 8 }}>
            <input
              placeholder="Your area or postcode"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const v = (e.target as HTMLInputElement).value.trim();
                  if (v) router.push(`/briefing/${encodeURIComponent(v.toLowerCase().replace(/\s+/g, "-"))}`);
                }
              }}
              style={{ flex: 1, padding: "12px 16px", fontSize: 16, border: "1px solid #E0E0E0", borderRadius: 0, outline: "none" }}
            />
            <button onClick={() => {}}
              style={{ padding: "12px 24px", fontSize: 14, fontWeight: 500, background: "#1A1A1A", color: "#FFF", border: "none", cursor: "pointer", borderRadius: 0 }}>
              Try it
            </button>
          </div>
          <p style={{ fontSize: 12, color: "#B3B3B3", marginTop: 8 }}>arthur@arthurcamara.com</p>
        </section>
      </main>

      <footer style={{ borderTop: "1px solid #E0E0E0", padding: "12px 20px", fontSize: 12, color: "#B3B3B3" }}>
        frank · open source · AGPL v3
      </footer>
    </div>
  );
}
