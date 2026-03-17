"use client";

import { useEffect, useRef, useState } from "react";
import type { AnalysisResult } from "@/lib/api";

interface VisualizeTabProps {
  issues: AnalysisResult["issues"];
}

interface Bubble {
  id: string;
  title: string;
  frequency: number;
  severity: number;
  topQuote: string;
  // Physics state
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

const CATEGORY_COLORS = [
  "#4299E1", "#48BB78", "#9F7AEA", "#F6AD55", "#FC8181",
  "#4FD1C5", "#76E4F7", "#B794F4", "#68D391", "#F6E05E",
];

interface TooltipState {
  title: string;
  frequency: number;
  severity: number;
  topQuote: string;
  x: number;
  y: number;
}

// ─── Bubble (force-directed) view ────────────────────────────────────────────

function BubbleView({ issues }: { issues: AnalysisResult["issues"] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bubblesRef = useRef<Bubble[]>([]);
  const animFrameRef = useRef<number>(0);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ width: 600, height: 440 });

  const getFrequency = (issue: AnalysisResult["issues"][0]) =>
    issue.score?.frequency ?? issue.frequency ?? 1;
  const getSeverity = (issue: AnalysisResult["issues"][0]) =>
    issue.score?.severity ?? issue.severity ?? 3;

  // Build bubbles from issues
  useEffect(() => {
    if (!issues.length) return;

    const maxScore = Math.max(...issues.map((i) => getFrequency(i) * getSeverity(i)));
    const w = dims.width;
    const h = dims.height;

    bubblesRef.current = issues.map((issue, idx) => {
      const score = getFrequency(issue) * getSeverity(issue);
      const radius = Math.max(40, Math.min(100, (score / maxScore) * 90 + 40));
      const angle = (idx / issues.length) * Math.PI * 2;
      const spread = Math.min(w, h) * 0.3;

      return {
        id: issue.id,
        title: issue.title,
        frequency: getFrequency(issue),
        severity: getSeverity(issue),
        topQuote: issue.quotes[0]?.text || "",
        x: w / 2 + Math.cos(angle) * spread,
        y: h / 2 + Math.sin(angle) * spread,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        radius,
        color: CATEGORY_COLORS[idx % CATEGORY_COLORS.length],
      };
    });
  }, [issues, dims]);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = dims.width;
    const h = dims.height;

    function step() {
      const bubbles = bubblesRef.current;

      // Spring forces — attract to center
      for (const b of bubbles) {
        const cx = w / 2;
        const cy = h / 2;
        b.vx += (cx - b.x) * 0.001;
        b.vy += (cy - b.y) * 0.001;
      }

      // Repulsion between bubbles
      for (let i = 0; i < bubbles.length; i++) {
        for (let j = i + 1; j < bubbles.length; j++) {
          const a = bubbles[i];
          const b = bubbles[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const minDist = a.radius + b.radius + 12;
          if (dist < minDist && dist > 0) {
            const force = ((minDist - dist) / dist) * 0.06;
            a.vx -= dx * force;
            a.vy -= dy * force;
            b.vx += dx * force;
            b.vy += dy * force;
          }
        }
      }

      // Update positions + dampen
      for (const b of bubbles) {
        b.vx *= 0.88;
        b.vy *= 0.88;
        b.x += b.vx;
        b.y += b.vy;

        // Boundary
        b.x = Math.max(b.radius + 8, Math.min(w - b.radius - 8, b.x));
        b.y = Math.max(b.radius + 8, Math.min(h - b.radius - 8, b.y));
      }

      // Draw
      ctx!.clearRect(0, 0, w, h);
      ctx!.fillStyle = "#FAF9F6";
      ctx!.fillRect(0, 0, w, h);

      for (const b of bubbles) {
        // Bubble
        ctx!.beginPath();
        ctx!.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx!.fillStyle = b.color + "33";
        ctx!.fill();
        ctx!.strokeStyle = b.color;
        ctx!.lineWidth = 1.5;
        ctx!.stroke();

        // Label
        ctx!.fillStyle = "#2C1D12";
        ctx!.font = `bold ${Math.max(11, Math.min(14, b.radius / 4))}px system-ui`;
        ctx!.textAlign = "center";
        ctx!.textBaseline = "middle";

        // Wrap text
        const words = b.title.split(" ");
        const lines: string[] = [];
        let current = "";
        const maxWidth = b.radius * 1.6;
        for (const word of words) {
          const test = current ? current + " " + word : word;
          if (ctx!.measureText(test).width > maxWidth && current) {
            lines.push(current);
            current = word;
          } else {
            current = test;
          }
        }
        if (current) lines.push(current);

        const lineHeight = Math.max(13, b.radius / 3.5);
        const startY = b.y - ((lines.length - 1) * lineHeight) / 2;
        for (let li = 0; li < lines.length; li++) {
          ctx!.fillText(lines[li], b.x, startY + li * lineHeight, maxWidth);
        }

        // Frequency indicator
        ctx!.fillStyle = b.color + "99";
        ctx!.font = `${Math.max(9, b.radius / 6)}px system-ui`;
        ctx!.fillText(`${b.frequency}×`, b.x, b.y + b.radius * 0.65);
      }

      animFrameRef.current = requestAnimationFrame(step);
    }

    animFrameRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [dims, issues]);

  // Resize observer
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          setDims({ width: Math.floor(width), height: Math.floor(height) });
        }
      }
    });
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  // Mouse hover for tooltip
  function handleMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const hit = bubblesRef.current.find((b) => {
      const dx = b.x - mx;
      const dy = b.y - my;
      return Math.sqrt(dx * dx + dy * dy) <= b.radius;
    });

    if (hit) {
      setTooltip({ title: hit.title, frequency: hit.frequency, severity: hit.severity, topQuote: hit.topQuote, x: e.clientX, y: e.clientY });
    } else {
      setTooltip(null);
    }
  }

  return (
    <div ref={containerRef} className="w-full relative" style={{ height: 440 }}>
      <canvas
        ref={canvasRef}
        width={dims.width}
        height={dims.height}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setTooltip(null)}
        className="w-full h-full"
        style={{ cursor: tooltip ? "pointer" : "default", display: "block" }}
      />

      {tooltip && (
        <div
          className="fixed z-50 p-3 pointer-events-none max-w-xs"
          style={{
            left: Math.min(tooltip.x + 12, window.innerWidth - 220),
            top: Math.max(tooltip.y - 60, 8),
            backgroundColor: "#E8E6E2",
            border: "1px solid #D4D0CA",
            borderRadius: "2px",
          }}
        >
          <p className="font-semibold text-sm mb-1" style={{ color: "#2C1D12" }}>
            {tooltip.title}
          </p>
          <p className="text-xs mb-1" style={{ color: "#5C4D3C" }}>
            {tooltip.frequency} conversation{tooltip.frequency !== 1 ? "s" : ""} · severity {tooltip.severity}/5
          </p>
          {tooltip.topQuote && (
            <p className="text-xs italic" style={{ color: "#8A7E72" }}>
              "{tooltip.topQuote.slice(0, 80)}..."
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Quadrant view ────────────────────────────────────────────────────────────

function QuadrantView({ issues }: { issues: AnalysisResult["issues"] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ width: 600, height: 440 });
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const getFrequency = (issue: AnalysisResult["issues"][0]) =>
    issue.score?.frequency ?? issue.frequency ?? 1;
  const getSeverity = (issue: AnalysisResult["issues"][0]) =>
    issue.score?.severity ?? issue.severity ?? 3;

  // Resize observer
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          setDims({ width: Math.floor(width), height: Math.floor(height) });
        }
      }
    });
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = dims.width;
    const h = dims.height;
    const pad = 48; // padding for axis labels
    const plotW = w - pad * 2;
    const plotH = h - pad * 2;

    // Clear
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#FAF9F6";
    ctx.fillRect(0, 0, w, h);

    // Compute data ranges
    const maxFreq = Math.max(...issues.map((i) => getFrequency(i)), 1);
    // Severity is 1–5

    // Helper: map data coords to canvas coords
    function toX(freq: number) {
      return pad + ((freq - 1) / Math.max(maxFreq - 1, 1)) * plotW;
    }
    function toY(sev: number) {
      return pad + ((5 - sev) / 4) * plotH; // inverted: high severity at top
    }

    const midX = pad + plotW / 2;
    const midY = pad + plotH / 2;

    // Quadrant background tints
    const quadrants = [
      { x: midX, y: pad, w: pad + plotW - midX, h: midY - pad, color: "rgba(244,169,0,0.07)", label: "Act now", labelX: midX + 8, labelY: pad + 16 },
      { x: pad, y: pad, w: midX - pad, h: midY - pad, color: "rgba(70,76,114,0.05)", label: "Investigate", labelX: pad + 8, labelY: pad + 16 },
      { x: pad, y: midY, w: midX - pad, h: pad + plotH - midY, color: "rgba(239,235,227,0)", label: "Monitor", labelX: pad + 8, labelY: midY + 16 },
      { x: midX, y: midY, w: pad + plotW - midX, h: pad + plotH - midY, color: "rgba(192,185,175,0.04)", label: "Awareness", labelX: midX + 8, labelY: midY + 16 },
    ];

    for (const q of quadrants) {
      ctx.fillStyle = q.color;
      ctx.fillRect(q.x, q.y, q.w, q.h);
    }

    // Grid lines
    ctx.strokeStyle = "#D4D0CA";
    ctx.lineWidth = 0.5;
    ctx.setLineDash([4, 6]);

    // Vertical grid lines
    const freqSteps = Math.min(maxFreq, 6);
    for (let i = 0; i <= freqSteps; i++) {
      const freq = 1 + (i / freqSteps) * (maxFreq - 1);
      const x = toX(freq);
      ctx.beginPath();
      ctx.moveTo(x, pad);
      ctx.lineTo(x, pad + plotH);
      ctx.stroke();
    }
    // Horizontal grid lines
    for (let sev = 1; sev <= 5; sev++) {
      const y = toY(sev);
      ctx.beginPath();
      ctx.moveTo(pad, y);
      ctx.lineTo(pad + plotW, y);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // Quadrant divider lines (thicker)
    ctx.strokeStyle = "#D4D0CA";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(midX, pad);
    ctx.lineTo(midX, pad + plotH);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(pad, midY);
    ctx.lineTo(pad + plotW, midY);
    ctx.stroke();

    // Quadrant labels (large, low-opacity background text)
    ctx.font = "bold 11px system-ui";
    ctx.textBaseline = "top";
    ctx.textAlign = "left";
    for (const q of quadrants) {
      ctx.fillStyle = "rgba(154,138,122,0.4)";
      ctx.fillText(q.label.toUpperCase(), q.labelX, q.labelY);
    }

    // Axis labels
    ctx.fillStyle = "#8A7E72";
    ctx.font = "11px system-ui";
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.fillText("← low frequency   high frequency →", pad + plotW / 2, h - 4);

    ctx.save();
    ctx.translate(12, pad + plotH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText("← low severity   high severity →", 0, 0);
    ctx.restore();

    // Issue circles
    for (const issue of issues) {
      const freq = getFrequency(issue);
      const sev = getSeverity(issue);
      const cx = toX(freq);
      const cy = toY(sev);
      const r = Math.max(14, Math.sqrt(freq) * 8);

      // Determine quadrant for coloring
      const isActNow = freq > (maxFreq + 1) / 2 && sev > 3;
      const fillColor = isActNow ? "#D42B1E" : "#5C4D3C";

      // Circle
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = isActNow ? "rgba(244,169,0,0.18)" : "rgba(70,76,114,0.1)";
      ctx.fill();
      ctx.strokeStyle = fillColor;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Label inside if radius large enough
      ctx.fillStyle = "#2C1D12";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      if (r > 20) {
        const words = issue.title.split(" ");
        const lines: string[] = [];
        let cur = "";
        const maxLabelWidth = r * 1.7;
        ctx.font = `bold ${Math.max(9, Math.min(12, r / 3))}px system-ui`;
        for (const word of words) {
          const test = cur ? cur + " " + word : word;
          if (ctx.measureText(test).width > maxLabelWidth && cur) {
            lines.push(cur);
            cur = word;
          } else {
            cur = test;
          }
        }
        if (cur) lines.push(cur);
        const lh = Math.max(11, r / 3);
        const startY = cy - ((lines.length - 1) * lh) / 2;
        for (let li = 0; li < lines.length; li++) {
          ctx.fillText(lines[li], cx, startY + li * lh, maxLabelWidth);
        }
      } else {
        // Label outside circle
        ctx.font = "bold 10px system-ui";
        ctx.fillStyle = "#5C4D3C";
        ctx.fillText(issue.title.slice(0, 16), cx, cy + r + 10, 80);
      }
    }
  }, [dims, issues]);

  // Mouse hover
  function handleMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const pad = 48;
    const plotW = dims.width - pad * 2;
    const plotH = dims.height - pad * 2;
    const maxFreq = Math.max(...issues.map((i) => getFrequency(i)), 1);

    function toX(freq: number) {
      return pad + ((freq - 1) / Math.max(maxFreq - 1, 1)) * plotW;
    }
    function toY(sev: number) {
      return pad + ((5 - sev) / 4) * plotH;
    }

    const hit = issues.find((issue) => {
      const freq = getFrequency(issue);
      const sev = getSeverity(issue);
      const cx = toX(freq);
      const cy = toY(sev);
      const r = Math.max(14, Math.sqrt(freq) * 8);
      return Math.sqrt((mx - cx) ** 2 + (my - cy) ** 2) <= r;
    });

    if (hit) {
      setTooltip({
        title: hit.title,
        frequency: getFrequency(hit),
        severity: getSeverity(hit),
        topQuote: hit.quotes[0]?.text || "",
        x: e.clientX,
        y: e.clientY,
      });
    } else {
      setTooltip(null);
    }
  }

  return (
    <div ref={containerRef} className="w-full relative" style={{ height: 440 }}>
      <canvas
        ref={canvasRef}
        width={dims.width}
        height={dims.height}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setTooltip(null)}
        className="w-full h-full"
        style={{ cursor: tooltip ? "pointer" : "default", display: "block" }}
      />

      {tooltip && (
        <div
          className="fixed z-50 p-3 pointer-events-none max-w-xs"
          style={{
            left: Math.min(tooltip.x + 12, window.innerWidth - 220),
            top: Math.max(tooltip.y - 60, 8),
            backgroundColor: "#E8E6E2",
            border: "1px solid #D4D0CA",
            borderRadius: "2px",
          }}
        >
          <p className="font-semibold text-sm mb-1" style={{ color: "#2C1D12" }}>
            {tooltip.title}
          </p>
          <p className="text-xs mb-1" style={{ color: "#5C4D3C" }}>
            {tooltip.frequency} conversation{tooltip.frequency !== 1 ? "s" : ""} · severity {tooltip.severity}/5
          </p>
          {tooltip.topQuote && (
            <p className="text-xs italic" style={{ color: "#8A7E72" }}>
              "{tooltip.topQuote.slice(0, 80)}..."
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main VisualizeTab component ──────────────────────────────────────────────

export function VisualizeTab({ issues }: VisualizeTabProps) {
  const [view, setView] = useState<"quadrant" | "bubble">("quadrant");

  if (issues.length === 0) {
    return (
      <div className="py-16 text-center">
        <p style={{ color: "#8A7E72" }}>Run an analysis to see the issue visualization.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* View toggle */}
      <div className="flex items-center gap-1 mb-4 mt-4">
        {(["quadrant", "bubble"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            style={{
              padding: "6px 16px",
              fontSize: 13,
              fontWeight: 500,
              backgroundColor: view === v ? "#E8E6E2" : "transparent",
              color: view === v ? "#2C1D12" : "#8A7E72",
              border: `1px solid ${view === v ? "#D4D0CA" : "transparent"}`,
              borderRadius: "2px",
              cursor: "pointer",
              textTransform: "capitalize",
            }}
          >
            {v === "quadrant" ? "Quadrant" : "Bubble"}
          </button>
        ))}
      </div>

      {view === "quadrant" ? (
        <QuadrantView issues={issues} />
      ) : (
        <BubbleView issues={issues} />
      )}
    </div>
  );
}
