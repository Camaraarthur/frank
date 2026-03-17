"use client";

import { useState, useCallback } from "react";
import type { Issue } from "@/lib/api";

interface IssuesTabProps {
  issues: Issue[];
}

type SortKey = "composite" | "severity" | "frequency" | "costToFix" | "timeToResolve" | "complexity";

const SORT_OPTIONS: Array<{ key: SortKey; label: string }> = [
  { key: "composite", label: "Priority" },
  { key: "severity", label: "Severity" },
  { key: "frequency", label: "Frequency" },
  { key: "costToFix", label: "Cost" },
  { key: "timeToResolve", label: "Time" },
  { key: "complexity", label: "Complexity" },
];

const TIME_LABELS = ["", "Weeks", "Months", "1–2 yrs", "5+ yrs", "Generational"];
const COST_LABELS = ["", "Low cost", "Moderate", "Significant", "High", "Transformative"];

function ScoreDots({ value, max = 5, color = "#D42B1E" }: { value: number; max?: number; color?: string }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }).map((_, i) => (
        <div
          key={i}
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: i < value ? color : "#D4D0CA" }}
        />
      ))}
    </div>
  );
}

export function IssuesTab({ issues }: IssuesTabProps) {
  const [sortBy, setSortBy] = useState<SortKey>("composite");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const getSortValue = (issue: Issue): number => {
    if (sortBy === "composite") return issue.compositeScore ?? (issue.score.severity * issue.score.frequency);
    if (sortBy === "frequency") return issue.score.frequency;
    return (issue.score as unknown as Record<string, number>)[sortBy] ?? 0;
  };

  const sorted = [...issues].sort((a, b) => getSortValue(b) - getSortValue(a));

  if (sorted.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm" style={{ color: "#8A7E72" }}>No issues analyzed yet. Run an analysis after collecting interviews.</p>
      </div>
    );
  }

  return (
    <div className="py-4">
      {/* Sort bar */}
      <div className="flex items-center gap-2 mb-5 flex-wrap">
        <span className="text-xs font-medium uppercase tracking-wider mr-1" style={{ color: "#8A7E72" }}>Sort by</span>
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            onClick={() => setSortBy(opt.key)}
            className="px-3 text-xs font-medium transition-all"
            style={{
              height: "32px",
              borderRadius: "2px",
              border: `1px solid ${sortBy === opt.key ? "#D42B1E" : "#D4D0CA"}`,
              backgroundColor: sortBy === opt.key ? "#D42B1E18" : "transparent",
              color: sortBy === opt.key ? "#D42B1E" : "#8A7E72",
              cursor: "pointer",
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {sorted.map((issue, rank) => {
          const isExpanded = expandedId === issue.id;
          const s = issue.score;

          return (
            <div
              key={issue.id}
              className="border"
              style={{ backgroundColor: "#F0EFEC", borderColor: "#D4D0CA", borderRadius: "2px" }}
            >
              <button
                className="w-full p-4 text-left"
                onClick={() => setExpandedId(isExpanded ? null : issue.id)}
              >
                <div className="flex items-start gap-4">
                  <span
                    className="text-3xl font-bold flex-shrink-0 w-10 text-right leading-none mt-0.5"
                    style={{ color: "#D42B1E" }}
                  >
                    {rank + 1}
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-base" style={{ color: "#2C1D12" }}>{issue.title}</h3>
                        {s.isSystemic && (
                          <span className="text-[10px] font-medium px-1.5 py-0.5 uppercase tracking-wide"
                            style={{ backgroundColor: "#E62B1E18", color: "#E62B1E", borderRadius: "2px", border: "1px solid #E62B1E33" }}>
                            Systemic
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs font-medium px-2 py-0.5"
                          style={{ backgroundColor: "#E8E6E2", color: "#5C4D3C", borderRadius: "2px" }}>
                          {s.frequency} conversation{s.frequency !== 1 ? "s" : ""}
                        </span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8A7E72" strokeWidth="2"
                          style={{ transform: isExpanded ? "rotate(180deg)" : "none", transition: "transform 0.15s", flexShrink: 0 }}>
                          <path d="M6 9l6 6 6-6" />
                        </svg>
                      </div>
                    </div>

                    {/* 4-dimension score grid */}
                    <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 mt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px]" style={{ color: "#8A7E72" }}>Severity</span>
                        <ScoreDots value={s.severity} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px]" style={{ color: "#8A7E72" }}>Cost to fix</span>
                        <ScoreDots value={s.costToFix} color="#E62B1E" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px]" style={{ color: "#8A7E72" }}>Complexity</span>
                        <ScoreDots value={s.complexity} color="#5C4D3C" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px]" style={{ color: "#8A7E72" }}>Time</span>
                        <span className="text-[11px] font-medium" style={{ color: "#5C4D3C" }}>
                          {TIME_LABELS[s.timeToResolve] || String(s.timeToResolve)}
                        </span>
                      </div>
                    </div>

                    {s.isSystemic && s.systemicNote && !isExpanded && (
                      <p className="text-xs mt-2" style={{ color: "#E62B1E", opacity: 0.8 }}>
                        ⚠ {s.systemicNote}
                      </p>
                    )}

                    {!isExpanded && issue.quotes.slice(0, 1).map((q, i) => (
                      <p key={i} className="text-sm italic mt-2 pl-3 border-l-2"
                        style={{ color: "#5C4D3C", borderLeftColor: "#D42B1E" }}>
                        &ldquo;{q.text}&rdquo;
                      </p>
                    ))}
                  </div>
                </div>
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 border-t" style={{ borderColor: "#D4D0CA" }}>
                  <p className="text-sm mt-3 mb-4 leading-relaxed" style={{ color: "#5C4D3C" }}>
                    {issue.description}
                  </p>

                  {/* Full scoring breakdown */}
                  <div className="p-3 mb-4" style={{ backgroundColor: "#E8E6E2", borderRadius: "2px" }}>
                    <p className="text-xs font-medium uppercase tracking-wider mb-3" style={{ color: "#8A7E72" }}>
                      Scoring breakdown
                    </p>
                    <div className="space-y-2">
                      {[
                        { label: "Severity", value: s.severity, max: 5, note: "how much harm right now", color: "#D42B1E" },
                        { label: "Frequency", value: Math.min(s.frequency, 5), max: 5, note: `${s.frequency} sessions raised this`, color: "#D42B1E" },
                        { label: "Cost to fix", value: s.costToFix, max: 5, note: COST_LABELS[s.costToFix] ?? "", color: "#E62B1E" },
                        { label: "Time to resolve", value: s.timeToResolve, max: 5, note: TIME_LABELS[s.timeToResolve] ?? "", color: "#5C4D3C" },
                        { label: "Complexity", value: s.complexity, max: 5, note: s.complexity >= 4 ? "structural/systemic" : s.complexity >= 3 ? "needs policy change" : "operational fix", color: "#5C4D3C" },
                      ].map((dim) => (
                        <div key={dim.label} className="flex items-center gap-3">
                          <span className="text-xs w-28 flex-shrink-0" style={{ color: "#8A7E72" }}>{dim.label}</span>
                          <ScoreDots value={dim.value} max={dim.max} color={dim.color} />
                          <span className="text-xs" style={{ color: "#8A7E72" }}>{dim.note}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {s.isSystemic && s.systemicNote && (
                    <div className="mb-4 p-3 border-l-2" style={{ backgroundColor: "#E62B1E0D", borderLeftColor: "#E62B1E" }}>
                      <p className="text-xs font-medium mb-1" style={{ color: "#E62B1E" }}>Root cause</p>
                      <p className="text-sm leading-relaxed" style={{ color: "#5C4D3C" }}>{s.systemicNote}</p>
                    </div>
                  )}

                  <h4 className="text-xs font-medium uppercase tracking-wider mb-3" style={{ color: "#8A7E72" }}>
                    What people said
                  </h4>
                  <div className="space-y-3">
                    {issue.quotes.map((q, i) => (
                      <div key={i} className="pl-3 border-l-2" style={{ borderLeftColor: "#D42B1E" }}>
                        <p className="text-sm italic mb-0.5" style={{ color: "#2C1D12" }}>
                          &ldquo;{q.text}&rdquo;
                        </p>
                        <p className="text-xs" style={{ color: "#8A7E72" }}>{q.speakerDescription}</p>
                      </div>
                    ))}
                  </div>

                  {issue.relatedIssues?.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: "#8A7E72" }}>
                        Connected issues
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {issue.relatedIssues.map((r, i) => (
                          <span key={i} className="text-xs px-2 py-1"
                            style={{ backgroundColor: "#E8E6E2", color: "#5C4D3C", borderRadius: "2px" }}>
                            {r}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Participatory actions */}
                  <div className="mt-4 pt-3 border-t flex items-center gap-3" style={{ borderColor: "#D4D0CA" }}>
                    <button
                      onClick={(e) => { e.stopPropagation(); alert("In the full version, your agreement is recorded and counted publicly."); }}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium"
                      style={{ backgroundColor: "#E8E6E2", color: "#5C4D3C", border: "1px solid #D4D0CA", borderRadius: "2px", cursor: "pointer" }}
                    >
                      <span>+1</span> This affects me too
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); alert("In the full version, you can add your voice — a written comment or voice note."); }}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium"
                      style={{ backgroundColor: "transparent", color: "#8A7E72", border: "1px solid #D4D0CA", borderRadius: "2px", cursor: "pointer" }}
                    >
                      Add your voice
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
