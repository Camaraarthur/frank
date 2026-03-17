"use client";

import { useState } from "react";
import type { Issue, PolicyProposal } from "@/lib/api";

interface PolicyTabProps {
  proposals: PolicyProposal[] | null;
  issues: Issue[];
  onGenerate: () => void;
  isGenerating: boolean;
}

const feasibilityColor: Record<string, string> = {
  High: "#1B8A5A",
  Medium: "#D42B1E",
  Low: "#E62B1E",
};

const costColor: Record<string, string> = {
  low: "#1B8A5A",
  medium: "#D42B1E",
  high: "#E62B1E",
  transformative: "#E62B1E",
};

export function PolicyTab({ proposals, issues, onGenerate, isGenerating }: PolicyTabProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!proposals && !isGenerating) {
    return (
      <div className="py-16 flex flex-col items-center gap-6">
        <div className="text-center max-w-md">
          <h3 className="text-lg font-semibold mb-2" style={{ color: "#2C1D12" }}>
            Generate Policy Brief
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: "#5C4D3C" }}>
            Based on {issues.length} analyzed issue{issues.length !== 1 ? "s" : ""}, Frank will generate
            concrete policy proposals — with costs, drawbacks, and exactly who to contact — grounded in
            what your local governing bodies can actually do.
          </p>
        </div>
        <button
          onClick={onGenerate}
          disabled={issues.length === 0}
          style={{
            backgroundColor: issues.length === 0 ? "#D4D0CA" : "#D42B1E",
            color: issues.length === 0 ? "#8A7E72" : "#FAF9F6",
            height: "56px",
            borderRadius: "2px",
            border: "none",
            cursor: issues.length === 0 ? "not-allowed" : "pointer",
            fontSize: "15px",
            fontWeight: 600,
            minWidth: 220,
            padding: "0 32px",
          }}
        >
          Generate Policy Brief
        </button>
      </div>
    );
  }

  if (isGenerating) {
    return (
      <div className="py-16 flex flex-col items-center gap-4">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2.5 h-2.5 rounded-full"
              style={{
                backgroundColor: "#D42B1E",
                animation: "pulse 1.2s ease-in-out infinite",
                animationDelay: `${i * 0.2}s`,
                display: "inline-block",
              }}
            />
          ))}
        </div>
        <p style={{ color: "#5C4D3C" }}>Researching policy options for each issue...</p>
        <p className="text-xs" style={{ color: "#8A7E72" }}>Running live web research + AI synthesis</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 py-4">
      {proposals!.map((proposal, idx) => {
        const key = proposal.id ?? String(idx);
        const isExpanded = expandedId === key;
        const fc = feasibilityColor[proposal.feasibility] ?? "#8A7E72";
        const cc = costColor[proposal.estimatedCost?.category ?? "medium"] ?? "#D42B1E";

        // Support both new format (issuesAddressed) and legacy (issueId/issueTitle)
        const issuesAddressed = proposal.issuesAddressed?.length
          ? proposal.issuesAddressed
          : proposal.issueId
          ? [{ id: proposal.issueId, title: proposal.issueTitle ?? proposal.issueId }]
          : [];

        const title = proposal.title ?? proposal.proposalTitle ?? "Policy Proposal";
        const residentQuotes = proposal.residentQuotes ?? proposal.residentVoices ?? [];

        return (
          <div
            key={key}
            className="border"
            style={{ backgroundColor: "#F0EFEC", borderColor: "#D4D0CA", borderRadius: "2px" }}
          >
            {/* Header row — always visible */}
            <button
              className="w-full p-5 text-left"
              onClick={() => setExpandedId(isExpanded ? null : key)}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="font-semibold text-base leading-snug" style={{ color: "#2C1D12" }}>
                  {title}
                </h3>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span
                    className="text-xs font-medium px-2 py-0.5"
                    style={{ backgroundColor: fc + "22", color: fc, borderRadius: "2px", border: `1px solid ${fc}44` }}
                  >
                    {proposal.feasibility} feasibility
                  </span>
                  <svg
                    width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8A7E72" strokeWidth="2"
                    style={{ transform: isExpanded ? "rotate(180deg)" : "none", transition: "transform 0.15s", flexShrink: 0 }}
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </div>
              </div>

              {/* Issues this addresses — clickable amber tags */}
              {issuesAddressed.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {issuesAddressed.map((iss, i) => (
                    <span
                      key={i}
                      className="text-[11px] px-2 py-0.5 font-medium"
                      style={{ backgroundColor: "#D42B1E18", color: "#D42B1E", borderRadius: "2px", border: "1px solid #D42B1E33" }}
                      title={`View issue: ${iss.title}`}
                    >
                      {iss.title}
                    </span>
                  ))}
                </div>
              )}

              <p className="text-sm leading-relaxed mb-3" style={{ color: "#5C4D3C" }}>
                {proposal.summary}
              </p>

              {/* Key metrics row */}
              <div className="flex flex-wrap gap-4">
                {proposal.estimatedCost && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs" style={{ color: "#8A7E72" }}>Cost</span>
                    <span className="text-xs font-semibold" style={{ color: cc }}>{proposal.estimatedCost.range}</span>
                  </div>
                )}
                {proposal.timeToImplement && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs" style={{ color: "#8A7E72" }}>Time</span>
                    <span className="text-xs font-medium" style={{ color: "#5C4D3C" }}>{proposal.timeToImplement.range}</span>
                  </div>
                )}
                {proposal.responsibleDepartment && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs" style={{ color: "#8A7E72" }}>Dept</span>
                    <span className="text-xs font-medium" style={{ color: "#5C4D3C" }}>{proposal.responsibleDepartment}</span>
                  </div>
                )}
              </div>
            </button>

            {/* Expanded detail */}
            {isExpanded && (
              <div className="px-5 pb-5 border-t space-y-5" style={{ borderColor: "#D4D0CA" }}>

                {/* What the council can do */}
                <div className="pt-4">
                  <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: "#8A7E72" }}>
                    What the council can do
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: "#5C4D3C" }}>{proposal.councilAction}</p>
                  {proposal.feasibilityReason && (
                    <p className="text-xs mt-2 leading-relaxed" style={{ color: "#8A7E72" }}>{proposal.feasibilityReason}</p>
                  )}
                </div>

                {/* Path to implementation */}
                {proposal.pathToImplementation?.length > 0 && (
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: "#8A7E72" }}>
                      Path to implementation
                    </p>
                    <ol className="space-y-2">
                      {proposal.pathToImplementation.map((step, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <span
                            className="text-[11px] font-bold flex-shrink-0 w-5 h-5 flex items-center justify-center mt-0.5"
                            style={{ backgroundColor: "#D42B1E18", color: "#D42B1E", borderRadius: "2px", border: "1px solid #D42B1E33" }}
                          >
                            {i + 1}
                          </span>
                          <p className="text-sm leading-relaxed" style={{ color: "#5C4D3C" }}>{step}</p>
                        </li>
                      ))}
                    </ol>
                    {proposal.timeToImplement?.phasing && (
                      <p className="text-xs mt-2 pl-7 leading-relaxed" style={{ color: "#8A7E72" }}>
                        {proposal.timeToImplement.phasing}
                      </p>
                    )}
                  </div>
                )}

                {/* Who to contact */}
                {proposal.contactPath && (
                  <div className="p-3" style={{ backgroundColor: "#E8E6E2", borderRadius: "2px" }}>
                    <p className="text-xs font-medium uppercase tracking-wider mb-1.5" style={{ color: "#8A7E72" }}>
                      Who to contact
                    </p>
                    <p className="text-sm leading-relaxed" style={{ color: "#5C4D3C" }}>{proposal.contactPath}</p>
                  </div>
                )}

                {/* Cost */}
                {proposal.estimatedCost && (
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: "#8A7E72" }}>
                      Estimated cost
                    </p>
                    <div className="flex items-baseline gap-3 mb-1.5">
                      <span className="text-xl font-bold" style={{ color: cc }}>{proposal.estimatedCost.range}</span>
                      <span
                        className="text-xs capitalize px-2 py-0.5"
                        style={{ backgroundColor: cc + "18", color: cc, borderRadius: "2px", border: `1px solid ${cc}33` }}
                      >
                        {proposal.estimatedCost.category}
                      </span>
                    </div>
                    {proposal.estimatedCost.basis && (
                      <p className="text-xs leading-relaxed" style={{ color: "#8A7E72" }}>{proposal.estimatedCost.basis}</p>
                    )}
                  </div>
                )}

                {/* Drawbacks — shown prominently, not buried */}
                {proposal.drawbacks?.length > 0 && (
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: "#8A7E72" }}>
                      Drawbacks &amp; risks
                    </p>
                    <div className="space-y-2">
                      {proposal.drawbacks.map((d, i) => (
                        <div
                          key={i}
                          className="p-3 border-l-2"
                          style={{ backgroundColor: "#E62B1E08", borderLeftColor: "#E62B1E55" }}
                        >
                          <p className="text-xs font-medium mb-0.5" style={{ color: "#E62B1E" }}>{d.title}</p>
                          <p className="text-sm leading-relaxed" style={{ color: "#5C4D3C" }}>{d.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Systemic note — if this is a symptom not root cause */}
                {!proposal.isSystemicFix && proposal.systemicNote && (
                  <div className="p-3 border-l-2" style={{ backgroundColor: "#E62B1E0A", borderLeftColor: "#E62B1E" }}>
                    <p className="text-xs font-medium mb-1" style={{ color: "#E62B1E" }}>
                      This addresses the symptom, not the root cause
                    </p>
                    <p className="text-sm leading-relaxed" style={{ color: "#5C4D3C" }}>{proposal.systemicNote}</p>
                  </div>
                )}

                {/* Public support data */}
                {proposal.publicSupport && (
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider mb-1.5" style={{ color: "#8A7E72" }}>
                      Public support
                    </p>
                    <p className="text-sm leading-relaxed" style={{ color: "#5C4D3C" }}>{proposal.publicSupport}</p>
                  </div>
                )}

                {/* Resident voices */}
                {residentQuotes.length > 0 && (
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: "#8A7E72" }}>
                      What residents said
                    </p>
                    <div className="space-y-2">
                      {residentQuotes.map((quote, i) => (
                        <p
                          key={i}
                          className="text-sm italic pl-3 border-l-2"
                          style={{ color: "#5C4D3C", borderLeftColor: "#D42B1E" }}
                        >
                          &ldquo;{quote}&rdquo;
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Policy alignment */}
                {proposal.alignmentNote && (
                  <div
                    className="flex items-start gap-2 p-2.5"
                    style={{
                      backgroundColor: proposal.alignedWithStatedPolicy ? "#1B8A5A15" : "#E8E6E2",
                      borderRadius: "2px",
                    }}
                  >
                    <span style={{ color: proposal.alignedWithStatedPolicy ? "#1B8A5A" : "#8A7E72", fontWeight: "bold" }}>
                      {proposal.alignedWithStatedPolicy ? "✓" : "—"}
                    </span>
                    <p className="text-xs leading-relaxed" style={{ color: "#5C4D3C" }}>{proposal.alignmentNote}</p>
                  </div>
                )}

                {/* Sources */}
                {proposal.sources?.length > 0 && (
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider mb-1.5" style={{ color: "#8A7E72" }}>Sources</p>
                    <div className="flex flex-wrap gap-1.5">
                      {proposal.sources.map((src, i) => (
                        <span
                          key={i}
                          className="text-[11px] px-2 py-0.5"
                          style={{ backgroundColor: "#E8E6E2", color: "#8A7E72", borderRadius: "2px" }}
                        >
                          {src}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {/* Participatory actions */}
                <div className="mt-4 pt-3 border-t flex items-center gap-3" style={{ borderColor: "#D4D0CA" }}>
                  <button
                    onClick={() => alert("In the full version, your support is recorded and visible to the council.")}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium"
                    style={{ backgroundColor: "#464C72", color: "#FAF9F6", border: "none", borderRadius: "2px", cursor: "pointer" }}
                  >
                    Support this proposal
                  </button>
                  <button
                    onClick={() => alert("In the full version, you can comment with concerns, suggestions, or local knowledge.")}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium"
                    style={{ backgroundColor: "transparent", color: "#8A7E72", border: "1px solid #D4D0CA", borderRadius: "2px", cursor: "pointer" }}
                  >
                    Comment
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
