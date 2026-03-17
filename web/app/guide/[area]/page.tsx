"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { DocumentEditor } from "@/components/guide/DocumentEditor";
import { generateDocument, generateQuestions, processComments, sendChatMessage } from "@/lib/api";
import type { AreaBriefing } from "@/lib/api";

interface Comment {
  id: string;
  anchor: string;
  text: string;
  paragraphIndex: number;
  resolved: boolean;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const GUIDE_SESSION = "guide-chat-" + Math.random().toString(36).slice(2, 6);

export default function GuidePage() {
  const params = useParams();
  const router = useRouter();
  const areaSlug = params.area as string;
  const areaName = decodeURIComponent(areaSlug).replace(/-/g, " ");

  const [document, setDocument] = useState<string>("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [highlightedParagraphs, setHighlightedParagraphs] = useState<Set<number>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatting, setIsChatting] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const hasGreeted = useRef(false);

  // Load document
  useEffect(() => {
    const cacheKey = `guide:${areaSlug}`;
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      setDocument(cached);
      setIsLoading(false);
      return;
    }

    const briefingRaw = sessionStorage.getItem(`briefing:${areaSlug}`);
    const briefing: AreaBriefing | null = briefingRaw ? JSON.parse(briefingRaw) : null;

    setIsLoading(true);
    (async () => {
      try {
        const questions = await generateQuestions(areaName, briefing?.interviewThemes).catch(() => undefined);
        const result = await generateDocument(areaName, briefing || undefined, questions);
        sessionStorage.setItem(cacheKey, result.document);
        setDocument(result.document);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to generate guide");
      } finally {
        setIsLoading(false);
      }
    })();
  }, [areaSlug, areaName]);

  // Chat greeting
  useEffect(() => {
    if (hasGreeted.current || isLoading) return;
    hasGreeted.current = true;

    const greetId = crypto.randomUUID();
    setChatMessages([{
      id: greetId,
      role: "assistant",
      content: `This is your interview guide for ${areaName}. You can edit it directly, or tell me what you'd like to change.\n\nIs there something specific you want to understand from residents? A topic you're curious about? I'll adapt the questions.`,
    }]);
  }, [isLoading, areaName]);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleDocumentChange = useCallback((doc: string) => {
    setDocument(doc);
    clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => {
      sessionStorage.setItem(`guide:${areaSlug}`, doc);
    }, 2000);
  }, [areaSlug]);

  const handleAddComment = useCallback((commentData: Omit<Comment, "id" | "resolved">) => {
    const newComment: Comment = { ...commentData, id: crypto.randomUUID(), resolved: false };
    setComments((prev) => [...prev, newComment]);
  }, []);

  const handleProcessComments = useCallback(async () => {
    const unresolved = comments.filter((c) => !c.resolved);
    if (!unresolved.length || isProcessing) return;
    setIsProcessing(true);
    try {
      const result = await processComments(document, unresolved);
      setDocument(result.revisedDocument);
      sessionStorage.setItem(`guide:${areaSlug}`, result.revisedDocument);
      setComments((prev) => prev.map((c) => ({ ...c, resolved: true })));
      const changedIdxs = new Set(result.changes.map((c) => c.paragraphIndex));
      setHighlightedParagraphs(changedIdxs);
      setTimeout(() => setHighlightedParagraphs(new Set()), 3000);
    } catch { /* ignore */ }
    finally { setIsProcessing(false); }
  }, [comments, document, isProcessing, areaSlug]);

  // Chat send
  async function sendChat() {
    const text = chatInput.trim();
    if (!text || isChatting) return;
    setChatInput("");
    setIsChatting(true);

    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: "user", content: text };
    const aiId = crypto.randomUUID();
    setChatMessages((prev) => [...prev, userMsg, { id: aiId, role: "assistant", content: "" }]);

    // Prepend context about the guide
    const contextMsg = `__CONTEXT__: You are helping a researcher prepare for field interviews in ${areaName}. They have a generated interview guide. Answer their questions about interview methodology, suggest questions, explain why certain approaches work, adapt the guide to their interests. Be practical and specific. If they ask about the app, explain Frank's recording page, GPS, consent toggles. Keep answers concise.\n\nUser message: ${text}`;

    let full = "";
    try {
      await sendChatMessage(
        contextMsg,
        GUIDE_SESSION,
        (chunk) => {
          full += chunk;
          setChatMessages((prev) => prev.map((m) => m.id === aiId ? { ...m, content: full } : m));
        },
        () => setIsChatting(false)
      );
    } catch {
      setChatMessages((prev) => prev.map((m) => m.id === aiId ? { ...m, content: "Something went wrong. Try again." } : m));
      setIsChatting(false);
    }
  }

  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontSize: 14, color: "#6B6B6B" }}>Generating interview guide for {areaName}...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "#C41E1E" }}>{error}</p>
          <button onClick={() => router.push(`/briefing/${areaSlug}`)} style={{ marginTop: 12, fontSize: 13, color: "#6B6B6B", background: "none", border: "1px solid #E0E0E0", padding: "8px 20px", cursor: "pointer" }}>← back</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "#FFFFFF" }}>

      {/* Header */}
      <header style={{ borderBottom: "1px solid #E0E0E0", padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => router.push("/")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, fontWeight: 600 }}>
            <span style={{ color: "#C41E1E" }}>&ldquo;</span>frank
          </button>
          <span style={{ color: "#E0E0E0" }}>/</span>
          <span style={{ fontSize: 14, textTransform: "capitalize" }}>{areaName}</span>
          <span style={{ color: "#E0E0E0" }}>/</span>
          <span style={{ fontSize: 14, fontWeight: 500 }}>Guide</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {comments.filter((c) => !c.resolved).length > 0 && (
            <button onClick={handleProcessComments} disabled={isProcessing}
              style={{ fontSize: 13, background: "#1A1A1A", color: "#FFF", border: "none", padding: "6px 16px", cursor: "pointer" }}>
              {isProcessing ? "Rewriting..." : `Apply ${comments.filter((c) => !c.resolved).length} comments`}
            </button>
          )}
          <button onClick={() => router.push(`/record?area=${encodeURIComponent(areaName)}`)}
            style={{ fontSize: 13, color: "#C41E1E", background: "none", border: "1px solid #E0E0E0", padding: "6px 16px", cursor: "pointer" }}>
            Record
          </button>
        </div>
      </header>

      {/* Two-column: guide + chat */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* Guide document — left */}
        <div style={{ flex: "0 0 60%", overflowY: "auto" }}>
          <DocumentEditor
            document={document}
            comments={comments}
            onDocumentChange={handleDocumentChange}
            onAddComment={handleAddComment}
            highlightedParagraphs={highlightedParagraphs}
          />
        </div>

        {/* Chat — right */}
        <div style={{ flex: "0 0 40%", borderLeft: "1px solid #E0E0E0", display: "flex", flexDirection: "column" }}>

          <div style={{ padding: "12px 16px", borderBottom: "1px solid #E0E0E0" }}>
            <p style={{ fontSize: 13, fontWeight: 500 }}>Discuss your approach</p>
            <p style={{ fontSize: 12, color: "#6B6B6B" }}>Ask about methodology, suggest topics, adapt the guide</p>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px" }}>
            {chatMessages.map((msg) => (
              <div key={msg.id} style={{ marginBottom: 12, textAlign: msg.role === "user" ? "right" : "left" }}>
                <div style={{
                  display: "inline-block", maxWidth: "85%", padding: "8px 12px",
                  fontSize: 13, lineHeight: 1.5,
                  background: msg.role === "user" ? "#1A1A1A" : "#F0F0F0",
                  color: msg.role === "user" ? "#FFFFFF" : "#1A1A1A",
                  borderRadius: 0,
                }}>
                  {msg.content || <span style={{ color: "#B3B3B3" }}>...</span>}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div style={{ padding: "12px 16px", borderTop: "1px solid #E0E0E0" }}>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendChat()}
                placeholder="e.g. I want to understand how people feel about the new builds"
                disabled={isChatting}
                style={{ flex: 1, padding: "8px 12px", fontSize: 13, border: "1px solid #E0E0E0", background: "#FFFFFF", color: "#1A1A1A", outline: "none", borderRadius: 0 }}
              />
              <button onClick={sendChat} disabled={isChatting || !chatInput.trim()}
                style={{ padding: "8px 16px", fontSize: 13, fontWeight: 500, background: !chatInput.trim() || isChatting ? "#E0E0E0" : "#1A1A1A", color: "#FFF", border: "none", cursor: "pointer", borderRadius: 0 }}>
                →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
