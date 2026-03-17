"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MicButton } from "@/components/record/MicButton";
import { createSession, addTranscriptEntry, updateSession } from "@/lib/api";
import { Suspense } from "react";

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}

function ToggleSwitch({ checked, onChange, disabled }: ToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      style={{
        flexShrink: 0,
        width: 44,
        height: 24,
        borderRadius: 12,
        backgroundColor: checked ? "#D42B1E" : "#D4D0CA",
        border: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        position: "relative",
        transition: "background-color 0.2s ease",
        padding: 0,
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 3,
          left: checked ? 23 : 3,
          width: 18,
          height: 18,
          borderRadius: "50%",
          backgroundColor: "#2C1D12",
          transition: "left 0.2s ease",
        }}
      />
    </button>
  );
}

function RecordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const area = searchParams.get("area") || "Unknown area";
  const recordUrl = typeof window !== "undefined"
    ? `${window.location.origin}/record?area=${encodeURIComponent(area)}`
    : "";

  const [isRecording, setIsRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [transcript, setTranscript] = useState<string[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [consent, setConsent] = useState({
    recording: false,
    quotes: false,
    retention: false,
  });
  const [declined, setDeclined] = useState(false);
  const [demographics, setDemographics] = useState({
    ageRange: "",
    gender: "",
    postcode: "",
  });
  const [gps, setGps] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsStatus, setGpsStatus] = useState<"idle" | "loading" | "ok" | "denied">("idle");
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const consentGiven = consent.recording && consent.quotes; // minimum required
  const notesOnlyMode = !consent.recording; // if they decline recording, notes only
  const allDeclined = !consent.recording && !consent.quotes && !consent.retention;

  const timerRef = useRef<ReturnType<typeof setInterval>>(undefined);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const startTimeRef = useRef<number>(0);
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll transcript
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);

  // Request GPS
  function requestGPS() {
    setGpsStatus("loading");
    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        setGps({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGpsStatus("ok");
      },
      () => setGpsStatus("denied"),
      { timeout: 8000 }
    );
  }

  async function startRecording() {
    if (!consentGiven) {
      setError("Please confirm participant consent before recording.");
      return;
    }

    setError(null);
    requestGPS();

    // Create session
    const session = await createSession({
      area,
      participant: demographics,
      gpsLat: gps?.lat ?? 0,
      gpsLng: gps?.lng ?? 0,
      consentGiven: true,
      durationSeconds: 0,
      transcript: [],
    });
    setSessionId(session.id);

    // Start speech recognition
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SR) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const recognition = new SR() as any;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-GB";

      let lastFinal = "";
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        let final = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          }
        }
        if (final && final !== lastFinal) {
          lastFinal = final;
          const text = final.trim();
          setTranscript((prev) => [...prev, text]);
          const offsetMs = Date.now() - startTimeRef.current;
          addTranscriptEntry(session.id, text, offsetMs).catch(console.error);
        }
      };

      recognition.start();
      recognitionRef.current = recognition;
    }

    // Start timer
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      setElapsed((e) => e + 1);
    }, 1000);

    setIsRecording(true);
  }

  async function stopRecording() {
    clearInterval(timerRef.current);
    recognitionRef.current?.stop();
    recognitionRef.current = null;

    setIsRecording(false);

    if (sessionId) {
      setIsSaving(true);
      try {
        await updateSession(sessionId, {
          durationSeconds: elapsed,
          gpsLat: gps?.lat ?? 0,
          gpsLng: gps?.lng ?? 0,
          participant: {
            ...demographics,
            description: demographics.ageRange || demographics.gender
              ? `${demographics.gender || "Person"}, ${demographics.ageRange || ""}, ${area}`
              : undefined,
          },
        });
      } catch (err) {
        console.error("Failed to update session:", err);
      } finally {
        setIsSaving(false);
      }
    }
  }

  const handleToggle = useCallback(async () => {
    if (isRecording) {
      await stopRecording();
    } else {
      await startRecording();
    }
  }, [isRecording, consentGiven, gps, demographics, elapsed, sessionId]);

  const handleFinish = () => {
    const areaSlug = encodeURIComponent(area.toLowerCase().replace(/\s+/g, "-"));
    router.push(`/results/${areaSlug}`);
  };

  // Declined — show thank-you screen
  if (declined) {
    return (
      <div
        className="flex flex-col min-h-screen items-center justify-center px-6"
        style={{ backgroundColor: "#FAF9F6" }}
      >
        <div
          className="max-w-sm w-full p-8 border text-center"
          style={{ backgroundColor: "#F0EFEC", borderColor: "#D4D0CA", borderRadius: "4px" }}
        >
          <div style={{ fontSize: 40, marginBottom: 16 }}>👋</div>
          <h2 className="text-xl font-semibold mb-3" style={{ color: "#2C1D12" }}>
            Thank you
          </h2>
          <p className="text-sm leading-relaxed mb-6" style={{ color: "#5C4D3C" }}>
            The participant chose not to participate. No data has been recorded.
          </p>
          <button
            onClick={() => router.push(`/briefing/${encodeURIComponent(area.toLowerCase().replace(/\s+/g, "-"))}`)}
            className="px-6 py-3 font-medium text-sm"
            style={{
              backgroundColor: "#E8E6E2",
              color: "#2C1D12",
              border: "1px solid #D4D0CA",
              borderRadius: "2px",
              cursor: "pointer",
            }}
          >
            Back to briefing
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ backgroundColor: "#FAF9F6", userSelect: "none" }}
    >
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-6 py-4"
        style={{ borderBottom: "1px solid #D4D0CA" }}
      >
        <div>
          <p className="text-xs font-medium uppercase tracking-widest" style={{ color: "#8A7E72" }}>
            Recording
          </p>
          <p className="text-sm font-medium capitalize" style={{ color: "#2C1D12" }}>{area}</p>
        </div>

        <div className="flex items-center gap-4">
          {isRecording && (
            <span className="text-lg font-mono font-bold" style={{ color: "#D42B1E" }}>
              {formatTime(elapsed)}
            </span>
          )}
          {!isRecording && elapsed > 0 && (
            <span className="text-lg font-mono" style={{ color: "#5C4D3C" }}>
              {formatTime(elapsed)}
            </span>
          )}
          <button
            onClick={() => router.push(`/briefing/${encodeURIComponent(area.toLowerCase().replace(/\s+/g, "-"))}`)}
            className="text-sm"
            style={{ color: "#8A7E72" }}
          >
            Exit
          </button>
        </div>
      </div>

      {/* Mobile / field-use CTA — shown only on non-mobile desktops before recording starts */}
      {!isRecording && elapsed === 0 && typeof window !== "undefined" && !/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) && (
        <div
          className="mx-4 mt-4 p-4 border"
          style={{ backgroundColor: "#F0EFEC", borderColor: "#D4D0CA", borderRadius: "2px" }}
        >
          <p className="text-xs font-medium uppercase tracking-widest mb-2" style={{ color: "#8A7E72" }}>
            Recording in the field?
          </p>
          <p className="text-sm mb-3" style={{ color: "#5C4D3C" }}>
            Frank is designed for use on your phone — mic and GPS work best in the browser on Android or iOS.
          </p>
          <div className="flex flex-wrap gap-3 items-center">
            <div
              className="flex items-center gap-2 px-3 py-2 text-xs font-medium"
              style={{ backgroundColor: "#E8E6E2", borderRadius: "2px", color: "#2C1D12" }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#D42B1E" strokeWidth="2">
                <rect x="5" y="2" width="14" height="20" rx="2"/>
                <circle cx="12" cy="17" r="1" fill="#D42B1E"/>
              </svg>
              Open on your phone:{" "}
              <span style={{ color: "#D42B1E", fontFamily: "monospace" }}>frank.call.partners/record</span>
            </div>
            <span className="text-xs" style={{ color: "#8A7E72" }}>or continue here for desktop testing</span>
          </div>
        </div>
      )}

      {/* GPS status */}
      {gpsStatus === "ok" && (
        <div className="px-6 py-2 text-xs" style={{ backgroundColor: "#1B8A5A15", color: "#1B8A5A" }}>
          Location recorded
        </div>
      )}
      {gpsStatus === "denied" && (
        <div className="px-6 py-2 text-xs" style={{ backgroundColor: "#E62B1E15", color: "#E62B1E" }}>
          Location unavailable — interview will be recorded without GPS
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="px-6 py-2 text-sm" style={{ backgroundColor: "#E62B1E15", color: "#E62B1E" }}>
          {error}
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        {/* Three-toggle consent section */}
        {!isRecording && (
          <div className="mb-8 w-full" style={{ maxWidth: 420 }}>
            <p className="text-xs font-medium uppercase tracking-widest mb-3" style={{ color: "#8A7E72" }}>
              Participant consent
            </p>

            {/* Toggle rows */}
            {[
              {
                key: "recording" as const,
                label: "Record this conversation",
                description: "Audio recording for transcription and analysis",
              },
              {
                key: "quotes" as const,
                label: "Use quotes in reports",
                description: "Anonymised excerpts may appear in briefing documents",
              },
              {
                key: "retention" as const,
                label: "Retain data for 2 years",
                description: "Data kept securely for longitudinal research",
              },
            ].map((item) => (
              <div
                key={item.key}
                className="flex items-center gap-4 border-b"
                style={{
                  borderColor: "#D4D0CA",
                  minHeight: 56,
                  paddingTop: 12,
                  paddingBottom: 12,
                }}
              >
                <div className="flex-1">
                  <p className="text-sm font-medium" style={{ color: "#2C1D12" }}>
                    {item.label}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "#8A7E72" }}>
                    {item.description}
                  </p>
                </div>
                <ToggleSwitch
                  checked={consent[item.key]}
                  onChange={(v) => setConsent((c) => ({ ...c, [item.key]: v }))}
                />
              </div>
            ))}

            {/* Notes-only mode indicator */}
            {notesOnlyMode && (consent.quotes || consent.retention) && (
              <div
                className="mt-3 px-3 py-2 text-xs"
                style={{
                  backgroundColor: "#E8E6E2",
                  borderLeft: "2px solid #D42B1E",
                  color: "#5C4D3C",
                }}
              >
                Notes-only mode — no audio will be captured
              </div>
            )}

            {/* Participant declined button */}
            {allDeclined && (
              <button
                onClick={() => setDeclined(true)}
                className="mt-4 w-full py-4 font-medium text-sm"
                style={{
                  backgroundColor: "#F0EFEC",
                  color: "#8A7E72",
                  border: "1px solid #D4D0CA",
                  borderRadius: "2px",
                  cursor: "pointer",
                  letterSpacing: "0.04em",
                }}
              >
                Participant declined — end gracefully
              </button>
            )}
          </div>
        )}

        {/* Mic button */}
        <div className="mb-8">
          <MicButton
            isRecording={isRecording}
            onToggle={handleToggle}
            disabled={isSaving}
          />
        </div>

        {/* Status text */}
        <p className="text-sm text-center" style={{ color: "#8A7E72" }}>
          {isRecording
            ? "Recording in progress — tap to stop"
            : elapsed > 0
            ? "Recording stopped"
            : consentGiven
            ? "Tap to start recording"
            : "Confirm consent above to begin"}
        </p>

        {/* Live transcript */}
        {transcript.length > 0 && (
          <div
            className="mt-6 w-full max-w-lg overflow-y-auto"
            style={{ maxHeight: 160 }}
          >
            {transcript.slice(-4).map((t, i) => (
              <p
                key={i}
                className="text-sm leading-relaxed mb-1"
                style={{ color: i === transcript.slice(-4).length - 1 ? "#2C1D12" : "#8A7E72" }}
              >
                {t}
              </p>
            ))}
            <div ref={transcriptEndRef} />
          </div>
        )}

        {/* Finish button (after recording stopped) */}
        {!isRecording && elapsed > 0 && (
          <button
            onClick={handleFinish}
            className="mt-8 px-8 font-semibold"
            style={{
              backgroundColor: "#D42B1E",
              color: "#FAF9F6",
              borderRadius: "2px",
              height: 56,
              minWidth: 200,
              border: "none",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            {isSaving ? "Saving..." : "View results"}
          </button>
        )}
      </div>

      {/* Session details panel */}
      <div
        className="border-t"
        style={{ borderColor: "#D4D0CA" }}
      >
        <button
          className="w-full flex items-center justify-between px-6 py-4 text-sm"
          style={{ color: "#8A7E72", backgroundColor: "transparent", border: "none", cursor: "pointer" }}
          onClick={() => setShowDetails((v) => !v)}
        >
          <span>Session details (optional)</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            style={{ transform: showDetails ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}
          >
            <path d="M18 15l-6-6-6 6" />
          </svg>
        </button>

        {showDetails && (
          <div className="px-6 pb-6" style={{ backgroundColor: "#F0EFEC" }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs mb-1.5" style={{ color: "#8A7E72" }}>Age range</label>
                <select
                  value={demographics.ageRange}
                  onChange={(e) => setDemographics((d) => ({ ...d, ageRange: e.target.value }))}
                  className="w-full bg-transparent border px-3 py-2 text-sm outline-none"
                  style={{
                    borderColor: "#D4D0CA",
                    borderRadius: "2px",
                    color: "#2C1D12",
                    backgroundColor: "#E8E6E2",
                    minHeight: 48,
                  }}
                >
                  <option value="">—</option>
                  <option value="18-25">18–25</option>
                  <option value="26-35">26–35</option>
                  <option value="36-50">36–50</option>
                  <option value="51-65">51–65</option>
                  <option value="65+">65+</option>
                </select>
              </div>

              <div>
                <label className="block text-xs mb-1.5" style={{ color: "#8A7E72" }}>Gender</label>
                <select
                  value={demographics.gender}
                  onChange={(e) => setDemographics((d) => ({ ...d, gender: e.target.value }))}
                  className="w-full bg-transparent border px-3 py-2 text-sm outline-none"
                  style={{
                    borderColor: "#D4D0CA",
                    borderRadius: "2px",
                    color: "#2C1D12",
                    backgroundColor: "#E8E6E2",
                    minHeight: 48,
                  }}
                >
                  <option value="">—</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="non-binary">Non-binary</option>
                  <option value="prefer not to say">Prefer not to say</option>
                </select>
              </div>

              <div>
                <label className="block text-xs mb-1.5" style={{ color: "#8A7E72" }}>Postcode</label>
                <input
                  type="text"
                  value={demographics.postcode}
                  onChange={(e) => setDemographics((d) => ({ ...d, postcode: e.target.value.toUpperCase() }))}
                  placeholder="e.g. E8 1DP"
                  className="w-full border px-3 py-2 text-sm outline-none"
                  style={{
                    borderColor: "#D4D0CA",
                    borderRadius: "2px",
                    color: "#2C1D12",
                    backgroundColor: "#E8E6E2",
                    minHeight: 48,
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function RecordPage() {
  return (
    <Suspense fallback={<div style={{ backgroundColor: "#FAF9F6", minHeight: "100vh" }} />}>
      <RecordContent />
    </Suspense>
  );
}
