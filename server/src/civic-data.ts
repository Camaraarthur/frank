// ============================================================================
// Frank — Civic Data APIs
// Real structured data from official UK government sources.
// Every data point includes source attribution with URL.
// ============================================================================

// ---------------------------------------------------------------------------
// Types — every field carries its source
// ---------------------------------------------------------------------------

export interface SourcedValue<T> {
  value: T;
  source: string;
  sourceUrl: string;
}

export interface Representative {
  name: SourcedValue<string>;
  party: SourcedValue<string>;
  constituency: SourcedValue<string>;
  thumbnailUrl: SourcedValue<string | null>;
  profileUrl: SourcedValue<string>;
  house: SourcedValue<string>;
}

export interface AreaGeography {
  postcode: SourcedValue<string | null>;
  ward: SourcedValue<string | null>;
  wardCode: SourcedValue<string | null>;
  constituency: SourcedValue<string | null>;
  constituencyCode: SourcedValue<string | null>;
  adminDistrict: SourcedValue<string | null>;
  adminDistrictCode: SourcedValue<string | null>;
  lsoa: SourcedValue<string | null>;
  lsoaCode: SourcedValue<string | null>;
  msoa: SourcedValue<string | null>;
  region: SourcedValue<string | null>;
}

export interface DeprivationData {
  imdRank: SourcedValue<number | null>;
  imdDecile: SourcedValue<number | null>;
  imdScore: SourcedValue<number | null>;
  incomeRank: SourcedValue<number | null>;
  employmentRank: SourcedValue<number | null>;
  educationRank: SourcedValue<number | null>;
  healthRank: SourcedValue<number | null>;
  crimeRank: SourcedValue<number | null>;
  housingRank: SourcedValue<number | null>;
  livingEnvironmentRank: SourcedValue<number | null>;
}

export interface CensusTopicData {
  topic: string;
  source: string;
  sourceUrl: string;
  total: number | null;
  breakdown: Array<{ category: string; count: number; percentage?: number }>;
}

export interface CivicAreaData {
  geography: AreaGeography | null;
  representatives: Representative[];
  deprivation: DeprivationData | null;
  census: CensusTopicData[];
  errors: string[];
  fetchedAt: string;
}

// ---------------------------------------------------------------------------
// Postcodes.io — resolve lat/lng or postcode to area codes
// ---------------------------------------------------------------------------

interface PostcodesIoResult {
  postcode: string;
  admin_ward: string;
  admin_district: string;
  parliamentary_constituency: string;
  lsoa: string;
  msoa: string;
  region: string;
  codes: {
    admin_ward: string;
    admin_district: string;
    parliamentary_constituency: string;
    lsoa: string;
    msoa: string;
  };
}

const POSTCODES_IO = "https://api.postcodes.io";

export async function resolvePostcode(postcode: string): Promise<PostcodesIoResult | null> {
  try {
    const url = `${POSTCODES_IO}/postcodes/${encodeURIComponent(postcode.replace(/\s+/g, ""))}`;
    console.log(`[CivicData] Postcodes.io lookup: ${url}`);
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`[CivicData] Postcodes.io error: ${res.status}`);
      return null;
    }
    const data = await res.json() as { status: number; result: PostcodesIoResult };
    return data.result ?? null;
  } catch (err) {
    console.error("[CivicData] Postcodes.io failed:", err);
    return null;
  }
}

export async function reverseGeocode(lat: number, lng: number): Promise<PostcodesIoResult | null> {
  try {
    const url = `${POSTCODES_IO}/postcodes?lon=${lng}&lat=${lat}&limit=1`;
    console.log(`[CivicData] Postcodes.io reverse geocode: ${url}`);
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`[CivicData] Postcodes.io reverse error: ${res.status}`);
      return null;
    }
    const data = await res.json() as { status: number; result: PostcodesIoResult[] | null };
    return data.result?.[0] ?? null;
  } catch (err) {
    console.error("[CivicData] Postcodes.io reverse failed:", err);
    return null;
  }
}

function buildGeography(pc: PostcodesIoResult): AreaGeography {
  const postcodesUrl = `https://api.postcodes.io/postcodes/${encodeURIComponent(pc.postcode)}`;
  const src = (val: string | null) => ({
    value: val,
    source: "Postcodes.io (ONS data)",
    sourceUrl: postcodesUrl,
  });
  return {
    postcode: src(pc.postcode),
    ward: src(pc.admin_ward),
    wardCode: src(pc.codes?.admin_ward ?? null),
    constituency: src(pc.parliamentary_constituency),
    constituencyCode: src(pc.codes?.parliamentary_constituency ?? null),
    adminDistrict: src(pc.admin_district),
    adminDistrictCode: src(pc.codes?.admin_district ?? null),
    lsoa: src(pc.lsoa),
    lsoaCode: src(pc.codes?.lsoa ?? null),
    msoa: src(pc.msoa),
    region: src(pc.region),
  };
}

// ---------------------------------------------------------------------------
// UK Parliament Members API — NO API key required
// ---------------------------------------------------------------------------

const PARLIAMENT_API = "https://members-api.parliament.uk/api";

interface ParliamentMemberSearchResponse {
  items: Array<{
    value: {
      id: number;
      nameDisplayAs: string;
      latestParty: { name: string };
      latestHouseMembership: {
        membershipFrom: string;
        house: number; // 1 = Commons, 2 = Lords
      };
      thumbnailUrl: string;
    };
  }>;
}

export async function getRepresentatives(postcode: string): Promise<Representative[]> {
  // The Parliament Members API PostCode param does text search, not constituency lookup.
  // Correct approach: resolve postcode -> constituency via postcodes.io, then search by constituency.
  const results: Representative[] = [];

  // Step 1: Resolve postcode to constituency name
  const pcData = await resolvePostcode(postcode);
  if (!pcData?.parliamentary_constituency) {
    console.error("[CivicData] Cannot resolve postcode to constituency");
    return results;
  }

  const constituency = pcData.parliamentary_constituency;
  console.log(`[CivicData] Resolved ${postcode} -> constituency: ${constituency}`);

  // Step 2: Search Parliament API by constituency name
  const constituencyReps = await getLocalPoliticians(constituency);
  results.push(...constituencyReps);

  // Fallback: TheyWorkForYou (if API key available and no results)
  const twfyKey = process.env.TWFY_API_KEY;
  if (twfyKey && results.length === 0) {
    try {
      const cleanPostcode = postcode.replace(/\s+/g, "+");
      const url = `https://www.theyworkforyou.com/api/getMP?postcode=${encodeURIComponent(cleanPostcode)}&output=json&key=${twfyKey}`;
      console.log(`[CivicData] TheyWorkForYou fallback`);
      const res = await fetch(url);
      if (res.ok) {
        const mp = await res.json() as {
          full_name?: string;
          party?: string;
          constituency?: string;
          image?: string;
          member_id?: number;
        };
        if (mp.full_name) {
          const profileUrl = `https://www.theyworkforyou.com/mp/${mp.member_id}`;
          results.push({
            name: { value: mp.full_name, source: "TheyWorkForYou", sourceUrl: profileUrl },
            party: { value: mp.party ?? "Unknown", source: "TheyWorkForYou", sourceUrl: profileUrl },
            constituency: { value: mp.constituency ?? "Unknown", source: "TheyWorkForYou", sourceUrl: profileUrl },
            thumbnailUrl: { value: mp.image ?? null, source: "TheyWorkForYou", sourceUrl: profileUrl },
            profileUrl: { value: profileUrl, source: "TheyWorkForYou", sourceUrl: profileUrl },
            house: { value: "Commons", source: "TheyWorkForYou", sourceUrl: profileUrl },
          });
        }
      }
    } catch (err) {
      console.error("[CivicData] TheyWorkForYou fallback failed:", err);
    }
  }

  return results;
}

// ---------------------------------------------------------------------------
// Parliament Members by constituency name
// ---------------------------------------------------------------------------

export async function getLocalPoliticians(constituency: string): Promise<Representative[]> {
  const results: Representative[] = [];
  try {
    const url = `${PARLIAMENT_API}/Members/Search?House=1&IsCurrentMember=true&skip=0&take=20`;
    console.log(`[CivicData] Parliament API constituency search for: ${constituency}`);
    // The Members API doesn't support direct constituency text search easily,
    // but we can search by name. Use the /Location/Constituency/Search endpoint instead.
    const searchUrl = `${PARLIAMENT_API}/Location/Constituency/Search?searchText=${encodeURIComponent(constituency)}&skip=0&take=5`;
    const searchRes = await fetch(searchUrl);
    if (!searchRes.ok) {
      console.error(`[CivicData] Constituency search error: ${searchRes.status}`);
      return results;
    }
    const searchData = await searchRes.json() as {
      items: Array<{
        value: {
          id: number;
          name: string;
          currentRepresentation?: {
            member?: {
              value?: {
                id: number;
                nameDisplayAs: string;
                latestParty: { name: string };
                thumbnailUrl: string;
              };
            };
          };
        };
      }>;
    };

    for (const item of searchData.items ?? []) {
      const c = item.value;
      const member = c.currentRepresentation?.member?.value;
      if (member) {
        const profileUrl = `https://members.parliament.uk/member/${member.id}/contact`;
        results.push({
          name: { value: member.nameDisplayAs, source: "UK Parliament", sourceUrl: searchUrl },
          party: { value: member.latestParty?.name ?? "Unknown", source: "UK Parliament", sourceUrl: searchUrl },
          constituency: { value: c.name, source: "UK Parliament", sourceUrl: searchUrl },
          thumbnailUrl: { value: member.thumbnailUrl ?? null, source: "UK Parliament", sourceUrl: searchUrl },
          profileUrl: { value: profileUrl, source: "UK Parliament", sourceUrl: profileUrl },
          house: { value: "Commons", source: "UK Parliament", sourceUrl: searchUrl },
        });
      }
    }
  } catch (err) {
    console.error("[CivicData] Local politicians lookup failed:", err);
  }
  return results;
}

// ---------------------------------------------------------------------------
// Census data via Nomis API — NO API key needed (25k cell limit)
// ---------------------------------------------------------------------------

const NOMIS_API = "https://www.nomisweb.co.uk/api/v01";

interface NomisGeographySearchResponse {
  structure?: {
    codelists?: {
      codelist?: Array<{
        code?: Array<{
          value: string;
          description?: { value: string };
          annotations?: {
            annotation?: Array<{
              annotationtitle: string;
              annotationtext: string;
            }>;
          };
        }> | {
          value: string;
          description?: { value: string };
          annotations?: {
            annotation?: Array<{
              annotationtitle: string;
              annotationtext: string;
            }>;
          };
        };
      }>;
    };
  };
}

async function findNomisWardId(wardName: string, wardGssCode: string): Promise<string | null> {
  try {
    const url = `${NOMIS_API}/dataset/NM_2041_1/geography/TYPE153.def.sdmx.json?search=*${encodeURIComponent(wardName)}*`;
    console.log(`[CivicData] Nomis ward search: ${wardName}`);
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json() as NomisGeographySearchResponse;
    const codelist = data.structure?.codelists?.codelist?.[0];
    if (!codelist) return null;

    const codes = Array.isArray(codelist.code) ? codelist.code : codelist.code ? [codelist.code] : [];
    for (const code of codes) {
      const anns = code.annotations?.annotation;
      if (!anns) continue;
      const annMap: Record<string, string> = {};
      for (const a of (Array.isArray(anns) ? anns : [anns])) {
        annMap[a.annotationtitle] = a.annotationtext;
      }
      if (annMap["GeogCode"] === wardGssCode) {
        return code.value;
      }
    }
    // If exact GSS match not found, return first result
    return codes[0]?.value ?? null;
  } catch (err) {
    console.error("[CivicData] Nomis ward search failed:", err);
    return null;
  }
}

interface NomisCsvRow {
  [key: string]: string;
}

// Full CSV parser that handles quoted fields with commas AND embedded newlines
function parseCsvFull(text: string): string[][] {
  const records: string[][] = [];
  let current = "";
  let inQuotes = false;
  const currentRow: string[] = [];

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"') {
      if (inQuotes && text[i + 1] === '"') {
        current += '"'; // escaped quote
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      currentRow.push(current.trim());
      current = "";
    } else if ((ch === '\n' || ch === '\r') && !inQuotes) {
      if (ch === '\r' && text[i + 1] === '\n') i++; // skip \r\n
      currentRow.push(current.trim());
      current = "";
      if (currentRow.length > 1 || currentRow[0] !== "") {
        records.push([...currentRow]);
      }
      currentRow.length = 0;
    } else {
      current += ch;
    }
  }
  // Last field/row
  if (current || currentRow.length > 0) {
    currentRow.push(current.trim());
    records.push([...currentRow]);
  }
  return records;
}

function parseCsvLine(line: string): string[] {
  const values: string[] = [];
  let current = "";
  let inQuotes = false;
  for (const ch of line) {
    if (ch === '"') { inQuotes = !inQuotes; continue; }
    if (ch === "," && !inQuotes) { values.push(current.trim()); current = ""; continue; }
    current += ch;
  }
  values.push(current.trim());
  return values;
}

function parseNomisCsv(csv: string): NomisCsvRow[] {
  const lines = csv.trim().split("\n");
  if (lines.length < 2) return [];
  const headers = parseCsvLine(lines[0]);
  const rows: NomisCsvRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCsvLine(lines[i]);
    const row: NomisCsvRow = {};
    headers.forEach((h, idx) => { row[h] = values[idx] ?? ""; });
    rows.push(row);
  }
  return rows;
}

async function fetchNomisCensus(
  datasetId: string,
  nomisGeoId: string,
  dimensionCol: string,
  topic: string,
): Promise<CensusTopicData | null> {
  try {
    const url = `${NOMIS_API}/dataset/${datasetId}.data.csv?geography=${nomisGeoId}&select=geography_name,${dimensionCol},obs_value&measures=20100`;
    console.log(`[CivicData] Nomis census fetch: ${topic}`);
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`[CivicData] Nomis ${topic} error: ${res.status}`);
      return null;
    }
    const csv = await res.text();
    const rows = parseNomisCsv(csv);
    if (rows.length === 0) return null;

    let total: number | null = null;
    const breakdown: Array<{ category: string; count: number }> = [];

    for (const row of rows) {
      const category = row[dimensionCol] ?? row[Object.keys(row)[1]] ?? "";
      const count = parseInt(row["OBS_VALUE"] ?? "0", 10);
      if (category.toLowerCase().startsWith("total")) {
        total = count;
      } else {
        breakdown.push({ category, count });
      }
    }

    // Sort breakdown by count descending
    breakdown.sort((a, b) => b.count - a.count);

    return {
      topic,
      source: `Nomis / ONS Census 2021`,
      sourceUrl: `https://www.nomisweb.co.uk/api/v01/dataset/${datasetId}.data.csv?geography=${nomisGeoId}&measures=20100`,
      total,
      breakdown,
    };
  } catch (err) {
    console.error(`[CivicData] Nomis ${topic} failed:`, err);
    return null;
  }
}

// ---------------------------------------------------------------------------
// ONS Beta API fallback for census data (no Nomis ID needed, uses GSS code)
// ---------------------------------------------------------------------------

const ONS_BETA_API = "https://api.beta.ons.gov.uk/v1";

interface OnsCensusObservation {
  dimensions: Array<{ dimension_id: string; option: string; option_id: string }>;
  observation: number;
}

interface OnsCensusResponse {
  total_observations?: number;
  observations?: OnsCensusObservation[];
}

async function fetchOnsCensus(
  wardGssCode: string,
  dimension: string,
  topic: string,
): Promise<CensusTopicData | null> {
  try {
    const url = `${ONS_BETA_API}/population-types/UR/census-observations?area-type=wd,${wardGssCode}&dimensions=${dimension}`;
    console.log(`[CivicData] ONS Beta census fetch: ${topic}`);
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`[CivicData] ONS Beta ${topic} error: ${res.status}`);
      return null;
    }
    const data = await res.json() as OnsCensusResponse;
    if (!data.observations?.length) return null;

    let total: number | null = null;
    const breakdown: Array<{ category: string; count: number }> = [];

    for (const obs of data.observations) {
      const category = obs.dimensions?.[0]?.option ?? "Unknown";
      const count = obs.observation;
      if (category.toLowerCase().startsWith("total")) {
        total = count;
      } else {
        breakdown.push({ category, count });
      }
    }

    breakdown.sort((a, b) => b.count - a.count);

    return {
      topic,
      source: "ONS Census 2021 (Beta API)",
      sourceUrl: url,
      total,
      breakdown,
    };
  } catch (err) {
    console.error(`[CivicData] ONS Beta ${topic} failed:`, err);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Census data orchestrator — tries Nomis first, falls back to ONS Beta
// ---------------------------------------------------------------------------

const CENSUS_TOPICS = [
  { dataset: "NM_2041_1", dim: "C2021_ETH_20_NAME", onsDim: "ethnic_group_tb_20b", topic: "Ethnicity" },
  { dataset: "NM_2049_1", dim: "C2021_RELIGION_10_NAME", onsDim: "religion_tb", topic: "Religion" },
  { dataset: "NM_2018_1", dim: "C2021_AGE_12A_NAME", onsDim: null, topic: "Age" },
  { dataset: "NM_2055_1", dim: "C2021_HEALTH_6_NAME", onsDim: "health_in_general", topic: "General Health" },
  { dataset: "NM_2084_1", dim: "C2021_HIQUAL_8_NAME", onsDim: "highest_qualification", topic: "Qualifications" },
  { dataset: "NM_2072_1", dim: "C2021_TENURE_9_NAME", onsDim: null, topic: "Housing Tenure" },
];

export async function getCensusData(
  wardName: string | null,
  wardGssCode: string | null,
): Promise<CensusTopicData[]> {
  const results: CensusTopicData[] = [];

  if (!wardGssCode && !wardName) return results;

  // Try Nomis first (needs Nomis internal ID)
  let nomisId: string | null = null;
  if (wardName && wardGssCode) {
    nomisId = await findNomisWardId(wardName, wardGssCode);
    console.log(`[CivicData] Nomis ward ID for ${wardName}: ${nomisId}`);
  }

  for (const topic of CENSUS_TOPICS) {
    let data: CensusTopicData | null = null;

    // Try Nomis
    if (nomisId) {
      data = await fetchNomisCensus(topic.dataset, nomisId, topic.dim, topic.topic);
    }

    // Fallback to ONS Beta if Nomis failed and we have a GSS code + ONS dimension
    if (!data && wardGssCode && topic.onsDim) {
      data = await fetchOnsCensus(wardGssCode, topic.onsDim, topic.topic);
    }

    if (data) {
      results.push(data);
    }
  }

  return results;
}

// ---------------------------------------------------------------------------
// IMD (Index of Multiple Deprivation) — via postcodes.io LSOA + gov.uk
// We use the IMD 2019/2025 data. Since the full CSV is ~10MB, we provide
// the source URL and use postcodes.io's built-in IMD data if available,
// otherwise we note it requires bulk download.
// ---------------------------------------------------------------------------

// postcodes.io doesn't return IMD directly, but we can construct a lookup URL.
// For now, we return what we can from postcodes.io and link to the official source.

export function getDeprivationInfo(lsoaCode: string | null): DeprivationData | null {
  if (!lsoaCode) return null;

  const imdSourceUrl = "https://www.gov.uk/government/statistics/english-indices-of-deprivation-2025";
  const imdCsvUrl = "https://assets.publishing.service.gov.uk/media/691ded56d140bbbaa59a2a7d/File_7_IoD2025_All_Ranks_Scores_Deciles_Population_Denominators.csv";
  const postcodeToolUrl = `https://imd-by-postcode.opendatacommunities.org/`;

  const nullVal = (label: string): SourcedValue<null> => ({
    value: null,
    source: `IMD 2025 — lookup LSOA ${lsoaCode} in bulk CSV`,
    sourceUrl: imdCsvUrl,
  });

  // We return null values with source URLs so the frontend knows WHERE to get the data.
  // A future enhancement would be to download and cache the IMD CSV locally.
  return {
    imdRank: nullVal("IMD Rank"),
    imdDecile: nullVal("IMD Decile"),
    imdScore: nullVal("IMD Score"),
    incomeRank: nullVal("Income Rank"),
    employmentRank: nullVal("Employment Rank"),
    educationRank: nullVal("Education Rank"),
    healthRank: nullVal("Health Rank"),
    crimeRank: nullVal("Crime Rank"),
    housingRank: nullVal("Housing Rank"),
    livingEnvironmentRank: nullVal("Living Environment Rank"),
  };
}

// ---------------------------------------------------------------------------
// IMD CSV loader — downloads and caches the IMD 2025 CSV for LSOA lookups
// ---------------------------------------------------------------------------

let imdCache: Map<string, Record<string, string>> | null = null;
let imdLoading: Promise<void> | null = null;

async function loadImdCsv(): Promise<Map<string, Record<string, string>>> {
  if (imdCache) return imdCache;

  // Prevent parallel downloads
  if (imdLoading) {
    await imdLoading;
    return imdCache!;
  }

  imdLoading = (async () => {
    try {
      const url = "https://assets.publishing.service.gov.uk/media/691ded56d140bbbaa59a2a7d/File_7_IoD2025_All_Ranks_Scores_Deciles_Population_Denominators.csv";
      console.log("[CivicData] Downloading IMD 2025 CSV (one-time, ~10MB)...");
      const res = await fetch(url);
      if (!res.ok) {
        console.error(`[CivicData] IMD CSV download failed: ${res.status}`);
        imdCache = new Map();
        return;
      }
      const text = await res.text();
      // Parse the CSV properly — headers and data may contain commas and newlines inside quotes
      const records = parseCsvFull(text);
      if (records.length < 2) {
        imdCache = new Map();
        return;
      }
      const headers = records[0];
      const map = new Map<string, Record<string, string>>();

      // Find the LSOA code column — try common header names
      const lsoaColIdx = headers.findIndex(h =>
        h.toLowerCase().includes("lsoa") && h.toLowerCase().includes("code")
      );

      for (let i = 1; i < records.length; i++) {
        const values = records[i];

        const row: Record<string, string> = {};
        headers.forEach((h, idx) => { row[h] = values[idx] ?? ""; });

        const lsoaCode = lsoaColIdx >= 0 ? values[lsoaColIdx] : null;
        if (lsoaCode) {
          map.set(lsoaCode, row);
        }
      }

      imdCache = map;
      console.log(`[CivicData] IMD CSV loaded: ${map.size} LSOAs`);
    } catch (err) {
      console.error("[CivicData] IMD CSV load failed:", err);
      imdCache = new Map();
    }
  })();

  await imdLoading;
  imdLoading = null;
  return imdCache!;
}

export async function getDeprivationFromCsv(lsoaCode: string | null): Promise<DeprivationData | null> {
  if (!lsoaCode) return null;

  const imdCsvUrl = "https://assets.publishing.service.gov.uk/media/691ded56d140bbbaa59a2a7d/File_7_IoD2025_All_Ranks_Scores_Deciles_Population_Denominators.csv";
  const imdPageUrl = "https://www.gov.uk/government/statistics/english-indices-of-deprivation-2025";

  const map = await loadImdCsv();
  const row = map.get(lsoaCode);
  if (!row) {
    console.log(`[CivicData] LSOA ${lsoaCode} not found in IMD CSV`);
    return getDeprivationInfo(lsoaCode);
  }

  // Helper to find a value by partial header match
  const findVal = (keywords: string[]): number | null => {
    for (const [key, val] of Object.entries(row)) {
      const keyLower = key.toLowerCase();
      if (keywords.every(kw => keyLower.includes(kw.toLowerCase()))) {
        const num = parseFloat(val);
        return isNaN(num) ? null : num;
      }
    }
    return null;
  };

  const sv = (val: number | null, label: string): SourcedValue<number | null> => ({
    value: val,
    source: `English Indices of Deprivation 2025 — LSOA ${lsoaCode}`,
    sourceUrl: imdPageUrl,
  });

  return {
    imdRank: sv(findVal(["index of multiple deprivation", "rank"]) ?? findVal(["imd", "rank"]), "IMD Rank"),
    imdDecile: sv(findVal(["index of multiple deprivation", "decile"]) ?? findVal(["imd", "decile"]), "IMD Decile"),
    imdScore: sv(findVal(["index of multiple deprivation", "score"]) ?? findVal(["imd", "score"]), "IMD Score"),
    incomeRank: sv(findVal(["income", "rank"]), "Income Rank"),
    employmentRank: sv(findVal(["employment", "rank"]), "Employment Rank"),
    educationRank: sv(findVal(["education", "rank"]) ?? findVal(["skills", "rank"]), "Education Rank"),
    healthRank: sv(findVal(["health", "rank"]), "Health Rank"),
    crimeRank: sv(findVal(["crime", "rank"]), "Crime Rank"),
    housingRank: sv(findVal(["housing", "rank"]) ?? findVal(["barriers", "rank"]), "Housing Rank"),
    livingEnvironmentRank: sv(findVal(["living environment", "rank"]), "Living Environment Rank"),
  };
}

// ---------------------------------------------------------------------------
// LG Inform — check if open endpoints exist
// ---------------------------------------------------------------------------

export async function getLGInformData(_areaCode: string): Promise<null> {
  // LG Inform Plus requires registration and API key.
  // The free tier starts at 2GB but still needs auth.
  // Skipping for now — returns null gracefully.
  console.log("[CivicData] LG Inform: requires API key, skipping");
  return null;
}

// ---------------------------------------------------------------------------
// Master orchestrator — get all civic data for a location
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// US Civic Data — representatives via Google Civic Information API
// ---------------------------------------------------------------------------

async function getUSRepresentatives(address: string): Promise<Representative[]> {
  try {
    // Google Civic Information API — free, no key required for representatives
    const url = `https://www.googleapis.com/civicinfo/v2/representatives?address=${encodeURIComponent(address)}&key=${process.env.GEMINI_API_KEY || ""}`;
    const res = await fetch(url);
    if (!res.ok) return [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = await res.json() as any;

    const reps: Representative[] = [];
    const offices = data.offices || [];
    const officials = data.officials || [];

    for (const office of offices) {
      for (const idx of office.officialIndices || []) {
        const official = officials[idx];
        if (!official) continue;
        reps.push({
          name: { value: official.name, source: "Google Civic Information API", sourceUrl: `https://www.googleapis.com/civicinfo/v2/representatives?address=${encodeURIComponent(address)}` },
          party: { value: official.party || "Unknown", source: "Google Civic Information API", sourceUrl: "" },
          constituency: { value: office.name, source: "Google Civic Information API", sourceUrl: "" },
          thumbnailUrl: { value: official.photoUrl || null, source: "Google Civic Information API", sourceUrl: "" },
          profileUrl: { value: official.urls?.[0] || "", source: "Google Civic Information API", sourceUrl: official.urls?.[0] || "" },
          house: { value: office.levels?.[0] || "unknown", source: "Google Civic Information API", sourceUrl: "" },
        });
      }
    }
    return reps;
  } catch {
    return [];
  }
}

// US Census Bureau — basic demographics by lat/lng
async function getUSCensusData(lat: number, lng: number): Promise<CensusTopicData[]> {
  try {
    // Get FIPS codes from FCC API (free, no key)
    const fccRes = await fetch(`https://geo.fcc.gov/api/census/block/find?latitude=${lat}&longitude=${lng}&format=json`);
    if (!fccRes.ok) return [];
    const fcc = await fccRes.json() as Record<string, Record<string, string>>;

    const state = fcc.State?.FIPS;
    const county = fcc.County?.FIPS;
    const stateName = fcc.State?.name || "Unknown";
    const countyName = fcc.County?.name || "Unknown";

    if (!state || !county) return [];

    // US Census ACS 5-year population data
    const censusUrl = `https://api.census.gov/data/2022/acs/acs5?get=B01003_001E,B02001_002E,B02001_003E,B02001_005E,B03003_003E,B19013_001E&for=county:${county.slice(2)}&in=state:${state}`;
    const censusRes = await fetch(censusUrl);
    if (!censusRes.ok) return [];
    const censusData = await censusRes.json() as string[][];

    if (censusData.length < 2) return [];
    const vals = censusData[1];

    const totalPop = parseInt(vals[0]) || 0;
    const white = parseInt(vals[1]) || 0;
    const black = parseInt(vals[2]) || 0;
    const asian = parseInt(vals[3]) || 0;
    const hispanic = parseInt(vals[4]) || 0;
    const medianIncome = parseInt(vals[5]) || 0;

    const topics: CensusTopicData[] = [];

    if (totalPop > 0) {
      topics.push({
        topic: `Population — ${countyName}, ${stateName}`,
        source: "US Census Bureau ACS 5-Year (2022)",
        sourceUrl: "https://data.census.gov",
        total: totalPop,
        breakdown: [
          { category: "White", count: white, percentage: (white / totalPop) * 100 },
          { category: "Black or African American", count: black, percentage: (black / totalPop) * 100 },
          { category: "Asian", count: asian, percentage: (asian / totalPop) * 100 },
          { category: "Hispanic or Latino", count: hispanic, percentage: (hispanic / totalPop) * 100 },
          { category: "Other", count: totalPop - white - black - asian - hispanic, percentage: ((totalPop - white - black - asian - hispanic) / totalPop) * 100 },
        ].filter(b => b.count > 0),
      });
    }

    if (medianIncome > 0) {
      topics.push({
        topic: `Household Income — ${countyName}, ${stateName}`,
        source: "US Census Bureau ACS 5-Year (2022)",
        sourceUrl: "https://data.census.gov",
        total: medianIncome,
        breakdown: [
          { category: "Median household income", count: medianIncome, percentage: 100 },
        ],
      });
    }

    return topics;
  } catch {
    return [];
  }
}

// Detect if a location is in the US based on lat/lng
function isUSLocation(lat: number, lng: number): boolean {
  // Continental US rough bounds
  return lat > 24 && lat < 50 && lng > -125 && lng < -66;
}

export async function getAllCivicData(opts: {
  lat?: number;
  lng?: number;
  postcode?: string;
}): Promise<CivicAreaData> {
  const errors: string[] = [];
  const result: CivicAreaData = {
    geography: null,
    representatives: [],
    deprivation: null,
    census: [],
    errors,
    fetchedAt: new Date().toISOString(),
  };

  // Step 1: Resolve location to postcode data
  let pcData: PostcodesIoResult | null = null;

  if (opts.postcode) {
    pcData = await resolvePostcode(opts.postcode);
    if (!pcData) errors.push("Failed to resolve postcode via postcodes.io");
  } else if (opts.lat != null && opts.lng != null) {
    pcData = await reverseGeocode(opts.lat, opts.lng);
    if (!pcData) errors.push("Failed to reverse geocode via postcodes.io");
  } else {
    errors.push("Either postcode or lat/lng is required");
    return result;
  }

  // If postcodes.io fails and we have lat/lng, try US path
  if (!pcData && opts.lat != null && opts.lng != null && isUSLocation(opts.lat, opts.lng)) {
    errors.length = 0; // Clear UK-specific errors

    // US location — use Google Civic + US Census
    const address = opts.postcode || `${opts.lat},${opts.lng}`;
    const [usReps, usCensus] = await Promise.all([
      getUSRepresentatives(address).catch(() => []),
      getUSCensusData(opts.lat, opts.lng).catch(() => []),
    ]);

    result.representatives = usReps;
    result.census = usCensus;

    if (usReps.length === 0) errors.push("Could not find US representatives for this location");
    if (usCensus.length === 0) errors.push("Could not find US Census data for this location");

    return result;
  }

  if (!pcData) return result;

  // Step 2: Build geography (UK)
  result.geography = buildGeography(pcData);

  // Step 3: Parallel fetches for representatives, census, deprivation
  const postcode = pcData.postcode;
  const wardName = pcData.admin_ward;
  const wardGssCode = pcData.codes?.admin_ward ?? null;
  const lsoaCode = pcData.codes?.lsoa ?? null;
  const constituency = pcData.parliamentary_constituency;

  const [reps, census, deprivation] = await Promise.all([
    // Representatives — use constituency name directly (already resolved from postcodes.io)
    constituency
      ? getLocalPoliticians(constituency).catch(err => {
          errors.push(`Representatives lookup failed: ${err instanceof Error ? err.message : String(err)}`);
          return [] as Representative[];
        })
      : Promise.resolve([] as Representative[]),
    // Census data
    getCensusData(wardName, wardGssCode).catch(err => {
      errors.push(`Census data failed: ${err instanceof Error ? err.message : String(err)}`);
      return [] as CensusTopicData[];
    }),
    // Deprivation
    getDeprivationFromCsv(lsoaCode).catch(err => {
      errors.push(`Deprivation data failed: ${err instanceof Error ? err.message : String(err)}`);
      return null;
    }),
  ]);

  result.representatives = reps;
  result.census = census;
  result.deprivation = deprivation;

  return result;
}
