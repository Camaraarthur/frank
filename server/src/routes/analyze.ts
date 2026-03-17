// ============================================================================
// Frank — Analyze route
// POST /api/analyze — analyze sessions → multi-dimensional issue scoring
// ============================================================================

import { Router } from "express";
import { generateText } from "../gemini.js";
import { listSessions } from "../store.js";

const router = Router();

export interface IssueScore {
  severity: number;        // 1-5: how much harm right now (assessed from transcript language)
  frequency: number;       // 1-N: how many sessions mentioned it
  costToFix: number;       // 1-5: 1=cheap, 5=very expensive (AI estimate)
  timeToResolve: number;   // 1-5: 1=weeks, 2=months, 3=1-2yr, 4=5yr+, 5=decade+
  complexity: number;      // 1-5: 1=operational fix, 5=deep structural/systemic
  isSystemic: boolean;     // true if root cause is outside local council's control
  systemicNote?: string;   // e.g. "rooted in national housing policy + land ownership"
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  score: IssueScore;
  compositeScore: number;  // severity × frequency for default sort
  quotes: Array<{
    text: string;
    sessionId: string;
    speakerDescription: string;
  }>;
  relatedIssues: string[];
}

export interface AnalysisResult {
  issues: Issue[];
  voices: Array<{
    sessionId: string;
    positioningOneLiner: string;
    mainIssue: string;
    keyQuote: string;
    demographics: {
      ageRange?: string;
      gender?: string;
      postcode?: string;
      description?: string;
    };
  }>;
}

// POST /api/analyze
router.post("/", async (req, res) => {
  const { area } = req.body as { area: string };

  if (!area) return res.status(400).json({ error: "area is required" });

  const sessions = await listSessions(area);
  if (sessions.length === 0) {
    return res.json({ issues: [], voices: [] } as AnalysisResult);
  }

  const sessionSummaries = sessions.map((s) => ({
    id: s.id,
    participant: s.participant,
    transcriptText: s.transcript.map((t) => t.text).join(" ").slice(0, 2000),
    durationSeconds: s.durationSeconds,
  }));

  const prompt = `You are a civic field research analyst specializing in community intelligence and systemic problem analysis.

Analyze these ${sessions.length} field interviews from "${area}":
${JSON.stringify(sessionSummaries, null, 2)}

Return ONLY a JSON object (no markdown):
{
  "issues": [
    {
      "id": "issue-1",
      "title": "concise issue title",
      "description": "2-3 sentences describing the issue as residents actually experience it — their language, not policy language",
      "score": {
        "severity": 4,
        "frequency": 3,
        "costToFix": 3,
        "timeToResolve": 3,
        "complexity": 4,
        "isSystemic": true,
        "systemicNote": "Root cause: national housing benefit cap + insufficient social housing supply since 1980s. Council can only manage symptoms without central government reform."
      },
      "compositeScore": 12,
      "quotes": [
        {
          "text": "direct quote from transcript",
          "sessionId": "session-id",
          "speakerDescription": "Retired resident, lifelong local, worried about..."
        }
      ],
      "relatedIssues": ["issue-2"]
    }
  ],
  "voices": [
    {
      "sessionId": "session-id",
      "positioningOneLiner": "Retired teacher, 67, Hackney local for 40 years — concerned about green space loss",
      "mainIssue": "issue-1",
      "keyQuote": "most memorable and revealing thing they said",
      "demographics": {
        "ageRange": "65+",
        "gender": "Female",
        "postcode": "E8 1DP",
        "description": "1-sentence description of their perspective"
      }
    }
  ]
}

Scoring guide:
- severity (1-5): 1=minor inconvenience, 3=significant daily impact, 5=crisis/health/safety
- frequency (1-N): exact count of sessions that raised this issue
- costToFix (1-5): 1=low cost operational change, 3=medium capital investment, 5=transformative spend (£tens of millions+)
- timeToResolve (1-5): 1=weeks (quick council decision), 2=months (planning/procurement), 3=1-2 years, 4=5+ years, 5=generational/decade+
- complexity (1-5): 1=operational fix (repave a road), 3=requires policy change, 5=structural/systemic (requires national policy, cultural shift, multi-agency)
- isSystemic: true if the ROOT CAUSE is outside the local council's direct control
- systemicNote: if isSystemic, explain WHY — what is the structural cause (national policy, market forces, legacy infrastructure, etc.)
- compositeScore = severity × frequency

IMPORTANT on systemic analysis: Don't duck-tape thinking. If housing is expensive, say WHY (land ownership patterns, planning restrictions, investment patterns). If crime is high, trace it (poverty, services cuts, opportunity gaps). Identify root causes, not just symptoms.

Sort issues by compositeScore descending. Identify 3-10 distinct issues. Extract ACTUAL quotes from transcripts.`;

  try {
    const text = await generateText(prompt);
    let jsonText = text.trim();
    const jsonMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch) jsonText = jsonMatch[1];
    res.json(JSON.parse(jsonText) as AnalysisResult);
  } catch (err) {
    console.error("[Analyze] Error:", err);
    res.status(500).json({ error: err instanceof Error ? err.message : "Analysis failed" });
  }
});

export default router;
