// ============================================================================
// Frank — Research routes
// POST /api/research/area    — deep area briefing via Brave search + Gemini
// POST /api/research/questions — generate interview questions for area
// ============================================================================

import { Router } from "express";
import { generateText } from "../gemini.js";
import { researchArea, braveSearch } from "../brave.js";
import { getAllCivicData } from "../civic-data.js";
import { getAirQuality, findInterviewLocations } from "../google-apis.js";

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
    const year = new Date().getFullYear();
    console.log(`[Research] Starting comprehensive research for: ${area}`);

    // Step 1: Run EVERYTHING in parallel — APIs + Brave Search + Google
    // Brave Search runs ALWAYS, not as fallback
    const [
      searchContext,
      govSearchResults,
      civicData,
      airQuality,
      places,
    ] = await Promise.all([
      // General area research via Brave
      researchArea(area),
      // Governance-specific Brave searches
      Promise.all([
        braveSearch(`"${area}" elected officials current ${year}`, 5),
        braveSearch(`"${area}" mayor council president chair ${year}`, 5),
        braveSearch(`"${area}" governor senator representative MP ${year}`, 5),
        braveSearch(`"${area}" school board district attorney sheriff ${year}`, 3),
        braveSearch(`"${area}" official government website .gov`, 3),
        braveSearch(`"${area}" council meeting minutes decisions transparency`, 3),
      ]).then(results => results.flat()),
      // Structured API data (UK postcodes, Parliament, Census, IMD)
      // Try to geocode and get civic data
      (async () => {
        try {
          const geoRes = await fetch(`http://localhost:4742/api/geocode/search?q=${encodeURIComponent(area)}`);
          const geoData = await geoRes.json() as any;
          const result = geoData?.results?.[0];
          if (!result) return null;
          // Try reverse to get postcode
          const revRes = await fetch(`http://localhost:4742/api/geocode/reverse?lat=${result.lat}&lng=${result.lng}`);
          const revData = await revRes.json() as any;
          const postcode = revData?.address?.postcode;
          if (postcode) {
            return getAllCivicData({ postcode });
          }
          return getAllCivicData({ lat: result.lat, lng: result.lng });
        } catch { return null; }
      })(),
      // Air quality
      (async () => {
        try {
          const geoRes = await fetch(`http://localhost:4742/api/geocode/search?q=${encodeURIComponent(area)}`);
          const geo = await geoRes.json() as any;
          const r = geo?.results?.[0];
          if (!r) return null;
          return getAirQuality(r.lat, r.lng);
        } catch { return null; }
      })(),
      // Nearby places for interview locations
      (async () => {
        try {
          const geoRes = await fetch(`http://localhost:4742/api/geocode/search?q=${encodeURIComponent(area)}`);
          const geo = await geoRes.json() as any;
          const r = geo?.results?.[0];
          if (!r) return null;
          return findInterviewLocations(r.lat, r.lng);
        } catch { return null; }
      })(),
    ]);

    // Build a comprehensive context string with ALL data for Gemini
    const govContext = govSearchResults.map(r => `[${r.title}] ${r.description} (${r.url})`).join("\n");

    // Format API data as context
    let apiContext = "";
    if (civicData) {
      if (civicData.representatives?.length > 0) {
        apiContext += "\n\nVERIFIED REPRESENTATIVES (from official API):\n";
        civicData.representatives.forEach(r => {
          apiContext += `- ${r.name.value} (${r.party.value}) — ${r.constituency.value} [source: ${r.name.source}]\n`;
        });
      }
      if (civicData.census?.length > 0) {
        apiContext += "\n\nCENSUS DATA (from official API):\n";
        civicData.census.forEach(t => {
          apiContext += `${t.topic}: total ${t.total}\n`;
          t.breakdown.slice(0, 5).forEach(b => {
            apiContext += `  - ${b.category}: ${b.count}\n`;
          });
        });
      }
      if (civicData.deprivation?.imdDecile) {
        apiContext += `\n\nDEPRIVATION: IMD Decile ${civicData.deprivation.imdDecile.value}/10, Rank ${civicData.deprivation.imdRank?.value}/33755\n`;
      }
    }
    if (airQuality) {
      apiContext += `\n\nAIR QUALITY: AQI ${airQuality.aqi} (${airQuality.category}), dominant pollutant: ${airQuality.dominantPollutant}\n`;
    }

    // Format interview locations from Google Places
    let placesContext = "";
    if (places) {
      const allPlaces = [
        ...((places.communitySpaces || []).map(p => ({ ...p, type: "community centre" }))),
        ...((places.religiousSpaces || []).map(p => ({ ...p, type: "religious space" }))),
        ...((places.markets || []).map(p => ({ ...p, type: "market/shop" }))),
        ...((places.parks || []).map(p => ({ ...p, type: "park" }))),
        ...((places.cafes || []).map(p => ({ ...p, type: "cafe" }))),
      ];
      if (allPlaces.length > 0) {
        placesContext = "\n\nREAL NEARBY PLACES (from Google Places API):\n";
        allPlaces.slice(0, 15).forEach(p => {
          placesContext += `- ${p.name} (${p.type}) — ${p.address}\n`;
        });
      }
    }

    const hasSearch = searchContext.trim().length > 0;
    const searchSection = hasSearch
      ? `WEB SEARCH RESULTS:\n${searchContext}\n\nGOVERNANCE SEARCH RESULTS:\n${govContext}${apiContext}${placesContext}\n\nUsing ALL the data above, produce`
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

    // Step 3: Enrich governing bodies — find official URLs and verify via Brave
    // The data is already good because Gemini had real search results + API data
    // Now just find official URLs for each body
    if (briefing.governingBodies?.length > 0) {
      const enriched = await Promise.all(
        briefing.governingBodies.map(async (gov) => {
          // Clean any leftover tags
          gov.representative = (gov.representative || "").replace(/\s*\((?:un)?verified?\)/gi, "").trim();

          try {
            // Find official URL if not already set
            if (!gov.officialUrl) {
              const results = await braveSearch(`"${gov.name}" official website`, 2);
              if (results.length > 0) {
                gov.officialUrl = results[0].url;
              }
            }
          } catch { /* continue */ }

          return gov;
        })
      );
      briefing.governingBodies = enriched;
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
