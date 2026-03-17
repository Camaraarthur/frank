"use client";

import { useEffect, useState } from "react";

interface MicButtonProps {
  isRecording: boolean;
  isPaused?: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export function MicButton({ isRecording, isPaused = false, onToggle, disabled }: MicButtonProps) {
  const [pulseScale, setPulseScale] = useState(1);

  useEffect(() => {
    if (!isRecording || isPaused) {
      setPulseScale(1);
      return;
    }
    let dir = 1;
    const interval = setInterval(() => {
      setPulseScale(prev => {
        const next = prev + dir * 0.012;
        if (next >= 1.08) dir = -1;
        if (next <= 0.92) dir = 1;
        return next;
      });
    }, 20);
    return () => clearInterval(interval);
  }, [isRecording, isPaused]);

  const bgColor = isRecording && !isPaused
    ? "#D42B1E"   // amber — live
    : isPaused
    ? "#8A7E72"   // slate — paused
    : "#E8E6E2";  // navy700 — idle

  const iconColor = isRecording && !isPaused ? "#FAF9F6" : "#2C1D12";

  return (
    <div className="relative flex items-center justify-center" style={{ width: 160, height: 160 }}>
      {/* Outer pulse ring — only when recording */}
      {isRecording && !isPaused && (
        <div
          style={{
            position: "absolute",
            width: 160,
            height: 160,
            borderRadius: "50%",
            border: "1.5px solid #D42B1E",
            opacity: 0.3,
            transform: `scale(${pulseScale * 1.08})`,
            transition: "transform 0.05s linear, opacity 0.8s ease-in-out",
            animation: "beatPulseOuter 1.6s ease-in-out infinite",
          }}
        />
      )}

      {/* Inner amber ring — always present, defines tap area */}
      <div
        style={{
          position: "absolute",
          width: 136,
          height: 136,
          borderRadius: "50%",
          border: `2px solid #D42B1E`,
          opacity: isRecording && !isPaused ? 1 : isPaused ? 0.3 : 0.6,
          transition: "opacity 0.3s ease, border-width 0.3s ease",
        }}
      />

      <button
        onClick={onToggle}
        disabled={disabled}
        style={{
          position: "relative",
          width: 120,
          height: 120,
          borderRadius: "50%",
          backgroundColor: bgColor,
          border: "none",
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.5 : 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${isRecording && !isPaused ? pulseScale * 0.97 : 1})`,
          transition: "background-color 0.5s ease, transform 0.05s linear",
        }}
        aria-label={isRecording ? (isPaused ? "Resume recording" : "Pause recording") : "Start recording"}
      >
        {isPaused ? (
          // Pause icon — two rectangles
          <div style={{ display: "flex", gap: 6 }}>
            <div style={{ width: 8, height: 28, backgroundColor: iconColor, borderRadius: 2 }} />
            <div style={{ width: 8, height: 28, backgroundColor: iconColor, borderRadius: 2 }} />
          </div>
        ) : isRecording ? (
          // Stop icon
          <div style={{ width: 28, height: 28, backgroundColor: iconColor, borderRadius: 2 }} />
        ) : (
          // Mic icon
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8" y1="23" x2="16" y2="23" />
          </svg>
        )}
      </button>
    </div>
  );
}
