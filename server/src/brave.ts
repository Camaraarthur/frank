// ============================================================================
// Frank — Brave Search client
// Runs targeted searches and returns web results as context for Gemini
// ============================================================================

interface BraveResult {
  title: string;
  url: string;
  description: string;
}

interface BraveSearchResponse {
  web?: {
    results?: Array<{
      title: string;
      url: string;
      description: string;
    }>;
  };
}

const BRAVE_API_KEY = process.env.BRAVE_API_KEY;
// Brave Search is optional — if not configured, research falls back to Gemini-only mode

export async function braveSearch(query: string, count = 8): Promise<BraveResult[]> {
  if (!BRAVE_API_KEY) return [];

  const url = `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=${count}&search_lang=en`;

  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
      "Accept-Encoding": "gzip",
      "X-Subscription-Token": BRAVE_API_KEY,
    },
  });

  if (!res.ok) {
    console.error(`[Brave] Search failed: ${res.status} ${res.statusText}`);
    return [];
  }

  const data = (await res.json()) as BraveSearchResponse;
  return (data.web?.results ?? []).map((r) => ({
    title: r.title,
    url: r.url,
    description: r.description,
  }));
}

// Run multiple searches in parallel for area research
export async function researchArea(area: string): Promise<string> {
  const queries = [
    `${area} ward councillor elected representative party policies recent`,
    `${area} borough council controversial issues planning complaints recent`,
    `${area} census demographics population deprivation statistics`,
    `${area} local news problems residents complaints recent`,
    `${area} housing transport green spaces community issues`,
    `${area} mayor MP local government current priorities`,
    `${area} council budget cuts services recent`,
  ];

  console.log(`[Brave] Running ${queries.length} searches for: ${area}`);

  const results = await Promise.all(queries.map((q) => braveSearch(q, 5)));

  // Format all results as context text for Gemini
  const contextParts: string[] = [];
  queries.forEach((query, i) => {
    const queryResults = results[i];
    if (queryResults.length === 0) return;
    contextParts.push(`\n=== Search: "${query}" ===`);
    queryResults.forEach((r) => {
      contextParts.push(`[${r.title}]\n${r.description}\nSource: ${r.url}`);
    });
  });

  return contextParts.join("\n\n");
}

// Run targeted searches for policy research on a specific issue
export async function researchPolicy(area: string, issue: string): Promise<string> {
  const queries = [
    `${area} council policy ${issue} recent action`,
    `UK local council ${issue} solutions case studies`,
    `${issue} council department responsible UK local government`,
    `${issue} policy cost estimate UK local authority`,
  ];

  const results = await Promise.all(queries.map((q) => braveSearch(q, 4)));

  const contextParts: string[] = [];
  queries.forEach((query, i) => {
    const queryResults = results[i];
    if (queryResults.length === 0) return;
    contextParts.push(`\n=== Search: "${query}" ===`);
    queryResults.forEach((r) => {
      contextParts.push(`[${r.title}]\n${r.description}\nSource: ${r.url}`);
    });
  });

  return contextParts.join("\n\n");
}
