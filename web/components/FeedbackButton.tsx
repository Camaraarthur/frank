"use client";

import { useState } from "react";

const CATEGORIES = [
  { key: "wrong", label: "Wrong information", emoji: "⚠" },
  { key: "idea", label: "Feature idea", emoji: "💡" },
  { key: "bug", label: "Something broken", emoji: "🐛" },
  { key: "complaint", label: "Complaint", emoji: "📢" },
  { key: "other", label: "Other", emoji: "💬" },
];

export function FeedbackButton() {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function send() {
    if (!message.trim() || !category) return;
    setSending(true);

    try {
      await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          areaSlug: "_feedback",
          content: `[${category}] ${message}`,
          issueId: category,
        }),
      });
      setSent(true);
      setTimeout(() => { setSent(false); setOpen(false); setMessage(""); setCategory(""); }, 2000);
    } catch {
      alert("Failed to send. Try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed", bottom: 20, right: 20, zIndex: 1000,
          width: 44, height: 44, borderRadius: "50%",
          background: open ? "#6B6B6B" : "#1A1A1A", color: "#FFF",
          border: "none", cursor: "pointer", fontSize: 18,
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        {open ? "×" : "?"}
      </button>

      {/* Panel */}
      {open && (
        <div style={{
          position: "fixed", bottom: 72, right: 20, zIndex: 1000,
          width: 320, background: "#FFF", border: "1px solid #E0E0E0",
          boxShadow: "0 4px 16px rgba(0,0,0,0.1)", padding: 16,
        }}>
          {sent ? (
            <p style={{ fontSize: 14, color: "#1B7A4A", textAlign: "center", padding: 20 }}>
              Thank you. We read everything.
            </p>
          ) : (
            <>
              <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 12 }}>Send feedback</p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 12 }}>
                {CATEGORIES.map((c) => (
                  <button key={c.key} onClick={() => setCategory(c.key)} style={{
                    fontSize: 12, padding: "4px 10px", cursor: "pointer", borderRadius: 0,
                    background: category === c.key ? "#1A1A1A" : "#FFF",
                    color: category === c.key ? "#FFF" : "#1A1A1A",
                    border: "1px solid #E0E0E0",
                  }}>
                    {c.emoji} {c.label}
                  </button>
                ))}
              </div>

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="What's on your mind?"
                rows={3}
                style={{
                  width: "100%", fontSize: 14, padding: 8,
                  border: "1px solid #E0E0E0", borderRadius: 0,
                  outline: "none", resize: "vertical", fontFamily: "inherit",
                }}
              />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                <span style={{ fontSize: 11, color: "#B3B3B3" }}>Anonymous · No login required</span>
                <button onClick={send} disabled={!message.trim() || !category || sending}
                  style={{
                    fontSize: 13, fontWeight: 500, padding: "6px 16px",
                    background: !message.trim() || !category ? "#E0E0E0" : "#1A1A1A",
                    color: "#FFF", border: "none", cursor: "pointer", borderRadius: 0,
                  }}>
                  {sending ? "..." : "Send"}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
