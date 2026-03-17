"use client";

interface GoverningBodyCardProps {
  level: string;
  name: string;
  representative: string;
  party?: string;
  keyPolicies: string[];
}

const partyColors: Record<string, string> = {
  Labour: "#E4003B",
  Conservative: "#0087DC",
  "Liberal Democrat": "#FAA61A",
  "Lib Dem": "#FAA61A",
  Green: "#00B140",
  SNP: "#FDF38E",
  Plaid: "#3F8428",
  Independent: "#8A7E72",
};

export function GoverningBodyCard({ level, name, representative, party, keyPolicies }: GoverningBodyCardProps) {
  const partyColor = party ? (partyColors[party] || "#8A7E72") : undefined;

  return (
    <div
      className="p-4 border"
      style={{
        backgroundColor: "#F0EFEC",
        borderColor: "#D4D0CA",
        borderRadius: "2px",
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <span
            className="text-xs font-medium uppercase tracking-wider px-2 py-0.5 rounded"
            style={{ backgroundColor: "#D4D0CA", color: "#8A7E72" }}
          >
            {level}
          </span>
          <h3 className="mt-1 font-semibold text-base" style={{ color: "#2C1D12" }}>
            {name}
          </h3>
        </div>
        {party && (
          <span
            className="text-xs font-medium px-2 py-0.5 flex-shrink-0"
            style={{
              backgroundColor: partyColor + "22",
              color: partyColor,
              border: `1px solid ${partyColor}55`,
              borderRadius: "2px",
            }}
          >
            {party}
          </span>
        )}
      </div>

      <p className="text-sm mb-3" style={{ color: "#5C4D3C" }}>
        <span style={{ color: "#8A7E72" }}>Representative: </span>
        {representative}
      </p>

      {keyPolicies.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {keyPolicies.map((policy, i) => (
            <span
              key={i}
              className="text-xs px-2 py-1"
              style={{
                backgroundColor: "#E8E6E2",
                color: "#5C4D3C",
                borderRadius: "2px",
              }}
            >
              {policy}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
