// ============================================================================
// Frank — Research routes
// POST /api/research/area    — deep area briefing via Brave search + Gemini
// POST /api/research/questions — generate interview questions for area
// ============================================================================

import { Router } from "express";
import { generateText } from "../gemini.js";
import { researchArea } from "../brave.js";

const router = Router();

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

// POST /api/research/area
router.post("/area", async (req, res) => {
  const { area, entityType } = req.body as { area: string; entityType?: string };

  if (!area) return res.status(400).json({ error: "area is required" });

  try {
    // Step 1: Brave search — parallel queries for this area
    const searchContext = await researchArea(area);

    // Step 2: Gemini synthesises into structured briefing
    const hasSearch = searchContext.trim().length > 0;
    const searchSection = hasSearch
      ? `SEARCH RESULTS:\n${searchContext}\n\nBased on the search results above, produce`
      : `Using your knowledge, produce`;

    const prompt = `You are a civic intelligence researcher${hasSearch ? " synthesising web search results into a structured area briefing" : " producing a structured area briefing"}.

${searchSection} a comprehensive briefing on "${area}" for a ${entityType || "researcher"}.

Return ONLY a JSON object with this exact structure (no markdown, no explanation):
{
  "area": "${area}",
  "summary": "2-3 sentence overview of the area's current political and social landscape",
  "governingBodies": [
    {
      "level": "ward|borough|city|regional|national",
      "name": "governing body name",
      "representative": "elected representative name",
      "party": "party name or null",
      "keyPolicies": ["specific policy or stance 1", "specific policy or stance 2", "specific policy or stance 3"]
    }
  ],
  "contestedIssues": [
    {
      "title": "specific issue title",
      "description": "2-3 sentence description of the issue and why it is contested",
      "severity": "high|medium|low",
      "sources": ["source description or URL"]
    }
  ],
  "demographics": {
    "population": 12345,
    "highlights": ["key demographic fact", "key demographic fact", "key demographic fact", "key demographic fact"]
  },
  "suggestedLocations": [
    {
      "name": "specific location name",
      "reason": "why this captures diverse voices"
    }
  ],
  "interviewThemes": ["specific theme tied to real issues found", "theme 2", "theme 3", "theme 4", "theme 5"]
}

Requirements:
- List ALL governing bodies from ward level up through national (MP/Senator/etc)
- Include current elected representatives with party affiliations
- Contested issues must be grounded in the search results — real current issues
- Use actual census/demographic data where available in results
- Suggest 4-6 specific real locations that would capture diverse voices
- Interview themes should be specific to this area's actual issues`;

    const text = await generateText(prompt);

    let jsonText = text.trim();
    const jsonMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch) jsonText = jsonMatch[1];

    const briefing = JSON.parse(jsonText) as AreaBriefing;
    res.json(briefing);
  } catch (err) {
    console.error("[Research] Error:", err);
    res.status(500).json({ error: err instanceof Error ? err.message : "Research failed" });
  }
});

// POST /api/research/questions
router.post("/questions", async (req, res) => {
  const { area, themes, entityType } = req.body as {
    area: string;
    themes?: string[];
    entityType?: string;
  };

  if (!area) return res.status(400).json({ error: "area is required" });

  const themesText = themes?.length ? `Focus especially on these themes: ${themes.join(", ")}.` : "";

  const prompt = `Generate Mom Test-style interview questions for a civic researcher investigating "${area}". ${themesText}

The researcher is a ${entityType || "researcher"}. Questions must:
- Follow Rob Fitzpatrick's Mom Test: ask about past behaviour, not opinions or hypotheticals
- Be about the respondent's actual lived experience in ${area}
- Avoid leading questions or yes/no answers
- Start broad then get specific
- Feel like natural conversation, not a survey

Return JSON only (no markdown):
{
  "warmup": ["question 1", "question 2"],
  "dailyLife": ["question 1", "question 2", "question 3"],
  "challenges": ["question 1", "question 2", "question 3"],
  "community": ["question 1", "question 2", "question 3"],
  "services": ["question 1", "question 2"],
  "closing": ["question 1", "question 2"]
}`;

  try {
    const text = await generateText(prompt);
    let jsonText = text.trim();
    const jsonMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch) jsonText = jsonMatch[1];
    res.json(JSON.parse(jsonText));
  } catch (err) {
    console.error("[Research/Questions] Error:", err);
    res.status(500).json({ error: err instanceof Error ? err.message : "Failed to generate questions" });
  }
});

export default router;
