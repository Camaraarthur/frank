"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { IssuesTab } from "@/components/results/IssuesTab";
import { VoicesTab } from "@/components/results/VoicesTab";
import { VisualizeTab } from "@/components/results/VisualizeTab";
import { MapTab } from "@/components/results/MapTab";
import { PolicyTab } from "@/components/results/PolicyTab";
import { analyzeArea, listSessions, generatePolicy } from "@/lib/api";
import type { AnalysisResult, Session, PolicyProposal, AreaBriefing } from "@/lib/api";
import { isShadwellSlug, SHADWELL_ANALYSIS, SHADWELL_PROPOSALS, SHADWELL_BRIEFING } from "@/lib/dummyData";
import { isBecktonSlug, BECKTON_ANALYSIS, BECKTON_PROPOSALS, BECKTON_BRIEFING } from "@/lib/becktonData";

type Tab = "issues" | "voices" | "visualize" | "map" | "policy";

const TABS: { id: Tab; label: string }[] = [
  { id: "issues", label: "Issues" },
  { id: "voices", label: "Voices" },
  { id: "visualize", label: "Visualize" },
  { id: "map", label: "Map" },
  { id: "policy", label: "Policy" },
];

export default function ResultsPage() {
  const params = useParams();
  const router = useRouter();
  const areaSlug = params.area as string;
  const areaName = decodeURIComponent(areaSlug).replace(/-/g, " ");

  const isShadwell = isShadwellSlug(areaSlug);
  const isBeckton = isBecktonSlug(areaSlug);
  const isDemoMode = isShadwell || isBeckton;
  const demoAnalysis = isBeckton ? BECKTON_ANALYSIS : SHADWELL_ANALYSIS;
  const demoProposals = isBeckton ? BECKTON_PROPOSALS : SHADWELL_PROPOSALS;
  const demoBriefing = isBeckton ? BECKTON_BRIEFING : SHADWELL_BRIEFING;

  const [activeTab, setActiveTab] = useState<Tab>("issues");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(isDemoMode ? demoAnalysis : null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [proposals, setProposals] = useState<PolicyProposal[] | null>(isDemoMode ? demoProposals : null);
  const [isLoading, setIsLoading] = useState(!isDemoMode);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingPolicy, setIsGeneratingPolicy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastAnalyzed, setLastAnalyzed] = useState<number | null>(isDemoMode ? Date.now() : null);

  // Load sessions (skip in demo mode)
  useEffect(() => {
    if (isDemoMode) return;
    listSessions(areaName)
      .then((res) => setSessions(res.sessions))
      .catch(console.error);
  }, [areaName, isDemoMode]);

  // Seed demo briefing into sessionStorage so other parts of the app can read it
  useEffect(() => {
    if (isDemoMode) {
      sessionStorage.setItem(`briefing:${areaSlug}`, JSON.stringify(demoBriefing));
      return;
    }
    const cached = sessionStorage.getItem(`analysis:${areaSlug}`);
    if (cached) {
      const parsed = JSON.parse(cached);
      setAnalysis(parsed.data);
      setLastAnalyzed(parsed.ts);
    }
    setIsLoading(false);
  }, [areaSlug, isDemoMode]);

  async function runAnalysis() {
    setIsAnalyzing(true);
    setError(null);
    try {
      const result = await analyzeArea(areaName);
      setAnalysis(result);
      const payload = { data: result, ts: Date.now() };
      sessionStorage.setItem(`analysis:${areaSlug}`, JSON.stringify(payload));
      setLastAnalyzed(Date.now());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setIsAnalyzing(false);
    }
  }

  async function handleGeneratePolicy() {
    if (!analysis) return;
    setIsGeneratingPolicy(true);
    try {
      const briefingRaw = sessionStorage.getItem(`briefing:${areaSlug}`);
      const briefing: AreaBriefing | undefined = briefingRaw ? JSON.parse(briefingRaw) : undefined;
      const result = await generatePolicy(areaName, analysis.issues, briefing);
      setProposals(result.proposals);
    } catch (err) {
      console.error("Policy generation failed:", err);
    } finally {
      setIsGeneratingPolicy(false);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#FAF9F6" }}>
        <div className="flex gap-1.5">
          <span className="typing-dot w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#D42B1E" }} />
          <span className="typing-dot w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#D42B1E" }} />
          <span className="typing-dot w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#D42B1E" }} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FAF9F6" }}>
      {/* Header */}
      <header
        className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 border-b"
        style={{ backgroundColor: "#FAF9F6", borderColor: "#D4D0CA" }}
      >
        <div className="flex items-center gap-4">
          <button onClick={() => router.push("/")} style={{ color: "#D42B1E", fontWeight: 700, fontSize: 18 }}>
            FRANK
          </button>
          <span style={{ color: "#D4D0CA" }}>/</span>
          <span className="text-sm capitalize" style={{ color: "#2C1D12" }}>{areaName}</span>
          {isDemoMode && (
            <span className="text-[10px] font-medium px-1.5 py-0.5 uppercase tracking-wide"
              style={{ backgroundColor: "#D42B1E18", color: "#D42B1E", borderRadius: "2px", border: "1px solid #D42B1E33" }}>
              Demo
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs" style={{ color: "#8A7E72" }}>
            {sessions.length} session{sessions.length !== 1 ? "s" : ""}
          </span>
          {analysis && (
            <button
              onClick={async () => {
                try {
                  const briefingRaw = sessionStorage.getItem(`briefing:${areaSlug}`);
                  const briefing = briefingRaw ? JSON.parse(briefingRaw) : undefined;
                  const res = await fetch("/api/export/pdf", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ area: areaName, briefing, analysis, proposals }),
                  });
                  if (!res.ok) throw new Error("Export failed");
                  const blob = await res.blob();
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `frank-report-${areaSlug}.html`;
                  a.click();
                  URL.revokeObjectURL(url);
                } catch (err) {
                  console.error("Export error:", err);
                }
              }}
              className="px-3 py-2 text-sm font-medium"
              style={{
                backgroundColor: "transparent",
                color: "#5C4D3C",
                border: "1px solid #D4D0CA",
                borderRadius: "2px",
                cursor: "pointer",
                minHeight: 40,
              }}
            >
              Export Report
            </button>
          )}
          <button
            onClick={() => router.push(`/record?area=${encodeURIComponent(areaName)}`)}
            className="px-3 py-2 text-sm font-medium"
            style={{
              backgroundColor: "#E8E6E222",
              color: "#D42B1E",
              border: "1px solid #D42B1E44",
              borderRadius: "2px",
            }}
          >
            Record
          </button>
          <button
            onClick={runAnalysis}
            disabled={isAnalyzing}
            className="px-3 py-2 text-sm font-medium"
            style={{
              backgroundColor: isAnalyzing ? "#D4D0CA" : "#D42B1E",
              color: isAnalyzing ? "#8A7E72" : "#FAF9F6",
              border: "none",
              borderRadius: "2px",
              cursor: isAnalyzing ? "not-allowed" : "pointer",
              minHeight: 40,
            }}
          >
            {isAnalyzing ? "Analyzing..." : lastAnalyzed ? "Re-analyze" : "Analyze"}
          </button>
        </div>
      </header>

      {/* Error */}
      {error && (
        <div className="px-6 py-3 text-sm" style={{ backgroundColor: "#E62B1E15", color: "#E62B1E" }}>
          {error}
        </div>
      )}

      {/* Tabs */}
      <div
        className="flex items-center gap-0 border-b px-6"
        style={{ borderColor: "#D4D0CA" }}
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="px-4 py-4 text-sm font-medium transition-colors relative"
            style={{
              color: activeTab === tab.id ? "#2C1D12" : "#8A7E72",
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              borderBottom: activeTab === tab.id ? "2px solid #D42B1E" : "2px solid transparent",
              marginBottom: -1,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* No data state */}
      {!analysis && !isAnalyzing && sessions.length === 0 && (
        <div className="px-6 py-12 text-center max-w-md mx-auto">
          <p className="font-semibold text-lg mb-2" style={{ color: "#2C1D12" }}>
            No interviews yet
          </p>
          <p className="text-sm mb-6" style={{ color: "#5C4D3C" }}>
            Record your first interview in the field, then come back here to analyze the results.
          </p>
          <button
            onClick={() => router.push(`/record?area=${encodeURIComponent(areaName)}`)}
            className="px-6 font-medium"
            style={{
              backgroundColor: "#D42B1E",
              color: "#FAF9F6",
              borderRadius: "2px",
              border: "none",
              cursor: "pointer",
              height: 56,
            }}
          >
            Record first interview
          </button>
        </div>
      )}

      {!analysis && !isAnalyzing && sessions.length > 0 && (
        <div className="px-6 py-12 text-center max-w-md mx-auto">
          <p className="font-semibold text-lg mb-2" style={{ color: "#2C1D12" }}>
            {sessions.length} interview{sessions.length !== 1 ? "s" : ""} recorded
          </p>
          <p className="text-sm mb-6" style={{ color: "#5C4D3C" }}>
            Run the analysis to surface issues, themes, and voices from your interviews.
          </p>
          <button
            onClick={runAnalysis}
            className="px-6 font-medium"
            style={{
              backgroundColor: "#D42B1E",
              color: "#FAF9F6",
              borderRadius: "2px",
              border: "none",
              cursor: "pointer",
              height: 56,
              fontSize: 16,
            }}
          >
            Analyze interviews
          </button>
        </div>
      )}

      {isAnalyzing && (
        <div className="px-6 py-12 text-center">
          <div className="flex justify-center gap-1.5 mb-4">
            <span className="typing-dot w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#D42B1E" }} />
            <span className="typing-dot w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#D42B1E" }} />
            <span className="typing-dot w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#D42B1E" }} />
          </div>
          <p style={{ color: "#5C4D3C" }}>
            Analyzing {sessions.length} interview{sessions.length !== 1 ? "s" : ""}...
          </p>
        </div>
      )}

      {analysis && (
        <div className="px-4 md:px-6 max-w-5xl mx-auto">
          {lastAnalyzed && (
            <p className="text-xs pt-3 pb-1" style={{ color: "#8A7E72" }}>
              Last analyzed {new Date(lastAnalyzed).toLocaleTimeString()}
            </p>
          )}

          {activeTab === "issues" && <IssuesTab issues={analysis.issues} />}
          {activeTab === "voices" && <VoicesTab voices={analysis.voices} issues={analysis.issues} />}
          {activeTab === "visualize" && <VisualizeTab issues={analysis.issues} />}
          {activeTab === "map" && (
            <div className="py-4">
              <MapTab sessions={sessions} voices={analysis.voices} issues={analysis.issues} area={areaName} />
            </div>
          )}
          {activeTab === "policy" && (
            <PolicyTab
              proposals={proposals}
              issues={analysis.issues}
              onGenerate={handleGeneratePolicy}
              isGenerating={isGeneratingPolicy}
            />
          )}
        </div>
      )}
    </div>
  );
}
