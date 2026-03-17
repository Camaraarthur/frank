"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CivicDataPanel } from "@/components/CivicDataPanel";
import { FrankHeader } from "@/components/FrankHeader";
import { researchArea } from "@/lib/api";
import type { AreaBriefing } from "@/lib/api";

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
}

export default function BriefingPage() {
  const params = useParams();
  const router = useRouter();
  const areaSlug = params.area as string;
  const areaName = decodeURIComponent(areaSlug).replace(/-/g, " ");

  const [geo, setGeo] = useState<GeoResult | null>(null);
  const [briefing, setBriefing] = useState<AreaBriefing | null>(null);
  const [steps, setSteps] = useState<LoadingStep[]>([
    { id: "geocode", label: "Resolving location", status: "pending" },
    { id: "civic", label: "Loading representatives and deprivation data", status: "pending" },
    { id: "research", label: "Researching area issues and governance", status: "pending" },
  ]);
  const [error, setError] = useState<string | null>(null);

  function updateStep(id: string, update: Partial<LoadingStep>) {
    setSteps((prev) => prev.map((s) => s.id === id ? { ...s, ...update } : s));
  }

  useEffect(() => {
    // Check cache first
    const cached = sessionStorage.getItem(`briefing:${areaSlug}`);
    if (cached) {
      setBriefing(JSON.parse(cached));
      setSteps((prev) => prev.map((s) => ({ ...s, status: "done" as const })));
      return;
    }

    async function load() {
      // Step 1: Geocode — try Google first (better at informal names), fall back to Nominatim
      updateStep("geocode", { status: "loading", detail: `Searching for "${areaName}"...` });
      try {
        // Try Google Geocoding first (handles "sf north" → "North Beach, San Francisco" better)
        let result: { lat: number; lng: number; display_name?: string; address?: Record<string, string>; types?: string[]; formattedAddress?: string } | null = null;

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
              types: gr.types,
              address: {},
            };
            // Parse formatted address into components
            const parts = (gr.formattedAddress || "").split(",").map((s: string) => s.trim());
            if (parts.length >= 2) {
              result.address = { suburb: parts[0], city: parts[1], city_district: parts[1] };
            }
          }
        } catch { /* fall back to Nominatim */ }

        // Fall back to Nominatim if Google didn't work
        if (!result) {
          const geoRes = await fetch(`/api/gis/geocode/search?q=${encodeURIComponent(areaName)}`);
          const geoData = await geoRes.json();
          result = geoData.results?.[0] || null;
        }

        if (result) {
          // Try to get postcode from reverse geocode
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

          const geoResult: GeoResult = {
            postcode,
            ward: ward || result.address?.suburb || result.display_name?.split(",")[0] || areaName,
            constituency,
            adminDistrict: adminDistrict || result.address?.city_district || result.address?.city || "",
            lat: result.lat,
            lng: result.lng,
          };
          setGeo(geoResult);

          // Build canonical name and redirect if different from what user typed
          const canonicalName = geoResult.adminDistrict
            ? `${geoResult.ward}, ${geoResult.adminDistrict}`
            : geoResult.ward;
          const canonicalSlug = encodeURIComponent(canonicalName.toLowerCase().replace(/\s+/g, "-"));

          if (canonicalSlug !== areaSlug && canonicalName.toLowerCase() !== areaName.toLowerCase()) {
            // Redirect to the canonical URL
            router.replace(`/briefing/${canonicalSlug}`);
            return;
          }

          updateStep("geocode", {
            status: "done",
            detail: `${geoResult.ward}${geoResult.adminDistrict ? `, ${geoResult.adminDistrict}` : ""}${postcode ? ` (${postcode})` : ""}`,
          });

          // Step 2: Civic data (loads in CivicDataPanel component)
          if (postcode) {
            updateStep("civic", { status: "done", detail: `Found ${postcode} — loading representatives, demographics, deprivation data` });
          } else {
            updateStep("civic", { status: "done", detail: `Using worldwide data sources (Wikidata, World Bank, Google APIs)` });
          }
        } else {
          updateStep("geocode", { status: "done", detail: `Found: ${areaName}` });
          updateStep("civic", { status: "done", detail: "Location resolved — searching for data" });
        }
      } catch (err) {
        updateStep("geocode", { status: "error", detail: `Could not resolve "${areaName}"` });
      }

      // Step 3: Deep research (Brave + Gemini)
      updateStep("research", { status: "loading", detail: "Running web research and AI synthesis..." });
      try {
        const b = await researchArea(areaName, "researcher");
        sessionStorage.setItem(`briefing:${areaSlug}`, JSON.stringify(b));
        setBriefing(b);
        updateStep("research", { status: "done", detail: `${b.contestedIssues?.length || 0} issues found, ${b.governingBodies?.length || 0} governing bodies identified` });
      } catch (err) {
        updateStep("research", { status: "error", detail: "Research failed — try again or try a more specific area" });
        setError(err instanceof Error ? err.message : "Research failed");
      }
    }

    load();
  }, [areaSlug, areaName]);

  const allDone = steps.every((s) => s.status === "done" || s.status === "error");

  return (
    <div style={{ minHeight: "100vh", background: "#FFFFFF" }}>

      <FrankHeader area={areaName} />

      <main style={{ maxWidth: 640, margin: "0 auto", padding: "24px 20px" }}>

        <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 4, textTransform: "capitalize" }}>{areaName}</h1>

        {/* Loading steps — always visible until complete */}
        <div style={{ marginBottom: 32, borderLeft: "1px solid #E0E0E0", paddingLeft: 16 }}>
          {steps.map((step) => (
            <div key={step.id} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 14, width: 14, textAlign: "center" }}>
                  {step.status === "loading" ? "◌" : step.status === "done" ? "✓" : step.status === "error" ? "✗" : "·"}
                </span>
                <span style={{ fontSize: 14, fontWeight: step.status === "loading" ? 500 : 400, color: step.status === "error" ? "#C41E1E" : step.status === "loading" ? "#1A1A1A" : "#6B6B6B" }}>
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

        {/* Civic data — loads immediately if we have a postcode */}
        {geo && (
          <section style={{ marginBottom: 32 }}>
            <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 8 }}>Official data</p>
            <CivicDataPanel postcode={geo.postcode || undefined} lat={geo.lat} lng={geo.lng} />
          </section>
        )}

        {/* Briefing content — loads after deep research */}
        {briefing && (
          <>
            {/* Summary */}
            <section style={{ marginBottom: 32 }}>
              <p style={{ fontSize: 14, color: "#404040", lineHeight: 1.6 }}>{briefing.summary}</p>
            </section>

            {/* Governing bodies */}
            {briefing.governingBodies.length > 0 && (
              <section style={{ marginBottom: 32 }}>
                <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 8 }}>Governing bodies</p>
                <div style={{ borderTop: "1px solid #E0E0E0" }}>
                  {briefing.governingBodies.map((gov, i) => (
                    <div key={i} style={{ padding: "8px 0", borderBottom: "1px solid #E0E0E0" }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontSize: 14, fontWeight: 500 }}>{gov.name}</span>
                        <span className="font-mono" style={{ fontSize: 11, color: "#6B6B6B" }}>{gov.level}</span>
                      </div>
                      <p style={{ fontSize: 13, color: "#6B6B6B" }}>{gov.representative}{gov.party ? ` (${gov.party})` : ""}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Contested issues */}
            {briefing.contestedIssues.length > 0 && (
              <section style={{ marginBottom: 32 }}>
                <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 8 }}>Known issues</p>
                {briefing.contestedIssues.map((issue, i) => (
                  <div key={i} style={{ borderLeft: `2px solid ${issue.severity === "high" ? "#C41E1E" : "#E0E0E0"}`, paddingLeft: 16, marginBottom: 8, paddingTop: 8, paddingBottom: 8 }}>
                    <p style={{ fontSize: 14, fontWeight: 500 }}>{issue.title}</p>
                    <p style={{ fontSize: 13, color: "#404040", marginTop: 4 }}>{issue.description}</p>
                    {issue.sources.length > 0 && (
                      <p className="font-mono" style={{ fontSize: 11, color: "#B3B3B3", marginTop: 4 }}>
                        {issue.sources.join(" · ")}
                      </p>
                    )}
                  </div>
                ))}
              </section>
            )}

            {/* Interview themes + CTA */}
            {briefing.interviewThemes.length > 0 && (
              <section style={{ marginBottom: 32 }}>
                <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 8 }}>Suggested interview angles</p>
                <ul style={{ paddingLeft: 20, margin: 0 }}>
                  {briefing.interviewThemes.map((theme, i) => (
                    <li key={i} style={{ fontSize: 13, color: "#404040", marginBottom: 4 }}>{theme}</li>
                  ))}
                </ul>
              </section>
            )}

            {/* No interviews yet notice */}
            <section style={{ borderTop: "1px solid #E0E0E0", paddingTop: 24, textAlign: "center" }}>
              <p style={{ fontSize: 13, color: "#6B6B6B", marginBottom: 12 }}>
                No interviews recorded for this area yet.
              </p>
              <button
                onClick={() => router.push(`/record?area=${encodeURIComponent(areaName)}`)}
                style={{ fontSize: 14, fontWeight: 500, background: "#1A1A1A", color: "#FFFFFF", border: "none", padding: "12px 32px", cursor: "pointer", borderRadius: 0 }}
              >
                Be the first to record
              </button>
            </section>
          </>
        )}

        {error && !briefing && (
          <div style={{ textAlign: "center", padding: "32px 0" }}>
            <p style={{ fontSize: 14, color: "#C41E1E", marginBottom: 12 }}>{error}</p>
            <button onClick={() => router.push("/")}
              style={{ fontSize: 13, color: "#6B6B6B", background: "none", border: "1px solid #E0E0E0", padding: "8px 20px", cursor: "pointer", borderRadius: 0 }}>
              ← try another area
            </button>
          </div>
        )}
      </main>

      <footer style={{ borderTop: "1px solid #E0E0E0", padding: "12px 20px", display: "flex", justifyContent: "space-between", fontSize: 12, color: "#B3B3B3" }}>
        <span>frank · open source · AGPL v3</span>
        <button onClick={() => router.push("/")} style={{ color: "#6B6B6B", background: "none", border: "none", cursor: "pointer", fontSize: 12 }}>← research another area</button>
      </footer>
    </div>
  );
}
