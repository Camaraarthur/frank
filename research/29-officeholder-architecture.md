# Officeholder Data Architecture for Frank

*Research: how civic tech platforms keep politician data current, and the recommended lookup chain for Frank*
*Date: 2026-03-17*

---

## Part 1: How Other Platforms Solve This

### 1. Google Civic Information API

**What it is**: Google's free REST API that returns elected officials at every level of US government for a given address.

**How Google maintains it**: Google sources data from the Voting Information Project (VIP) and other official election data providers. The data pipeline pulls from state and local election offices. Google does not disclose exact update frequency, but data is refreshed as election results are certified.

**Coverage**: Effectively **US-only**. Despite the generic name, the `/representatives` endpoint only returns meaningful results for US addresses. Coverage at federal and state levels is comprehensive. At local levels (county, city, school board, special districts), coverage is **inconsistent** -- some municipalities are fully covered, others are missing entirely. Google has roughly 500,000 US elected officials in the database, but there are estimated 520,000+ total.

**Limitations**:
- US-only for representative data (the `/elections` endpoint has some international coverage but is not useful for officeholder lookups)
- Local coverage is patchy -- no guarantees for any given city council or school board
- No historical data; only returns current officeholders
- Requires a Google API key (free tier is generous but has daily limits)
- No photos for most officials below state level

**Relevance to Frank**: Already integrated. Good for US federal/state, unreliable for US local, useless outside the US.

---

### 2. EveryPolitician (mySociety -> OpenSanctions -> Wikidata)

**History**: mySociety launched EveryPolitician in 2014 to build a global database of every politician. They ran "a large fleet of crawlers which read the web sites of parliaments around the world." By 2019, the project covered 233 countries with hundreds of thousands of records.

**What happened**: mySociety placed EveryPolitician on hold in June 2019. The core challenge was unsustainable maintenance: crawlers broke constantly as parliament websites changed, volunteer effort could not keep up with the breadth of coverage, and the data went stale quickly for countries without active contributors.

**Where the data went**: The crawler-era data was frozen and is now preserved within OpenSanctions as a deprecated dataset (40,349 individuals, 199 countries). OpenSanctions marks this data as "no longer actively maintained" and keeps it "only for the purpose of maintaining historical coverage of PEPs." The data has not been updated since May 2019.

**The reboot**: EveryPolitician was "re-born and re-imagined" as a Wikidata-based community project. Instead of running its own crawlers, it now sits on top of Wikidata, using two WikiProjects:
- **GovDirectory** -- maps government structures (what positions exist, in which institutions)
- **WikiProject every politician** -- enriches Wikidata with individual politician data

Current stats claim 663,292 politicians in 174,974 positions across 259 countries, but this includes historical figures and the data quality varies enormously by country.

**Key lesson for Frank**: EveryPolitician proved that maintaining your own scraper fleet for every parliament worldwide is unsustainable. The Wikidata pivot was an admission that a community-maintained knowledge graph (with all its imperfections) is more sustainable than a centralized scraping operation. **Do not build your own scraper fleet.** Use official APIs where they exist; fall back to Wikidata + search verification where they do not.

---

### 3. Wikidata

**How civic tech projects use it**: Wikidata is the de facto fallback for politician data worldwide. It uses property P39 (position held) to represent officeholding. A current officeholder has a P39 statement with a P580 (start date) qualifier but no P582 (end date) qualifier.

**SPARQL query for current officeholders of a country**:
```sparql
SELECT DISTINCT ?person ?personLabel ?positionLabel ?partyLabel WHERE {
  ?person p:P39 ?stmt .
  ?stmt ps:P39 ?position .
  ?position wdt:P1001 wd:Q145 .  # jurisdiction = United Kingdom
  ?stmt pq:P580 ?start .
  FILTER NOT EXISTS { ?stmt pq:P582 ?end }
  OPTIONAL { ?person wdt:P102 ?party }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en" . }
}
```

**Update lag**: Highly variable.
- For major national figures (presidents, prime ministers), Wikidata is typically updated within hours of a new appointment.
- For national legislators in well-covered countries (UK, US, France, Germany), updates happen within days to weeks after elections.
- For local officials, updates can lag by months or years, or never happen at all.
- Missing P582 (end date) is a known problem: some officials who left office years ago still appear as "current" because nobody added the end date.

**Reliability by country tier**:
- **Well-covered** (days): UK, US, France, Germany, Canada, Netherlands, Nordics, Brazil
- **Moderately covered** (weeks-months): Italy, Spain, Australia, India, South Africa, Japan, South Korea
- **Poorly covered** (months-never): Most African countries, Central Asia, Pacific Islands, Caribbean

**Can you query only current officeholders?** Yes, using `FILTER NOT EXISTS { ?stmt pq:P582 ?end }`. But "current" in Wikidata means "no end date recorded," not "verified as currently serving." This distinction matters. Frank already uses this pattern in `worldwide-civic.ts`.

**Relevance to Frank**: Already integrated as fallback for non-UK/US/CA countries. Good as a cross-reference layer; dangerous as a sole source.

---

### 4. OpenSanctions

**What it covers**: OpenSanctions is primarily a sanctions/PEP (Politically Exposed Persons) database. They track sanctioned individuals, criminal figures, and politically exposed persons across hundreds of data sources worldwide.

**Do they track current officeholders?** Yes, indirectly. Their PEP dataset includes current politicians because holding political office makes someone a PEP under anti-money-laundering regulations. However, their focus is on whether someone IS a PEP (for compliance screening), not on who represents a given area. The data structure is person-centric ("Is this person politically exposed?") rather than geography-centric ("Who is the mayor of Rome?").

**Data maintenance**: Human-in-the-loop with "thousands of hand-crafted data patches." They combine data from "several hundred data sources" and do entity de-duplication. The data is carefully cleaned but optimized for compliance use cases, not civic information.

**Relevance to Frank**: Limited. OpenSanctions is the wrong tool for "who represents this area?" queries. It could be useful for enrichment (adding context about a known politician) but not for discovery.

---

### 5. Democracy Club (UK)

**What they do**: Democracy Club maintains UK election data through several projects:
- **EveryElection**: Database of all UK elections (parliamentary, local, by-elections)
- **Candidates Wiki**: Crowdsourced database of election candidates
- **Representatives**: Directory of ~19,000 elected officials across ~400 organizations (councils, parliaments, assemblies)

**How they maintain data**: Crowdsourced with community verification. Before each election, volunteers add candidate information. After elections, results are incorporated. For representatives between elections, data relies on council websites and FOI requests.

**API**: They offer APIs and CSV downloads. The API is in "private beta" requiring an API key obtained by contacting them directly. Documentation is minimal.

**Coverage**: UK only. Strong on election candidates (their primary focus), growing coverage of current elected representatives.

**Relevance to Frank**: Potentially useful for UK local councillors (filling the gap that the Parliament API cannot). However, the API being in private beta makes it unreliable as a dependency. The better source for UK local data is Open Council Data UK (CSV, 18,645 councillors, updated regularly).

---

### 6. Popolo Standard

**What it is**: An international open data specification for representing people, organizations, memberships, posts, votes, and speeches in government contexts. Defined schemas for Person, Organization, Membership, Post, Contact Detail, Motion, Vote Event, Area, Event, and Speech.

**Who uses it**: mySociety (EveryPolitician used Popolo internally), Open North (Represent API), Sunlight Foundation, g0v (Taiwan civic tech), Granicus, The Texas Tribune.

**Key design principle**: "Plan for imprecise and uncertain data." Popolo acknowledges that governance data is messy -- people hold multiple overlapping roles, boundaries change, names are transliterated differently.

**Relevance to Frank**: Frank's `Representative` and `WorldwideRepresentative` types are effectively ad-hoc Popolo-like schemas. If Frank ever needs to exchange data with other civic tech projects, aligning with Popolo would help interoperability. But for internal use, the current types are fine.

---

### 7. Open States (US)

**What it is**: A project (now maintained by Plural, a policy software company since 2021) that scrapes all 50 US state legislatures plus DC, Puerto Rico, and US Congress.

**How they keep data current**: Automated scrapers run "multiple times a day" against official state legislature websites for bills and votes. Legislator data is "curated by our team and volunteers" -- meaning it is updated manually when legislatures convene or elections happen, not scraped automatically.

**API**: Open States API v3 (REST + GraphQL). Requires API key. Endpoints for jurisdictions, people (legislators), bills, committees, and events. Free and open.

**Coverage**: Comprehensive for US state legislators. Does NOT cover local officials (city council, county, school boards, etc.).

**Data quality**: High for current state legislators. Their people/geo endpoint lets you find representatives by geographic coordinates, which is similar to what Frank needs.

**Relevance to Frank**: Could supplement Google Civic API for US state-level data with higher reliability. Currently not integrated.

---

## Part 2: What Makes This Hard

### Term limits and elections
Politicians leave office and new ones take over. National elections happen every 2-5 years depending on the country, but by-elections, special elections, resignations, and deaths create constant churn. Any cached data goes stale.

### Different electoral cycles by country
- UK: general elections ~5 years, local elections annually (rotating thirds in many councils)
- US: presidential every 4 years, congressional every 2, state/local varies wildly
- France: municipal every 6 years, legislative every 5, presidential every 5
- Italy: legislative every 5 years, municipal every 5 (staggered)
- Germany: Bundestag every 4, Landtage every 4-5, municipal varies by state

### Local government changes more frequently than national
A national parliament has hundreds of members who change en masse every few years. Local governments have tens of thousands of councillors changing in rolling cycles. The long tail is enormous.

### No open data in many countries
Japan, South Africa, much of Africa, Central Asia, and the Pacific Islands have no APIs and often no structured data exports for elected officials. For these countries, the only options are scraping government websites (which break constantly) or relying on Wikidata (which may be stale).

### The "no end date" problem
Both Wikidata and cached data suffer from the same issue: when someone leaves office, nobody necessarily updates the record. A system that shows "current" officials based on the absence of an end date will inevitably show people who left office months or years ago.

---

## Part 3: Architecture Decision

### Option A: Build own database (scrape/import from official sources)
This is what EveryPolitician tried. It failed. The maintenance burden of keeping crawlers running against hundreds of parliament websites worldwide is unsustainable without a large funded team. **Rejected.**

### Option B: Query APIs in real-time every time
This is what Frank partially does now (UK Parliament API, Google Civic API, Represent API). It works well where APIs exist but fails silently where they do not, and latency is poor when chaining multiple API calls. **Partially accepted -- keep for Tier 1 countries.**

### Option C: Hybrid -- official APIs + Brave Search verification + cache
This is the right answer but needs refinement. **Accepted with modifications.**

### Option D: The recommended architecture

**Layered lookup with progressive degradation and aggressive caching.**

The key insight is that Frank does not need to maintain a database of every politician worldwide. Frank needs to answer one question well: **"Who are the current elected officials for this specific location?"** This is a per-request problem, not a database problem.

---

## Part 4: The Recommended Lookup Chain

### Overview

```
Request: "Who represents [location]?"
         |
         v
   [1] Country Detection (Nominatim)
         |
         v
   [2] Check Cache (SQLite, keyed by country+admin_area)
         |  cache hit + fresh? -> return cached
         |  cache miss or stale? -> continue
         v
   [3] Country-Specific API (Tier 1)
         |  results? -> cache + return
         |  no results or no API? -> continue
         v
   [4] Wikidata SPARQL (Tier 2)
         |  results? -> mark as "wikidata-sourced" -> continue to verify
         |  no results? -> continue
         v
   [5] Brave Search Verification (Tier 3)
         |  search for "[area] current [position] [year]"
         |  results found? -> ask Gemini to EXTRACT names from search results
         |  (Gemini extracts, never generates)
         |  cross-reference with Wikidata results if available
         v
   [6] Return with Source Attribution
         |  every name has: source, sourceUrl, lastVerified, confidence
         |  if nothing found: "No verified officeholder data available"
```

### Step-by-step detail

#### Step 1: Country Detection
Already implemented in `worldwide-civic.ts` via Nominatim reverse geocoding. Returns country code, admin area name (state/region/city), and display name.

#### Step 2: Cache Lookup
**New component needed.** SQLite table:

```sql
CREATE TABLE officeholder_cache (
  id INTEGER PRIMARY KEY,
  country_code TEXT NOT NULL,
  admin_area TEXT,            -- state/region/city name
  admin_level TEXT,           -- 'national' | 'state' | 'local'
  person_name TEXT NOT NULL,
  position TEXT NOT NULL,
  party TEXT,
  image_url TEXT,
  profile_url TEXT,
  source TEXT NOT NULL,       -- 'uk-parliament-api' | 'google-civic' | 'wikidata' | 'brave-search'
  source_url TEXT NOT NULL,
  fetched_at TEXT NOT NULL,   -- ISO timestamp
  expires_at TEXT NOT NULL,   -- ISO timestamp
  confidence TEXT NOT NULL    -- 'official-api' | 'wikidata' | 'search-extracted' | 'unverified'
);

CREATE INDEX idx_cache_lookup ON officeholder_cache(country_code, admin_area);
CREATE INDEX idx_cache_expiry ON officeholder_cache(expires_at);
```

**Cache TTL by source**:
- Official API data: 7 days (elections are infrequent; stale for at most a week)
- Wikidata data: 3 days (may be out of date; check more frequently)
- Brave Search extracted: 1 day (least reliable; refresh daily)

#### Step 3: Country-Specific API (Tier 1)

Route to the best available API based on country code:

| Country Code | API | Covers |
|---|---|---|
| `GB` | UK Parliament Members API | National MPs only |
| `GB` | Open Council Data UK (CSV import) | Local councillors |
| `US` | Google Civic Information API | All levels (patchy local) |
| `US` | Open States API v3 | State legislators |
| `CA` | Open North Represent API | All levels |
| `FR` | RNE via data.gouv.fr (CSV import) | All levels |
| `DE` | abgeordnetenwatch API | National + state |
| `BR` | Camara + Senado APIs | National |
| `NL` | Tweede Kamer OData | National |
| `SE` | Riksdag API | National |
| `IT` | Camera SPARQL + Senato SPARQL | National |

**For countries with CSV/download-only sources** (France RNE, UK Open Council Data, Italy DAIT, Brazil TSE):
- Run a weekly background job that downloads the CSV and imports it into `officeholder_cache`
- The cache then serves requests instantly
- This is NOT "building your own database" -- it is caching official data with clear provenance

#### Step 4: Wikidata SPARQL (Tier 2)

Already implemented in `worldwide-civic.ts`. The existing SPARQL queries (fast P1001 jurisdiction + broad P2937 parliamentary term) work well for national legislators. For local officials, add a location-aware query:

```sparql
# Find officeholders for a specific admin area (e.g., city/municipality)
SELECT DISTINCT ?person ?personLabel ?positionLabel ?partyLabel ?image WHERE {
  ?person p:P39 ?stmt .
  ?stmt ps:P39 ?position .
  ?stmt pq:P580 ?start .
  FILTER NOT EXISTS { ?stmt pq:P582 ?end }
  {
    ?position wdt:P1001 ?jurisdiction .
    ?jurisdiction rdfs:label ?jurisdictionLabel .
    FILTER(LANG(?jurisdictionLabel) = "en")
    FILTER(CONTAINS(LCASE(?jurisdictionLabel), LCASE("AREA_NAME")))
  }
  OPTIONAL { ?person wdt:P102 ?party }
  OPTIONAL { ?person wdt:P18 ?image }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en" . }
}
LIMIT 50
```

**Mark Wikidata results with confidence: "wikidata"** -- good enough to show but should be verified.

#### Step 5: Brave Search Verification (Tier 3)

This is the critical innovation. When no official API exists, use Brave Search to find the answer on official government websites, then use Gemini to EXTRACT (not generate) names from the search results.

**Search queries by position type**:
```
Mayor:     "[city] current mayor 2026"
Governor:  "[state/region] current governor 2026"
Council:   "[city] city council members 2026"
```

**Language-aware searches for non-English countries**:
```
France:    "[ville] maire actuel 2026"
Germany:   "[stadt] burgermeister aktuell 2026"
Italy:     "[citta] sindaco attuale 2026"
Spain:     "[ciudad] alcalde actual 2026"
Brazil:    "[cidade] prefeito atual 2026"
Japan:     "[city] 市長 現職 2026"
```

**Gemini extraction prompt** (critical -- Gemini must EXTRACT, never GENERATE):
```
You are a data extraction tool. From the following search results, extract the names
of current elected officials for [AREA].

RULES:
- ONLY return names that are explicitly mentioned in the search results below.
- DO NOT generate, guess, or infer any names.
- If no names are found in the results, return an empty array.
- For each name, include the source URL where it was found.

SEARCH RESULTS:
[Brave Search results pasted here]

Return JSON:
[{"name": "...", "position": "...", "sourceUrl": "..."}]
```

**Mark search-extracted results with confidence: "search-extracted"** and always show the source URL.

#### Step 6: Return with Source Attribution

Every officeholder returned to the user must include:

```typescript
interface OfficeholderResult {
  name: string;
  position: string;
  party: string | null;
  imageUrl: string | null;
  profileUrl: string | null;
  source: string;           // human-readable source name
  sourceUrl: string;        // URL to verify
  lastVerified: string;     // ISO timestamp of when this data was fetched
  confidence: 'official-api' | 'wikidata' | 'search-extracted';
}
```

If no data is found at any tier, return a clear message:
> "No verified officeholder data is available for this location. Frank only shows politicians from official sources to avoid errors."

**Never show a politician name without a source URL.**

---

## Part 5: What to Build (Priority Order)

### Phase 1: Cache layer (immediate)
1. Add SQLite `officeholder_cache` table to `store.ts`
2. Wrap existing API calls (`civic-data.ts`, `worldwide-civic.ts`) with cache-read/cache-write
3. Add `confidence` and `lastVerified` fields to all returned representative data

### Phase 2: Brave Search extraction (next)
1. Add officeholder-specific Brave Search queries to `brave.ts`
2. Add Gemini extraction prompt (extract from search results, never generate)
3. Wire into the lookup chain as Tier 3 fallback
4. Cache results with 1-day TTL

### Phase 3: CSV imports for high-value datasets (following)
1. UK: Open Council Data CSV import (18,645 local councillors)
2. France: RNE CSV import (all elected officials at all levels)
3. Italy: DAIT dataset import (all local/regional officials)
4. Run imports as weekly background job

### Phase 4: Additional APIs (later)
1. Open States API v3 for US state legislators
2. abgeordnetenwatch API for Germany
3. Camara/Senado APIs for Brazil

### Not planned (learned from EveryPolitician)
- No custom scrapers for parliament websites
- No attempt to cover every country from day one
- No Gemini-generated names, ever

---

## Part 6: The Lookup Chain as Code (Pseudocode)

```typescript
async function lookupOfficeholders(lat: number, lng: number): Promise<OfficeholderResult[]> {
  // 1. Detect country
  const geo = await detectCountry(lat, lng);
  if (!geo) return [];

  const cacheKey = `${geo.countryCode}:${geo.adminArea || 'national'}`;

  // 2. Check cache
  const cached = await getCachedOfficeholders(cacheKey);
  if (cached && !isExpired(cached)) {
    return cached.results;
  }

  // 3. Try country-specific API
  let results = await tryOfficialAPI(geo.countryCode, lat, lng, geo.adminArea);
  if (results.length > 0) {
    await cacheResults(cacheKey, results, '7d');
    return results;
  }

  // 4. Try Wikidata
  let wikidataResults = await queryWikidata(geo.countryCode, geo.adminArea);

  // 5. Brave Search verification
  let braveResults = await braveOfficeholderSearch(geo.adminArea, geo.countryCode);
  let extractedNames = await geminiExtractNames(braveResults);

  // 6. Merge and deduplicate
  // Prefer Brave-extracted (more current) over Wikidata (may be stale)
  // Cross-reference: if both agree, confidence is higher
  results = mergeAndDeduplicate(wikidataResults, extractedNames);

  if (results.length > 0) {
    await cacheResults(cacheKey, results, '1d');
  }

  return results;
}
```

---

## Part 7: Summary

| Approach | Verdict | Reason |
|---|---|---|
| A) Build own database | Rejected | EveryPolitician proved this is unsustainable |
| B) Real-time APIs only | Partially accepted | Works for Tier 1 countries, fails everywhere else |
| C) Hybrid with cache | Accepted | Best balance of accuracy, coverage, and maintenance |
| D) Layered lookup chain | **Recommended** | Progressive degradation from official APIs to Wikidata to Brave+Gemini extraction, with caching at every level |

The fundamental principle: **Gemini extracts, never generates.** Every politician name shown to a user must trace back to either an official API, a Wikidata entry, or a specific URL from a Brave Search result. The source is always shown. When no source can be found, Frank says so honestly rather than guessing.
