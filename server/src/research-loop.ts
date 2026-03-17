// ============================================================================
// Frank — Iterative Research Loop
// Gemini thinks → Brave searches → reads results → thinks again → searches more
// Like a human researcher: search, read, identify gaps, search again
// ============================================================================

import { generateText } from "./gemini.js";
import { braveSearch } from "./brave.js";
import { getAllCivicData } from "./civic-data.js";
import { getAirQuality, findInterviewLocations } from "./google-apis.js";

interface ResearchState {
  area: string;
  country: string;
  lat: number | null;
  lng: number | null;
  searches: Array<{ query: string; results: string }>;
  apiData: string;
  iterations: number;
  findings: string;
}

// One iteration of the research loop
async function researchIteration(
  state: ResearchState,
  purpose: string
): Promise<{ queries: string[]; analysis: string; gaps: string[]; done: boolean }> {

  const prompt = `You are researching "${state.area}" (${state.country}). ${purpose}

WHAT YOU KNOW SO FAR (from ${state.iterations} previous search rounds):
${state.findings || "Nothing yet — this is the first round."}

API DATA (verified, from official sources):
${state.apiData || "No API data available."}

PREVIOUS SEARCHES:
${state.searches.slice(-10).map(s => `Query: "${s.query}"\n${s.results.slice(0, 500)}`).join("\n\n")}

Based on what you know and DON'T know yet, do two things:

1. ANALYZE what you've found. Write 2-3 sentences of findings.
2. List what's STILL MISSING or UNVERIFIED — gaps in your knowledge.
3. Generate 2-4 NEW search queries to fill those gaps. Be specific. Include the year ${new Date().getFullYear()}.
   - If you don't know the mayor/leader's name → search for it specifically
   - If you found a name but can't verify → search the official .gov website
   - If you need voting records → search for council minutes
   - If you need to verify a fact → search for the primary source

Return ONLY JSON:
{
  "analysis": "what you now understand about this area",
  "gaps": ["specific thing you still need to verify", "another gap"],
  "queries": ["specific brave search query 1", "query 2"],
  "done": false
}

Set done=true ONLY when you are confident about: the current leader's name (verified from official source), the key governing bodies, and at least 2-3 current issues. If you still have gaps, done=false.`;

  const text = await generateText(prompt);
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return { queries: [], analysis: "", gaps: ["Parse error"], done: true };

  try {
    return JSON.parse(match[0]);
  } catch {
    return { queries: [], analysis: text.slice(0, 200), gaps: ["Parse error"], done: true };
  }
}

// Main research loop
export async function deepResearch(
  area: string,
  onProgress?: (step: string) => void
): Promise<{
  findings: string;
  searches: Array<{ query: string; results: string }>;
  apiData: string;
  iterations: number;
}> {
  const year = new Date().getFullYear();

  // Geocode to get country
  let country = "unknown";
  let lat: number | null = null;
  let lng: number | null = null;

  try {
    const geoRes = await fetch(`http://localhost:4742/api/geocode/search?q=${encodeURIComponent(area)}`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const geoData = await geoRes.json() as any;
    const r = geoData?.results?.[0];
    if (r) {
      lat = r.lat;
      lng = r.lng;
      const revRes = await fetch(`http://localhost:4742/api/geocode/reverse?lat=${r.lat}&lng=${r.lng}`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const revData = await revRes.json() as any;
      country = revData?.address?.country || "unknown";
    }
  } catch { /* continue */ }

  onProgress?.(`Identified: ${area} in ${country}`);

  // Get API data in parallel with first search round
  let apiData = "";
  const [civicData, airQuality, places] = await Promise.all([
    (async () => {
      try {
        if (lat && lng) return getAllCivicData({ lat, lng });
        return null;
      } catch { return null; }
    })(),
    (async () => {
      try {
        if (lat && lng) return getAirQuality(lat, lng);
        return null;
      } catch { return null; }
    })(),
    (async () => {
      try {
        if (lat && lng) return findInterviewLocations(lat, lng);
        return null;
      } catch { return null; }
    })(),
  ]);

  if (civicData?.representatives?.length) {
    apiData += "VERIFIED REPRESENTATIVES:\n";
    civicData.representatives.forEach(r => {
      apiData += `- ${r.name.value} (${r.party.value}) — ${r.constituency.value} [${r.name.source}]\n`;
    });
  }
  if (civicData?.deprivation?.imdDecile) {
    apiData += `\nDEPRIVATION: Decile ${civicData.deprivation.imdDecile.value}/10\n`;
  }
  if (airQuality) {
    apiData += `\nAIR QUALITY: AQI ${airQuality.aqi} (${airQuality.category})\n`;
  }

  // Initial broad searches
  const initialQueries = [
    `"${area}" current mayor leader government official ${year}`,
    `"${area}" council government official website site:.gov`,
    `"${area}" local issues problems residents ${year}`,
    `"${area}" elected representatives council members ${year}`,
  ];

  const state: ResearchState = {
    area,
    country,
    lat,
    lng,
    searches: [],
    apiData,
    iterations: 0,
    findings: "",
  };

  // Run initial searches
  onProgress?.("Running initial searches...");
  const initialResults = await Promise.all(initialQueries.map(q => braveSearch(q, 5)));
  initialQueries.forEach((q, i) => {
    const formatted = initialResults[i].map(r => `[${r.title}] ${r.description} (${r.url})`).join("\n");
    state.searches.push({ query: q, results: formatted });
  });

  // Research loop — max 4 iterations
  const MAX_ITERATIONS = 4;
  for (let i = 0; i < MAX_ITERATIONS; i++) {
    state.iterations = i + 1;
    onProgress?.(`Research round ${i + 1}/${MAX_ITERATIONS}...`);

    const purpose = i === 0
      ? "This is your first analysis. Identify who governs this area and what the key issues are."
      : `This is round ${i + 1}. Fill the gaps identified in the previous round.`;

    const result = await researchIteration(state, purpose);

    // Update findings
    state.findings = result.analysis;

    if (result.done || result.queries.length === 0) {
      onProgress?.(`Research complete after ${i + 1} rounds`);
      break;
    }

    // Run new searches
    const newResults = await Promise.all(
      result.queries.slice(0, 4).map(q => braveSearch(q, 4))
    );
    result.queries.slice(0, 4).forEach((q, qi) => {
      const formatted = newResults[qi].map(r => `[${r.title}] ${r.description} (${r.url})`).join("\n");
      state.searches.push({ query: q, results: formatted });
    });
  }

  return {
    findings: state.findings,
    searches: state.searches,
    apiData: state.apiData,
    iterations: state.iterations,
  };
}

// Final synthesis — takes ALL research data and produces the structured briefing
export async function synthesizeBriefing(
  area: string,
  research: Awaited<ReturnType<typeof deepResearch>>
): Promise<string> {
  const year = new Date().getFullYear();

  const allSearchResults = research.searches
    .map(s => `Query: "${s.query}"\n${s.results}`)
    .join("\n\n---\n\n");

  const prompt = `You are producing a final structured briefing for "${area}" based on ${research.iterations} rounds of deep research.

CRITICAL RULE: You may ONLY include politician names that appear in the search results or API data below. Do NOT use your training data for names. If you cannot find a name, set representative to null.

API DATA (verified):
${research.apiData}

ALL SEARCH RESULTS (${research.searches.length} searches):
${allSearchResults}

RESEARCH FINDINGS:
${research.findings}

Return ONLY a JSON object:
{
  "area": "${area}",
  "summary": "2-3 sentence overview based on what the research found",
  "governingBodies": [
    {
      "level": "neighborhood|ward|city|county|regional|state|national",
      "name": "governing body name",
      "representative": "name ONLY if found in search results above, null if not found",
      "party": "party or null",
      "termDates": "e.g. since 2023, or 2022-2026, from the search results",
      "officialUrl": "the .gov or official URL found in search results",
      "keyPolicies": ["specific policy found in search results"]
    }
  ],
  "contestedIssues": [
    {
      "title": "issue title",
      "description": "description grounded in search results",
      "severity": "high|medium|low",
      "sources": ["actual URL from search results"]
    }
  ],
  "demographics": {
    "population": null,
    "highlights": ["fact from search results"]
  },
  "suggestedLocations": [
    {"name": "real place name", "reason": "why interview here"}
  ],
  "interviewThemes": ["theme tied to issues found"]
}

ORDER governing bodies: most local FIRST (neighborhood → city → regional → national).
List ALL sub-divisions found (all wards/districts/neighborhoods with their leaders).
Minimum 10 governing bodies. Include transit, police, health, education authorities.
Every name must come from the data above — not from your memory.`;

  return generateText(prompt);
}
