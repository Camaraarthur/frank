"use client";

import type { AnalysisResult } from "@/lib/api";

interface VoicesTabProps {
  voices: AnalysisResult["voices"];
  issues: AnalysisResult["issues"];
}

function getInitials(description?: string): string {
  if (!description) return "?";
  const words = description.trim().split(/\s+/);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return words[0][0]?.toUpperCase() || "?";
}

export function VoicesTab({ voices, issues }: VoicesTabProps) {
  if (voices.length === 0) {
    return (
      <div className="py-16 text-center">
        <p style={{ color: "#8A7E72" }}>No voices yet. Record interviews to see participants here.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 py-4">
      {voices.map((voice) => {
        const issueTitle = issues.find((i) => i.id === voice.mainIssue)?.title || voice.mainIssue;

        return (
          <div
            key={voice.sessionId}
            className="p-4 border"
            style={{
              backgroundColor: "#F0EFEC",
              borderColor: "#D4D0CA",
              borderRadius: "2px",
            }}
          >
            <div className="flex items-start gap-3 mb-3">
              {/* Voice number indicator */}
              <div
                className="flex-shrink-0 flex items-center justify-center font-bold text-sm"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  backgroundColor: "#D42B1E15",
                  color: "#D42B1E",
                  border: "1px solid #D42B1E33",
                }}
              >
                {voices.indexOf(voice) + 1}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium" style={{ color: "#2C1D12" }}>
                  {voice.positioningOneLiner}
                </p>
              </div>
            </div>

            {/* Main issue chip */}
            <span
              className="inline-block text-xs font-medium px-2 py-0.5 mb-3"
              style={{ backgroundColor: "#D42B1E22", color: "#D42B1E", borderRadius: "2px" }}
            >
              {issueTitle}
            </span>

            {/* Key quote */}
            <p
              className="text-sm italic pl-3 border-l-2 mb-3"
              style={{ color: "#5C4D3C", borderLeftColor: "#D42B1E" }}
            >
              "{voice.keyQuote}"
            </p>

            {/* Demographics chips */}
            <div className="flex flex-wrap gap-1.5">
              {voice.demographics?.ageRange && (
                <span className="text-xs px-2 py-0.5" style={{ backgroundColor: "#E8E6E2", color: "#8A7E72", borderRadius: "2px" }}>
                  {voice.demographics.ageRange}
                </span>
              )}
              {voice.demographics?.gender && (
                <span className="text-xs px-2 py-0.5" style={{ backgroundColor: "#E8E6E2", color: "#8A7E72", borderRadius: "2px" }}>
                  {voice.demographics.gender}
                </span>
              )}
              {voice.demographics?.postcode && (
                <span className="text-xs px-2 py-0.5" style={{ backgroundColor: "#E8E6E2", color: "#8A7E72", borderRadius: "2px" }}>
                  {voice.demographics.postcode}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
