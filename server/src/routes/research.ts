// ============================================================================
// Frank — Research routes
// POST /api/research/area    — deep area briefing via Brave search + Gemini
// POST /api/research/questions — generate interview questions for area
// ============================================================================

import { Router } from "express";
import { generateText } from "../gemini.js";
import { researchArea, braveSearch } from "../brave.js";

const router = Router();

export interface AreaBriefing {
  area: string;
  summary: string;
  governingBodies: Array<{
    level: string;
    name: string;
    representative: string;
    party?: string;
    termDates?: string;
    officialUrl?: string;
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
    // Include specific governance queries to build complete hierarchy
    const [searchContext, govContext] = await Promise.all([
      researchArea(area),
      Promise.all([
        braveSearch(`"${area}" complete list elected officials representatives ${new Date().getFullYear()}`, 5),
        braveSearch(`"${area}" mayor city council board supervisors aldermen ${new Date().getFullYear()}`, 5),
        braveSearch(`"${area}" state governor senator representative congress ${new Date().getFullYear()}`, 5),
        braveSearch(`"${area}" school board district attorney sheriff police chief ${new Date().getFullYear()}`, 5),
        braveSearch(`"${area}" planning commission transport authority local agencies ${new Date().getFullYear()}`, 3),
      ]).then(results => {
        return results.flat().map(r => `[${r.title}] ${r.description} (${r.url})`).join("\n");
      }),
    ]);

    // Step 2: Gemini synthesises into structured briefing
    const hasSearch = searchContext.trim().length > 0;
    const searchSection = hasSearch
      ? `SEARCH RESULTS:\n${searchContext}\n\nBased on the search results above, produce`
      : `Using your knowledge, produce`;

    const prompt = `You are a civic intelligence researcher${hasSearch ? " synthesising web search results into a structured area briefing" : " producing a structured area briefing"}.

${searchSection} a comprehensive briefing on "${area}" for a ${entityType || "researcher"}.

GOVERNANCE SEARCH RESULTS:
${govContext}

Return ONLY a JSON object with this exact structure (no markdown, no explanation):
{
  "area": "${area}",
  "summary": "2-3 sentence overview of the area's current political and social landscape",
  "governingBodies": [
    {
      "level": "neighborhood|ward|city|county|regional|state|national",
      "name": "governing body name",
      "representative": "current elected representative name",
      "party": "party name or null",
      "termDates": "e.g. since 2020, or 2022-2026, or null if unknown",
      "officialUrl": "URL to the official page of this body or representative, or null",
      "keyPolicies": ["specific policy or stance"]
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

CRITICAL requirements for governingBodies:
- Build a COMPLETE tree from the smallest local unit up to national head of state
- Include EVERY level: neighborhood/ward council, city council/board of supervisors (ALL members for the district), mayor, county, state legislature (both chambers), governor, federal representatives (house + senate), president/PM
- Also include: district attorney, city attorney, sheriff, school board, transit authority, planning commission — any body that makes decisions affecting residents
- Each entry must have the CURRENT person's name (from the search results, not from memory)
- For each representative, include their term dates if known (e.g. "since 2020" or "2022-2026")
- Do NOT add "(verify)" or "(unverified)" — only include names you found in the search results
- For city councils with multiple members, list the one(s) representing THIS specific area/district
- Minimum 10 governing bodies for any city, minimum 15 for large cities

Other requirements:
- Contested issues must be grounded in the search results — cite the source URL
- Use actual census/demographic data where available
- Suggest 4-6 specific real locations that would capture diverse voices
- Interview themes should be specific to this area's actual issues`;

    const text = await generateText(prompt);

    let jsonText = text.trim();
    const jsonMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch) jsonText = jsonMatch[1];

    const briefing = JSON.parse(jsonText) as AreaBriefing;

    // Step 3: Verify AND enrich governing bodies via Brave Search
    // Bad information is worse than no information — verify every name
    if (briefing.governingBodies?.length > 0) {
      const year = new Date().getFullYear();
      const verified = await Promise.all(
        briefing.governingBodies.map(async (gov) => {
          // Clean up any (verify) or (unverified) tags from Gemini
          gov.representative = (gov.representative || "").replace(/\s*\((?:un)?verified?\)/gi, "").trim();
          if (!gov.representative || gov.representative === "null") return gov;

          try {
            // Strategy 1: Search for the person + role directly
            const results = await braveSearch(`"${gov.representative}" ${gov.name} ${year}`, 3);
            const nameWords = gov.representative.toLowerCase().split(/\s+/).filter(w => w.length > 2);

            const nameInResults = results.some((r) => {
              const text = (r.title + " " + r.description).toLowerCase();
              return nameWords.filter(w => text.includes(w)).length >= Math.min(2, nameWords.length);
            });

            if (nameInResults) {
              // Found — extract source URL and try to find term dates
              const bestUrl = results[0]?.url || "";
              if (!gov.officialUrl) gov.officialUrl = bestUrl;
              return gov;
            }

            // Strategy 2: Search for who currently holds this position
            const roleWord = gov.level === "national" ? "president prime minister" :
              gov.level === "state" || gov.level === "regional" ? "governor president" :
              gov.level === "county" ? "president chair" : "mayor president chair";
            const correctionResults = await braveSearch(
              `current ${roleWord} "${gov.name}" ${year}`, 5
            );

            if (correctionResults.length > 0) {
              // Ask Gemini to extract the correct name with term dates
              const extractPrompt = `From these search results, who is the CURRENT leader/representative of "${gov.name}" as of ${year}?

Return ONLY JSON (no markdown): {"name": "full name", "party": "party or null", "termStart": "YYYY-MM-DD or YYYY", "termEnd": "YYYY-MM-DD or YYYY or null if ongoing", "source": "best URL"}
If truly unclear, return: {"name": null}

Results:
${correctionResults.slice(0, 4).map(r => `[${r.title}] ${r.description} (${r.url})`).join("\n")}`;

              const extracted = await generateText(extractPrompt);
              const match = extracted.match(/\{[\s\S]*?\}/);
              if (match) {
                const parsed = JSON.parse(match[0]);
                if (parsed.name && parsed.name !== "null") {
                  gov.representative = parsed.name;
                  if (parsed.party) gov.party = parsed.party;
                  if (parsed.termStart) {
                    const start = parsed.termStart;
                    const end = parsed.termEnd || "present";
                    gov.termDates = `${start} – ${end}`;
                  }
                  if (parsed.source) gov.officialUrl = parsed.source;
                  return gov;
                }
              }
            }

            // Strategy 3: If still can't verify, try one more with different phrasing
            const lastTry = await braveSearch(`${gov.name} official website elected representative ${year}`, 3);
            if (lastTry.length > 0) {
              gov.officialUrl = lastTry[0]?.url || gov.officialUrl;
            }

            // If we still have the original name but couldn't verify, keep it but note the source
            // Don't say "unverified" — just don't add a verification badge
            return gov;
          } catch {
            return gov;
          }
        })
      );
      briefing.governingBodies = verified;
    }

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
