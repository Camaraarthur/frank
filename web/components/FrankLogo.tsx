"use client";

interface FrankLogoProps {
  size?: number;
  color?: string;
  showWordmark?: boolean;
  wordmarkColor?: string;
}

export function FrankLogo({ size = 48, color = "#D42B1E", showWordmark = false, wordmarkColor = "#D42B1E" }: FrankLogoProps) {
  // Hexagon ward mark SVG
  // Flat-top hexagon, slightly flattened vertically (ratio 1:0.88)
  // Inside: B letter + vertical rule + 3 horizontal bars
  const w = size;
  const h = size * 0.88;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: size * 0.3 }}>
      <svg width={w} height={h} viewBox="0 0 48 42" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Flat-top hexagon outline */}
        <polygon
          points="12,2 36,2 46,21 36,40 12,40 2,21"
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Letter B — constructed from rectangles */}
        {/* Stem */}
        <rect x="11" y="12" width="3.5" height="18" fill={color} />
        {/* Top bar */}
        <rect x="11" y="12" width="9" height="3" fill={color} />
        {/* Middle bar */}
        <rect x="11" y="19.5" width="9" height="3" fill={color} />
        {/* Bottom bar */}
        <rect x="11" y="27" width="9" height="3" fill={color} />
        {/* Top bump */}
        <rect x="17.5" y="15" width="3" height="4.5" fill={color} />
        {/* Bottom bump */}
        <rect x="17.5" y="22.5" width="3" height="4.5" fill={color} />

        {/* Vertical hairline rule — divides B zone from bars zone */}
        <line x1="24" y1="12" x2="24" y2="30" stroke={color} strokeWidth="0.8" opacity="0.6" />

        {/* Three horizontal bars — decreasing weight, right side */}
        {/* Thick */}
        <rect x="26" y="14" width="10" height="3.5" fill={color} />
        {/* Medium */}
        <rect x="26" y="20.25" width="10" height="2.5" fill={color} />
        {/* Thin */}
        <rect x="26" y="25.75" width="10" height="1.5" fill={color} />
      </svg>

      {showWordmark && (
        <span style={{
          fontFamily: "Space Grotesk, sans-serif",
          fontWeight: 900,
          fontSize: size * 0.75,
          color: wordmarkColor,
          letterSpacing: "0.08em",
          textTransform: "uppercase" as const,
          lineHeight: 1,
        }}>
          FRANK
        </span>
      )}
    </div>
  );
}
