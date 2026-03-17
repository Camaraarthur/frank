// ============================================================================
// Frank — Worldwide Civic Data Module
// Detects country from coordinates, then routes to the best available APIs:
//   UK → existing civic-data.ts (Parliament, ONS Census, IMD)
//   US → Google Civic Information + US Census
//   CA → Open North Represent API (all levels)
//   Anywhere → Wikidata SPARQL + World Bank indicators
// Every data point carries source and sourceUrl for citation.
// ============================================================================

import {
  getAllCivicData as getUKCivicData,
  type CivicAreaData,
  type Representative,
  type SourcedValue,
  type CensusTopicData,
} from "./civic-data.js";

import {
  getAirQuality,
  getStreetViewUrl,
  findInterviewLocations,
  type AirQualityData,
  type NearbyPlace,
} from "./google-apis.js";

// ---------------------------------------------------------------------------
// Fetch helper with timeout
// ---------------------------------------------------------------------------

async function fetchWithTimeout(
  url: string,
  options: RequestInit & { timeout?: number } = {}
): Promise<Response> {
  const { timeout = 15000, ...fetchOptions } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { ...fetchOptions, signal: controller.signal });
    return response;
  } finally {
    clearTimeout(id);
  }
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface WorldwideRepresentative {
  name: string;
  position: string;
  party: string | null;
  imageUrl: string | null;
  profileUrl: string | null;
  source: string;
  sourceUrl: string;
}

export interface DemographicIndicator {
  label: string;
  value: number | null;
  year: number | null;
  unit: string;
  source: string;
  sourceUrl: string;
}

export interface WorldwideAreaData {
  country: {
    code: string;
    name: string;
    source: string;
    sourceUrl: string;
  } | null;
  adminArea: {
    name: string;
    level: string;
    source: string;
    sourceUrl: string;
  } | null;
  representatives: WorldwideRepresentative[];
  demographics: DemographicIndicator[];
  places: {
    communitySpaces: NearbyPlace[];
    religiousSpaces: NearbyPlace[];
    markets: NearbyPlace[];
    cafes: NearbyPlace[];
    parks: NearbyPlace[];
  } | null;
  airQuality: AirQualityData | null;
  streetViewUrl: string | null;
  // If UK or US, include the full native civic data
  nativeCivicData: CivicAreaData | null;
  errors: string[];
  dataSources: Array<{ name: string; url: string; description: string }>;
  fetchedAt: string;
}

// ---------------------------------------------------------------------------
// 1. detectCountry — Nominatim reverse geocode via GIS backend or direct
// ---------------------------------------------------------------------------

interface NominatimResult {
  address: {
    country: string;
    country_code: string;
    state?: string;
    county?: string;
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    suburb?: string;
    [key: string]: string | undefined;
  };
  display_name: string;
  osm_id?: number;
  osm_type?: string;
}

export async function detectCountry(
  lat: number,
  lng: number
): Promise<{ countryCode: string; countryName: string; adminArea: string | null; displayName: string } | null> {
  // Try GIS backend first (localhost:4742), fall back to public Nominatim
  const endpoints = [
    `http://localhost:4742/reverse?format=jsonv2&lat=${lat}&lon=${lng}&addressdetails=1&zoom=10`,
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&addressdetails=1&zoom=10`,
  ];

  for (const url of endpoints) {
    try {
      console.log(`[WorldwideCivic] Nominatim reverse geocode: ${url}`);
      const res = await fetchWithTimeout(url, {
        timeout: 10000,
        headers: {
          "User-Agent": "BeatFrank/1.0 (civic-data-platform; contact@call.partners)",
          Accept: "application/json",
        },
      });
      if (!res.ok) {
        console.error(`[WorldwideCivic] Nominatim error: ${res.status}`);
        continue;
      }
      const data = (await res.json()) as NominatimResult;
      if (!data.address?.country_code) continue;

      const addr = data.address;
      const adminArea =
        addr.state || addr.county || addr.city || addr.town || addr.municipality || null;

      return {
        countryCode: addr.country_code.toUpperCase(),
        countryName: addr.country || "Unknown",
        adminArea,
        displayName: data.display_name || "",
      };
    } catch (err) {
      console.error(`[WorldwideCivic] Nominatim failed for ${url}:`, err);
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// 2. getWikidataRepresentatives — SPARQL query for elected officials
// ---------------------------------------------------------------------------

const WIKIDATA_SPARQL = "https://query.wikidata.org/sparql";

// Map of ISO 3166-1 alpha-2 to Wikidata country entity IDs
const COUNTRY_QID: Record<string, string> = {
  AF: "Q889", AL: "Q222", DZ: "Q262", AD: "Q228", AO: "Q916",
  AG: "Q781", AR: "Q414", AM: "Q399", AU: "Q408", AT: "Q40",
  AZ: "Q227", BS: "Q778", BH: "Q398", BD: "Q902", BB: "Q244",
  BY: "Q184", BE: "Q31", BZ: "Q242", BJ: "Q962", BT: "Q917",
  BO: "Q750", BA: "Q225", BW: "Q963", BR: "Q155", BN: "Q921",
  BG: "Q219", BF: "Q965", BI: "Q967", KH: "Q424", CM: "Q1009",
  CA: "Q16", CV: "Q1011", CF: "Q929", TD: "Q657", CL: "Q298",
  CN: "Q148", CO: "Q739", KM: "Q970", CD: "Q974", CG: "Q971",
  CR: "Q800", HR: "Q224", CU: "Q241", CY: "Q229", CZ: "Q213",
  DK: "Q35", DJ: "Q977", DM: "Q784", DO: "Q786", EC: "Q736",
  EG: "Q79", SV: "Q792", GQ: "Q983", ER: "Q986", EE: "Q191",
  SZ: "Q1050", ET: "Q115", FJ: "Q712", FI: "Q33", FR: "Q142",
  GA: "Q1000", GM: "Q1005", GE: "Q230", DE: "Q183", GH: "Q117",
  GR: "Q41", GD: "Q769", GT: "Q774", GN: "Q1006", GW: "Q1007",
  GY: "Q734", HT: "Q790", HN: "Q783", HU: "Q28", IS: "Q189",
  IN: "Q668", ID: "Q252", IR: "Q794", IQ: "Q796", IE: "Q27",
  IL: "Q801", IT: "Q38", JM: "Q766", JP: "Q17", JO: "Q810",
  KZ: "Q232", KE: "Q114", KI: "Q710", KP: "Q423", KR: "Q884",
  KW: "Q817", KG: "Q813", LA: "Q819", LV: "Q211", LB: "Q822",
  LS: "Q1013", LR: "Q1014", LY: "Q1016", LI: "Q347", LT: "Q37",
  LU: "Q32", MG: "Q1019", MW: "Q1020", MY: "Q833", MV: "Q826",
  ML: "Q912", MT: "Q233", MH: "Q709", MR: "Q1025", MU: "Q1027",
  MX: "Q96", FM: "Q702", MD: "Q217", MC: "Q235", MN: "Q711",
  ME: "Q236", MA: "Q1028", MZ: "Q1029", MM: "Q836", NA: "Q1030",
  NR: "Q697", NP: "Q837", NL: "Q55", NZ: "Q664", NI: "Q811",
  NE: "Q1032", NG: "Q1033", MK: "Q221", NO: "Q20", OM: "Q842",
  PK: "Q843", PW: "Q695", PA: "Q804", PG: "Q691", PY: "Q733",
  PE: "Q419", PH: "Q928", PL: "Q36", PT: "Q45", QA: "Q846",
  RO: "Q218", RU: "Q159", RW: "Q1037", KN: "Q763", LC: "Q760",
  VC: "Q757", WS: "Q683", SM: "Q238", ST: "Q1039", SA: "Q851",
  SN: "Q1041", RS: "Q403", SC: "Q1042", SL: "Q1044", SG: "Q334",
  SK: "Q214", SI: "Q215", SB: "Q685", SO: "Q1045", ZA: "Q258",
  SS: "Q958", ES: "Q29", LK: "Q854", SD: "Q1049", SR: "Q730",
  SE: "Q34", CH: "Q39", SY: "Q858", TW: "Q865", TJ: "Q863",
  TZ: "Q924", TH: "Q869", TL: "Q574", TG: "Q945", TO: "Q678",
  TT: "Q754", TN: "Q948", TR: "Q43", TM: "Q874", TV: "Q672",
  UG: "Q1036", UA: "Q212", AE: "Q878", GB: "Q145", US: "Q30",
  UY: "Q77", UZ: "Q265", VU: "Q686", VE: "Q717", VN: "Q881",
  YE: "Q805", ZM: "Q953", ZW: "Q954",
};

export async function getWikidataRepresentatives(
  lat: number,
  lng: number,
  countryCode: string
): Promise<WorldwideRepresentative[]> {
  const qid = COUNTRY_QID[countryCode];
  if (!qid) {
    console.log(`[WorldwideCivic] No Wikidata QID for country: ${countryCode}`);
    return [];
  }

  // SPARQL: find current national legislators for this country.
  // Strategy: find people who hold a position (P39) where that position's
  // "applies to jurisdiction" (P1001) is this country, or where the position
  // is "member of" a legislature (P2937 parliamentary term, or P194 legislative body).
  // We also match via "represents" (P768 electoral district) in this country.
  //
  // The query uses VALUES to list common "member of parliament" pattern matches
  // rather than expensive P279* traversals.
  // Fast SPARQL strategy: try P1001 (jurisdiction) first, then P768 (electoral district).
  // If neither works (common for many countries), use a broader pattern with P2937
  // (parliamentary term) which is commonly used on Wikidata for legislature members.
  // We run a simpler, faster query first, then a broader one as fallback.
  const sparqlFast = `
SELECT DISTINCT ?person ?personLabel ?positionLabel ?partyLabel ?districtLabel ?image ?article WHERE {
  {
    ?person p:P39 ?stmt .
    ?stmt ps:P39 ?position .
    ?position wdt:P1001 wd:${qid} .
    ?stmt pq:P580 ?start .
    FILTER NOT EXISTS { ?stmt pq:P582 ?end }
  } UNION {
    ?person p:P39 ?stmt .
    ?stmt ps:P39 ?position .
    ?stmt pq:P768 ?district .
    ?district wdt:P17 wd:${qid} .
    ?stmt pq:P580 ?start .
    FILTER NOT EXISTS { ?stmt pq:P582 ?end }
  }
  OPTIONAL { ?person wdt:P102 ?party }
  OPTIONAL { ?stmt pq:P768 ?district }
  OPTIONAL { ?person wdt:P18 ?image }
  OPTIONAL {
    ?article schema:about ?person ;
             schema:isPartOf <https://en.wikipedia.org/> .
  }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en,fr,de,es,pt,it,ja,zh". }
}
LIMIT 500
`.trim();

  // Broader fallback: citizen of country holding any position with a parliamentary term qualifier
  const sparqlBroad = `
SELECT DISTINCT ?person ?personLabel ?positionLabel ?partyLabel ?image ?article WHERE {
  ?person wdt:P27 wd:${qid} .
  ?person p:P39 ?stmt .
  ?stmt ps:P39 ?position .
  ?stmt pq:P2937 ?term .
  FILTER NOT EXISTS { ?stmt pq:P582 ?end }
  OPTIONAL { ?person wdt:P102 ?party }
  OPTIONAL { ?person wdt:P18 ?image }
  OPTIONAL {
    ?article schema:about ?person ;
             schema:isPartOf <https://en.wikipedia.org/> .
  }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en,fr,de,es,pt,it,ja,zh". }
}
LIMIT 500
`.trim();

  // Try the fast query first, fall back to the broader one
  for (const [label, sparql] of [["fast", sparqlFast], ["broad", sparqlBroad]] as const) {
    try {
      const url = `${WIKIDATA_SPARQL}?query=${encodeURIComponent(sparql)}&format=json`;
      console.log(`[WorldwideCivic] Wikidata SPARQL ${label} query for ${countryCode} (${qid})`);
      const res = await fetchWithTimeout(url, {
        timeout: 30000,
        headers: {
          "User-Agent": "BeatFrank/1.0 (civic-data-platform; contact@call.partners)",
          Accept: "application/sparql-results+json",
        },
      });

      if (!res.ok) {
        console.error(`[WorldwideCivic] Wikidata SPARQL ${label} error: ${res.status}`);
        continue;
      }

      const data = (await res.json()) as {
        results: {
          bindings: Array<{
            person: { value: string };
            personLabel: { value: string };
            positionLabel?: { value: string };
            partyLabel?: { value: string };
            districtLabel?: { value: string };
            image?: { value: string };
            article?: { value: string };
          }>;
        };
      };

      // Deduplicate by person URI
      const seen = new Set<string>();
      const results: WorldwideRepresentative[] = [];

      for (const b of data.results.bindings) {
        const personUri = b.person.value;
        if (seen.has(personUri)) continue;
        seen.add(personUri);

        const wikidataId = personUri.split("/").pop() || "";
        const profileUrl = b.article?.value || personUri;

        results.push({
          name: b.personLabel?.value || "Unknown",
          position: b.positionLabel?.value || "Legislator",
          party: b.partyLabel?.value || null,
          imageUrl: b.image?.value || null,
          profileUrl,
          source: "Wikidata",
          sourceUrl: `https://www.wikidata.org/wiki/${wikidataId}`,
        });
      }

      if (results.length > 0) {
        console.log(`[WorldwideCivic] Wikidata ${label} returned ${results.length} representatives for ${countryCode}`);
        return results;
      }
      console.log(`[WorldwideCivic] Wikidata ${label} returned 0 results, trying next pattern...`);
    } catch (err) {
      console.error(`[WorldwideCivic] Wikidata SPARQL ${label} failed:`, err instanceof Error ? err.message : err);
    }
  }

  console.log(`[WorldwideCivic] All Wikidata patterns exhausted for ${countryCode}`);
  return [];
}

// ---------------------------------------------------------------------------
// 3. getWorldBankDemographics — key indicators for any country
// ---------------------------------------------------------------------------

const WORLD_BANK_INDICATORS = [
  { code: "SP.POP.TOTL", label: "Population", unit: "people" },
  { code: "NY.GDP.PCAP.CD", label: "GDP per capita", unit: "current US$" },
  { code: "SP.DYN.LE00.IN", label: "Life expectancy at birth", unit: "years" },
  { code: "SL.UEM.TOTL.ZS", label: "Unemployment rate", unit: "% of labor force" },
  { code: "SI.POV.GINI", label: "Gini index", unit: "index (0-100)" },
];

export async function getWorldBankDemographics(
  countryCode: string
): Promise<DemographicIndicator[]> {
  const results: DemographicIndicator[] = [];
  // World Bank uses ISO 3166-1 alpha-2 (lowercase) or alpha-3
  const code = countryCode.toLowerCase();

  const fetches = WORLD_BANK_INDICATORS.map(async (indicator) => {
    try {
      const url = `https://api.worldbank.org/v2/country/${code}/indicator/${indicator.code}?format=json&date=2018:2024&per_page=7`;
      console.log(`[WorldwideCivic] World Bank: ${indicator.label} for ${code}`);
      const res = await fetchWithTimeout(url, { timeout: 10000 });
      if (!res.ok) {
        console.error(`[WorldwideCivic] World Bank error for ${indicator.code}: ${res.status}`);
        return null;
      }

      // World Bank returns [metadata, data[]] — the second element has the values
      const raw = (await res.json()) as [
        { page: number; pages: number; total: number },
        Array<{ date: string; value: number | null; indicator: { id: string; value: string } }> | null,
      ];

      const entries = raw[1];
      if (!entries || entries.length === 0) return null;

      // Find the most recent non-null value
      const latest = entries.find((e) => e.value != null);
      if (!latest) return null;

      return {
        label: indicator.label,
        value: latest.value,
        year: parseInt(latest.date, 10) || null,
        unit: indicator.unit,
        source: "World Bank Open Data",
        sourceUrl: `https://data.worldbank.org/indicator/${indicator.code}?locations=${code.toUpperCase()}`,
      } as DemographicIndicator;
    } catch (err) {
      console.error(`[WorldwideCivic] World Bank ${indicator.code} failed:`, err);
      return null;
    }
  });

  const fetched = await Promise.all(fetches);
  for (const item of fetched) {
    if (item) results.push(item);
  }

  return results;
}

// ---------------------------------------------------------------------------
// 4. getCanadaRepresentatives — Open North Represent API
// ---------------------------------------------------------------------------

interface RepresentApiResult {
  name: string;
  district_name: string;
  elected_office: string;
  party_name: string;
  email: string;
  url: string;
  photo_url: string;
  personal_url: string;
  source_url: string;
  representative_set_name: string;
}

export async function getCanadaRepresentatives(
  lat: number,
  lng: number
): Promise<WorldwideRepresentative[]> {
  try {
    const url = `https://represent.opennorth.ca/representatives/?point=${lat},${lng}`;
    console.log(`[WorldwideCivic] Represent API (Canada): ${url}`);
    const res = await fetchWithTimeout(url, {
      timeout: 10000,
      headers: {
        "User-Agent": "BeatFrank/1.0 (civic-data-platform; contact@call.partners)",
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      console.error(`[WorldwideCivic] Represent API error: ${res.status}`);
      return [];
    }

    const data = (await res.json()) as {
      objects: RepresentApiResult[];
    };

    const results: WorldwideRepresentative[] = (data.objects || []).map((rep) => ({
      name: rep.name,
      position: `${rep.elected_office} — ${rep.district_name} (${rep.representative_set_name})`,
      party: rep.party_name || null,
      imageUrl: rep.photo_url || null,
      profileUrl: rep.url || rep.personal_url || null,
      source: "Open North Represent API",
      sourceUrl: rep.source_url || "https://represent.opennorth.ca",
    }));

    console.log(`[WorldwideCivic] Represent API returned ${results.length} representatives`);
    return results;
  } catch (err) {
    console.error("[WorldwideCivic] Represent API (Canada) failed:", err);
    return [];
  }
}

// ---------------------------------------------------------------------------
// 5. getEurostatDemographics — EU regional data by NUTS3
// ---------------------------------------------------------------------------

// EU member state ISO codes (2-letter)
const EU_COUNTRIES = new Set([
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR",
  "DE", "GR", "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL",
  "PL", "PT", "RO", "SK", "SI", "ES", "SE",
  // EEA / associated
  "NO", "IS", "LI", "CH",
]);

export function isEUCountry(countryCode: string): boolean {
  return EU_COUNTRIES.has(countryCode.toUpperCase());
}

// TODO: Eurostat SDMX API integration
// The Eurostat API uses SDMX format and requires NUTS3 codes which are not trivially
// derived from lat/lng. A full implementation would:
// 1. Use Nominatim to get the admin region name
// 2. Map it to a NUTS3 code via a lookup table or the Eurostat NUTS API
// 3. Query: https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/demo_r_pjangrp3/{NUTS3}?format=JSON
//
// For now, we rely on World Bank country-level data for EU countries and note
// that Eurostat regional data is a future enhancement.
export async function getEurostatDemographics(
  _nuts3Code: string
): Promise<DemographicIndicator[]> {
  console.log("[WorldwideCivic] Eurostat: TODO — requires NUTS3 code mapping from coordinates");
  return [];
}

// ---------------------------------------------------------------------------
// 6. getAllWorldwideData — master orchestrator
// ---------------------------------------------------------------------------

export async function getAllWorldwideData(
  lat: number,
  lng: number
): Promise<WorldwideAreaData> {
  const errors: string[] = [];
  const dataSources: Array<{ name: string; url: string; description: string }> = [];

  const result: WorldwideAreaData = {
    country: null,
    adminArea: null,
    representatives: [],
    demographics: [],
    places: null,
    airQuality: null,
    streetViewUrl: null,
    nativeCivicData: null,
    errors,
    dataSources,
    fetchedAt: new Date().toISOString(),
  };

  // Step 1: Detect country
  const geo = await detectCountry(lat, lng);
  if (!geo) {
    errors.push("Could not determine country from coordinates (Nominatim reverse geocode failed)");
    // Still try Google APIs
    await addGoogleData(result, lat, lng, errors);
    return result;
  }

  const cc = geo.countryCode;
  result.country = {
    code: cc,
    name: geo.countryName,
    source: "OpenStreetMap Nominatim",
    sourceUrl: `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
  };

  if (geo.adminArea) {
    result.adminArea = {
      name: geo.adminArea,
      level: "state/region",
      source: "OpenStreetMap Nominatim",
      sourceUrl: `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
    };
  }

  dataSources.push({
    name: "OpenStreetMap Nominatim",
    url: "https://nominatim.openstreetmap.org",
    description: "Reverse geocoding and admin boundary identification",
  });

  console.log(`[WorldwideCivic] Detected country: ${cc} (${geo.countryName}), admin: ${geo.adminArea}`);

  // Step 2: Route to country-specific APIs
  if (cc === "GB") {
    // UK — use existing deep civic-data.ts integration
    console.log("[WorldwideCivic] UK path — using existing civic-data.ts");
    dataSources.push({
      name: "UK Parliament API + ONS Census + IMD",
      url: "https://members-api.parliament.uk/api",
      description: "Deep UK civic data: MPs, census demographics, deprivation indices",
    });

    try {
      const civicData = await getUKCivicData({ lat, lng });
      result.nativeCivicData = civicData;

      // Also convert UK reps to worldwide format for consistency
      for (const rep of civicData.representatives) {
        result.representatives.push({
          name: rep.name.value,
          position: `${rep.house.value} — ${rep.constituency.value}`,
          party: rep.party.value,
          imageUrl: rep.thumbnailUrl.value,
          profileUrl: rep.profileUrl.value,
          source: rep.name.source,
          sourceUrl: rep.name.sourceUrl,
        });
      }

      errors.push(...civicData.errors);
    } catch (err) {
      errors.push(`UK civic data failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  } else if (cc === "US") {
    // US — use existing Google Civic + Census path
    console.log("[WorldwideCivic] US path — using Google Civic + Census");
    dataSources.push({
      name: "Google Civic Information API + US Census Bureau",
      url: "https://developers.google.com/civic-information",
      description: "US representatives at all levels + demographic data",
    });

    try {
      const civicData = await getUKCivicData({ lat, lng });
      result.nativeCivicData = civicData;

      for (const rep of civicData.representatives) {
        result.representatives.push({
          name: rep.name.value,
          position: `${rep.house.value} — ${rep.constituency.value}`,
          party: rep.party.value,
          imageUrl: rep.thumbnailUrl.value,
          profileUrl: rep.profileUrl.value,
          source: rep.name.source,
          sourceUrl: rep.name.sourceUrl,
        });
      }

      errors.push(...civicData.errors);
    } catch (err) {
      errors.push(`US civic data failed: ${err instanceof Error ? err.message : String(err)}`);
    }

    // Also add World Bank demographics for country context
    try {
      const wb = await getWorldBankDemographics(cc);
      result.demographics.push(...wb);
      if (wb.length > 0) {
        dataSources.push({
          name: "World Bank Open Data",
          url: "https://data.worldbank.org",
          description: "Country-level demographic and economic indicators",
        });
      }
    } catch (err) {
      errors.push(`World Bank demographics failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  } else if (cc === "CA") {
    // Canada — use Represent API
    console.log("[WorldwideCivic] Canada path — using Represent API");
    dataSources.push({
      name: "Open North Represent API",
      url: "https://represent.opennorth.ca",
      description: "Canadian elected officials at all levels (federal, provincial, municipal)",
    });

    const [reps, wb] = await Promise.all([
      getCanadaRepresentatives(lat, lng).catch((err) => {
        errors.push(`Canada Represent API failed: ${err instanceof Error ? err.message : String(err)}`);
        return [] as WorldwideRepresentative[];
      }),
      getWorldBankDemographics(cc).catch((err) => {
        errors.push(`World Bank demographics failed: ${err instanceof Error ? err.message : String(err)}`);
        return [] as DemographicIndicator[];
      }),
    ]);

    result.representatives = reps;
    result.demographics = wb;

    if (wb.length > 0) {
      dataSources.push({
        name: "World Bank Open Data",
        url: "https://data.worldbank.org",
        description: "Country-level demographic and economic indicators",
      });
    }

    // If Represent returns nothing, fall back to Wikidata
    if (reps.length === 0) {
      console.log("[WorldwideCivic] Represent API returned no results, falling back to Wikidata");
      const wdReps = await getWikidataRepresentatives(lat, lng, cc).catch(() => []);
      result.representatives = wdReps;
      if (wdReps.length > 0) {
        dataSources.push({
          name: "Wikidata",
          url: "https://www.wikidata.org",
          description: "Structured knowledge base — elected officials via SPARQL",
        });
      }
    }
  } else {
    // All other countries — Wikidata + World Bank
    console.log(`[WorldwideCivic] Global path for ${cc} — Wikidata + World Bank`);

    const [wdReps, wb] = await Promise.all([
      getWikidataRepresentatives(lat, lng, cc).catch((err) => {
        errors.push(`Wikidata representatives failed: ${err instanceof Error ? err.message : String(err)}`);
        return [] as WorldwideRepresentative[];
      }),
      getWorldBankDemographics(cc).catch((err) => {
        errors.push(`World Bank demographics failed: ${err instanceof Error ? err.message : String(err)}`);
        return [] as DemographicIndicator[];
      }),
    ]);

    result.representatives = wdReps;
    result.demographics = wb;

    if (wdReps.length > 0) {
      dataSources.push({
        name: "Wikidata",
        url: "https://www.wikidata.org",
        description: "Structured knowledge base — elected officials via SPARQL",
      });
    }

    if (wb.length > 0) {
      dataSources.push({
        name: "World Bank Open Data",
        url: "https://data.worldbank.org",
        description: "Country-level demographic and economic indicators",
      });
    }

    // Note EU Eurostat as a future data source
    if (isEUCountry(cc)) {
      dataSources.push({
        name: "Eurostat (planned)",
        url: "https://ec.europa.eu/eurostat",
        description: "EU regional demographics by NUTS region — TODO: requires NUTS3 code mapping",
      });
    }
  }

  // Step 3: Always add Google APIs (Places, Air Quality, Street View)
  await addGoogleData(result, lat, lng, errors);

  return result;
}

// ---------------------------------------------------------------------------
// Helper: add Google Maps Platform data
// ---------------------------------------------------------------------------

async function addGoogleData(
  result: WorldwideAreaData,
  lat: number,
  lng: number,
  errors: string[]
): Promise<void> {
  const [places, airQuality] = await Promise.all([
    findInterviewLocations(lat, lng).catch((err) => {
      errors.push(`Google Places failed: ${err instanceof Error ? err.message : String(err)}`);
      return null;
    }),
    getAirQuality(lat, lng).catch((err) => {
      errors.push(`Air Quality failed: ${err instanceof Error ? err.message : String(err)}`);
      return null;
    }),
  ]);

  result.places = places;
  result.airQuality = airQuality;
  result.streetViewUrl = getStreetViewUrl(lat, lng);

  if (places) {
    result.dataSources.push({
      name: "Google Places (New) API",
      url: "https://developers.google.com/maps/documentation/places/web-service",
      description: "Nearby community spaces, religious sites, markets, cafes, parks",
    });
  }

  if (airQuality) {
    result.dataSources.push({
      name: "Google Air Quality API",
      url: "https://developers.google.com/maps/documentation/air-quality",
      description: "Real-time Air Quality Index and health recommendations",
    });
  }

  result.dataSources.push({
    name: "Google Street View",
    url: "https://developers.google.com/maps/documentation/streetview",
    description: "Street-level imagery",
  });
}
