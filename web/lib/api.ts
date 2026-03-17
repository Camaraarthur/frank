// ============================================================================
// Frank — Typed API client
// ============================================================================

export interface AreaBriefing {
  area: string;
  summary: string;
  governingBodies: Array<{
    level: string;
    name: string;
    representative: string;
    party?: string;
    keyPolicies: string[];
  }>;
  contestedIssues: Array<{
    title: string;
    description: string;
    severity: "high" | "medium" | "low";
    sources: string[];
  }>;
  demographics: {
    population?: number;
    highlights: string[];
  };
  suggestedLocations: Array<{
    name: string;
    reason: string;
  }>;
  interviewThemes: string[];
}

export interface Session {
  id: string;
  createdAt: number;
  area: string;
  participant: {
    ageRange?: string;
    gender?: string;
    postcode?: string;
    description?: string;
  };
  transcript: Array<{ timestamp: number; offsetMs: number; text: string }>;
  gpsLat: number;
  gpsLng: number;
  consentGiven: boolean;
  durationSeconds: number;
  audioPath?: string;
  analyzedIssues?: Array<{ issue: string; severity: number; quotes: string[] }>;
}

export interface IssueScore {
  severity: number;       // 1-5
  frequency: number;      // count
  costToFix: number;      // 1-5
  timeToResolve: number;  // 1-5
  complexity: number;     // 1-5
  isSystemic: boolean;
  systemicNote?: string;
}

export interface AnalysisIssue {
  id: string;
  title: string;
  description: string;
  score: IssueScore;
  compositeScore: number;
  // Convenience aliases (populated from score)
  frequency: number;
  severity: number;
  quotes: Array<{ text: string; sessionId: string; speakerDescription: string }>;
  relatedIssues: string[];
}

// Alias for convenience — matches the linter-updated IssuesTab import
export type Issue = AnalysisIssue;

export interface AnalysisResult {
  issues: AnalysisIssue[];
  voices: Array<{
    sessionId: string;
    positioningOneLiner: string;
    mainIssue: string;
    keyQuote: string;
    demographics: Session["participant"];
  }>;
}

export interface PolicyProposal {
  id: string;
  title: string;
  issuesAddressed: Array<{ id: string; title: string }>;
  summary: string;
  councilAction: string;
  responsibleDepartment: string;
  contactPath: string;
  residentQuotes: string[];
  publicSupport?: string;
  drawbacks: Array<{ title: string; description: string }>;
  estimatedCost: { range: string; basis: string; category: "low" | "medium" | "high" | "transformative" };
  timeToImplement: { range: string; phasing?: string };
  feasibility: "High" | "Medium" | "Low";
  feasibilityReason: string;
  alignedWithStatedPolicy: boolean;
  alignmentNote?: string;
  pathToImplementation: string[];
  isSystemicFix: boolean;
  systemicNote?: string;
  sources: string[];
  // Legacy fields for backward compatibility
  issueId?: string;
  issueTitle?: string;
  proposalTitle?: string;
  councilAction_old?: string;
  residentVoices?: string[];
  alignmentNote_old?: string | null;
}

const BASE = "/api";

// Chat — returns an EventSource-compatible reader
export async function sendChatMessage(
  message: string,
  sessionId: string,
  onChunk: (text: string) => void,
  onDone: () => void
): Promise<void> {
  const res = await fetch(`${BASE}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, sessionId }),
  });

  if (!res.ok) throw new Error(`Chat error: ${res.statusText}`);
  if (!res.body) throw new Error("No response body");

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        try {
          const data = JSON.parse(line.slice(6));
          if (data.text) onChunk(data.text);
          if (data.done) onDone();
        } catch {
          // skip malformed
        }
      }
    }
  }
}

// Area research
export async function researchArea(area: string, entityType: string): Promise<AreaBriefing> {
  const res = await fetch(`${BASE}/research/area`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ area, entityType }),
  });
  if (!res.ok) throw new Error(`Research error: ${res.statusText}`);
  return res.json();
}

// Generate interview questions
export async function generateQuestions(area: string, themes?: string[]): Promise<Record<string, string[]>> {
  const res = await fetch(`${BASE}/research/questions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ area, themes }),
  });
  if (!res.ok) throw new Error(`Questions error: ${res.statusText}`);
  return res.json();
}

// Generate document
export async function generateDocument(
  area: string,
  briefing?: AreaBriefing,
  questions?: Record<string, string[]>
): Promise<{ document: string; area: string }> {
  const res = await fetch(`${BASE}/document/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ area, briefing, questions }),
  });
  if (!res.ok) throw new Error(`Document error: ${res.statusText}`);
  return res.json();
}

// Process document comments
export async function processComments(
  document: string,
  comments: Array<{ id: string; anchor: string; text: string; paragraphIndex: number }>
): Promise<{ revisedDocument: string; changes: Array<{ paragraphIndex: number; summary: string }> }> {
  const res = await fetch(`${BASE}/document/process-comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ document, comments }),
  });
  if (!res.ok) throw new Error(`Process comments error: ${res.statusText}`);
  return res.json();
}

// Sessions
export async function createSession(data: Partial<Session>): Promise<Session> {
  const res = await fetch(`${BASE}/sessions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Create session error: ${res.statusText}`);
  return res.json();
}

export async function listSessions(area?: string): Promise<{ sessions: Session[]; count: number }> {
  const url = area ? `${BASE}/sessions?area=${encodeURIComponent(area)}` : `${BASE}/sessions`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`List sessions error: ${res.statusText}`);
  return res.json();
}

export async function getSessionById(id: string): Promise<Session> {
  const res = await fetch(`${BASE}/sessions/${id}`);
  if (!res.ok) throw new Error(`Get session error: ${res.statusText}`);
  return res.json();
}

export async function addTranscriptEntry(
  sessionId: string,
  text: string,
  offsetMs: number
): Promise<Session> {
  const res = await fetch(`${BASE}/sessions/${sessionId}/transcript`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, offsetMs, timestamp: Date.now() }),
  });
  if (!res.ok) throw new Error(`Transcript error: ${res.statusText}`);
  return res.json();
}

export async function updateSession(id: string, data: Partial<Session>): Promise<Session> {
  const res = await fetch(`${BASE}/sessions/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Update session error: ${res.statusText}`);
  return res.json();
}

// Analyze
export async function analyzeArea(area: string): Promise<AnalysisResult> {
  const res = await fetch(`${BASE}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ area }),
  });
  if (!res.ok) throw new Error(`Analyze error: ${res.statusText}`);
  return res.json();
}

// Policy — streaming
export async function generatePolicy(
  area: string,
  issues: AnalysisResult["issues"],
  briefing?: AreaBriefing,
  onChunk?: (chunk: string) => void
): Promise<{ proposals: PolicyProposal[] }> {
  const res = await fetch(`${BASE}/policy`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ area, issues, briefing }),
  });
  if (!res.ok) throw new Error(`Policy error: ${res.statusText}`);
  if (!res.body) throw new Error("No response body");

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let result: { proposals: PolicyProposal[] } | null = null;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        try {
          const data = JSON.parse(line.slice(6));
          if (data.chunk && onChunk) onChunk(data.chunk);
          if (data.done && data.result) result = data.result;
        } catch {
          // skip
        }
      }
    }
  }

  return result || { proposals: [] };
}
