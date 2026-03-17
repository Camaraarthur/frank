"use client";

interface IssueCardProps {
  title: string;
  description: string;
  severity: "high" | "medium" | "low";
  sources: string[];
}

const severityConfig = {
  high: { color: "#E62B1E", label: "High priority" },
  medium: { color: "#D42B1E", label: "Medium priority" },
  low: { color: "#4299E1", label: "Emerging" },
};

export function IssueCard({ title, description, severity, sources }: IssueCardProps) {
  const config = severityConfig[severity];

  return (
    <div
      className="border-l-2 pl-4 py-3 pr-4"
      style={{
        borderLeftColor: config.color,
        backgroundColor: "#F0EFEC",
        borderRight: "1px solid #D4D0CA",
        borderTop: "1px solid #D4D0CA",
        borderBottom: "1px solid #D4D0CA",
        borderRadius: "0 2px 2px 0",
      }}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-semibold text-base" style={{ color: "#2C1D12" }}>
          {title}
        </h3>
        <span
          className="text-xs font-medium flex-shrink-0 px-2 py-0.5"
          style={{ color: config.color, backgroundColor: config.color + "18", borderRadius: "2px" }}
        >
          {config.label}
        </span>
      </div>

      <p className="text-sm leading-relaxed mb-3" style={{ color: "#5C4D3C" }}>
        {description}
      </p>

      {sources.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {sources.map((source, i) => (
            <span key={i} className="text-xs" style={{ color: "#8A7E72" }}>
              {source.startsWith("http") ? (
                <a href={source} target="_blank" rel="noopener noreferrer" style={{ color: "#D42B1E" }}>
                  Source {i + 1}
                </a>
              ) : (
                source
              )}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
