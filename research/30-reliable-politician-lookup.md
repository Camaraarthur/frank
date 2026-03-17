# Reliable Politician Lookup: Never Get a Name Wrong

*The definitive pipeline for Frank. Replaces Brave Search + Gemini guessing with official-source-first verification.*
*Date: 2026-03-17*

---

## The Problem

The current pipeline is:
1. Brave Search for `"{area}" elected officials current 2026"`
2. Feed search snippets to Gemini
3. Gemini "synthesises" -- but actually hallucinates names when search results are ambiguous or outdated

This WILL produce wrong names. Search snippets mention former officeholders, candidates who lost, people from neighbouring areas. Gemini picks whichever name appears most confidently and presents it as fact.

**The fix: Official government data first. Brave Search second. Gemini NEVER generates names -- only structures data it receives.**

---

## The Lookup Chain (Step by Step)

```
User enters area name (e.g. "Hackney", "San Francisco", "Lyon")
         |
         v
  STEP 1: Geocode to coordinates + country
         |  - Nominatim or our geocode service -> lat, lng, country_code
         |  - Also returns: admin hierarchy (state/region, county, municipality)
         |
         v
  STEP 2: Route by country_code to official data source
         |
    +----+----+----+----+----+----+----+
    |    |    |    |    |    |    |    |
    UK   US   CA   FR   DE   IT   BR  OTHER
    |    |    |    |    |    |    |    |
    v    v    v    v    v    v    v    v
  [Country-specific official API/dataset]
         |
         v
  STEP 3: Extract names FROM THE OFFICIAL SOURCE
         |  - Parse the API response / CSV row
         |  - Store: name, role, party, source_url, retrieved_at
         |
         v
  STEP 4: Find the official government website
         |  - Brave Search: site-restricted query (see templates below)
         |  - Scrape/fetch the official page to get:
         |    - Leader name (cross-reference with Step 3)
         |    - Recent council decisions / meeting minutes
         |    - Current policy priorities
         |
         v
  STEP 5: Verify currency
         |  - Is the name from Step 3 confirmed by Step 4?
         |  - Is the source date within the last 6 months?
         |  - If YES to both: mark as VERIFIED, show to user
         |  - If NO: mark as UNVERIFIED, show with caveat
         |  - If NO DATA: show "Official data unavailable" -- NEVER guess
         |
         v
  STEP 6: Enrich with recent news (optional, non-authoritative)
         |  - Brave Search for recent news about this government
         |  - Used for contested issues, NOT for names
         |  - Any name found here that contradicts Step 3 triggers a warning
         |
         v
  OUTPUT: Structured briefing with source attribution on every name
```

---

## Step 2: Country-Specific Official Sources

### United Kingdom

**National (MPs):**
- Source: UK Parliament Members API (free, no key, real-time)
- Endpoint: `https://members-api.parliament.uk/api/Location/Constituency/Search?searchText={constituency}`
- Input: constituency name (from postcodes.io via postcode/lat-lng)
- Returns: MP name, party, photo, profile URL
- **Already implemented in `civic-data.ts`**

**Local (Councillors):**
- Source: Open Council Data UK (CSV, updated continuously)
- URL: `https://opencouncildata.co.uk/csv.php`
- Coverage: 18,645 councillors across 369 councils in GB + 462 in NI
- Fields: council, councillor name, party, ward, email, URL
- **Strategy**: Download CSV on server start, refresh daily. Index by council name + ward name. Given a ward (from postcodes.io), look up all councillors for that ward.
- **Fallback**: Scrape the council's ModernGov page (see below)

**Council Leader / Mayor:**
- No single API for this. Use Brave Search targeting the official council website:
  - Query: `site:{council-slug}.gov.uk "leader" OR "mayor" OR "cabinet"`
  - Or fetch: `https://{council-slug}.moderngov.co.uk/mgMemberIndex.aspx`
  - Or fetch: `https://democracy.{council-slug}.gov.uk/mgMemberIndex.aspx`
- Parse the ModernGov page for the member listed as "Leader" or "Mayor"

**ModernGov scraping patterns** (350+ councils use this):
```
Base URL variants:
  {council}.moderngov.co.uk
  democracy.{council}.gov.uk
  moderngov.{council}.gov.uk

Key pages:
  /mgMemberIndex.aspx           -- All councillors (name, party, ward)
  /mgListCommittees.aspx         -- All committees
  /ieDocHome.aspx                -- Recent meetings
  /ieListDocuments.aspx?MId={id} -- Specific meeting agenda/minutes
```

Note: ModernGov returns 403 for some scraping attempts. Use a proper User-Agent header and consider caching aggressively. If blocked, fall back to Open Council Data CSV.

---

### United States

**All levels (federal through local):**
- Source: Google Civic Information API (free, requires Google API key)
- Endpoint: `https://civicinfo.googleapis.com/civicinfo/v2/representatives?address={address}&key={key}`
- Input: street address or lat,lng
- Returns: ALL officeholders at every level -- president, governor, state legislators, mayor, city council, school board, sheriff, etc.
- **Already implemented in `civic-data.ts`**
- **Caveat**: Coverage is patchy at hyperlocal levels (small municipalities, special districts)

**Federal only (higher reliability):**
- Source: Congress.gov API (free, API key from api.data.gov)
- Endpoint: `https://api.congress.gov/v3/member?stateCode={state}&district={district}`

**State legislators:**
- Source: Open States / Plural Policy API
- Endpoint: `https://v3.openstates.org/people?jurisdiction={state}&apikey={key}`
- Coverage: All 50 states + DC + Puerto Rico

**City councils (detailed):**
- Source: Legistar API (used by ~70% of large US cities)
- Endpoint: `https://webapi.legistar.com/v1/{city}/persons`
- Fields: PersonId, PersonFullName, active status
- Also: `/bodies`, `/events` (meetings), `/matters` (legislation)
- Contact fields are often null -- use for name verification, not contact info

**Official website lookup:**
- Brave Search: `"{city}" official website site:.gov`
- Or: `"{city}" city council members site:.gov`
- Most US cities: `{city}.gov/government/city-council`

---

### Canada

**All levels (federal, provincial, municipal):**
- Source: Open North Represent API (free, 60 req/min)
- Endpoint: `https://represent.opennorth.ca/representatives/?point={lat},{lng}`
- Returns: ALL representatives at every level for that point
- Fields: name, party, email, URL, photo, district, boundary set
- **This is the best single-API solution of any country**

---

### France

**All levels (every elected official in France):**
- Source: Repertoire National des Elus (RNE) via data.gouv.fr
- Download URLs:
  - Mayors: `https://www.data.gouv.fr/fr/datasets/r/2876a346-d50c-4911-934e-19ee07b0e503` (CSV, 4 MB)
  - Municipal councillors: `https://www.data.gouv.fr/fr/datasets/r/d5f400de-ae3f-4966-8cb6-a85c70c6c24a` (CSV, 58.6 MB)
  - Deputies: separate resource ID
  - Senators: separate resource ID
  - Departmental councillors: separate resource ID
  - Regional councillors: separate resource ID
- Updated: quarterly by Ministry of Interior (last: 2025-12-23)
- Separator: semicolon
- **Strategy**: Download mayors CSV + municipal councillors CSV on server start. Index by commune code (code INSEE). Given a commune name/code (from Nominatim), look up mayor + all councillors.
- **THIS IS THE GOLD STANDARD** -- one official dataset covering every elected official at every level

**Official website lookup:**
- Brave Search: `"mairie {city}" site:.fr`
- Pattern: `mairie-{city}.fr` or `{city}.fr`
- Also: `annuaire-mairie.fr/{city}.html` (directory of all French mairies)

---

### Germany

**National + State:**
- Source: abgeordnetenwatch.de API (free, CC0 license)
- Endpoint: `https://www.abgeordnetenwatch.de/api/v2/politicians?label={name}`
- Also: `https://www.abgeordnetenwatch.de/api/v2/candidacies-mandates?politician={id}`
- Coverage: Bundestag + all 16 Landtag (state) parliaments
- **No local coverage** -- mayors and Gemeinderaete not included

**National only (official):**
- Source: Bundestag Open Data
- URL: `https://www.bundestag.de/services/opendata`

**Local (gap):**
- No centralized API. Germany has ~11,000 municipalities.
- Brave Search: `"{city}" stadtrat mitglieder site:{city}.de`
- Or: `"Buergermeister {city}" {year}`

---

### Italy

**National:**
- Source: Camera dei Deputati SPARQL (free, CC BY-SA 4.0)
- Endpoint: `https://dati.camera.it/sparql`
- Source: Senato della Repubblica SPARQL
- Endpoint: `https://dati.senato.it/sparql`

**Local + Regional (all mayors, councillors):**
- Source: Ministry of Interior (DAIT) open data
- Download URLs:
  - All municipal administrators: `https://dait.interno.gov.it/documenti/ammcom.csv` (26.68 MB)
  - Mayors only: `https://dait.interno.gov.it/documenti/sindaciincarica.csv` (1.7 MB)
  - Regional administrators: `https://dait.interno.gov.it/documenti/ammreg.csv` (187 KB)
- Updated: 2026-02-03
- **Strategy**: Download sindaciincarica.csv (mayors) and ammcom.csv (all municipal admins). Index by comune name or ISTAT code.

---

### Brazil

**Federal deputies:**
- Source: Camara dos Deputados API (free, daily updates)
- Endpoint: `https://dadosabertos.camara.leg.br/api/v2/deputados`
- Returns: name, party, state, photo, email

**Federal senators:**
- Source: Senado Open Data
- Endpoint: `https://legis.senado.leg.br/dadosabertos/senador/lista/atual`

**Mayors and local officials:**
- Source: TSE (Tribunal Superior Eleitoral) Open Data
- URL: `https://dadosabertos.tse.jus.br/dataset`
- Contains election results at all levels (167 datasets)
- **Limitation**: Electoral data (who won) not a live registry. Between elections, resignations/deaths may not be reflected.
- **Fallback**: Brave Search: `"prefeito de {city}" {year} site:.gov.br`
- Official city websites: `prefeitura{city}.{state}.gov.br` or `{city}.{state}.gov.br`

---

### All Other Countries

**Fallback chain:**
1. Wikidata SPARQL for national legislators (see query below)
2. Brave Search for official government website
3. If found: scrape the member list page
4. If not found: show "Official data unavailable for this area"

**Wikidata SPARQL for current officeholders of any country:**
```sparql
SELECT ?person ?personLabel ?positionLabel ?districtLabel ?partyLabel WHERE {
  ?person p:P39 ?stmt.
  ?stmt ps:P39 ?position.
  ?position wdt:P279* wd:Q4175034.  # subclass of "legislator"
  FILTER NOT EXISTS { ?stmt pq:P582 ?end. }
  ?person wdt:P27 wd:{COUNTRY_QID}.
  OPTIONAL { ?stmt pq:P768 ?district. }
  OPTIONAL { ?person wdt:P102 ?party. }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}
```
Replace `{COUNTRY_QID}` with Wikidata QID (e.g. Q145 for UK, Q30 for US, Q142 for France).

**WARNING**: Wikidata is community-maintained. Missing end dates don't always mean "currently serving." Use ONLY as cross-reference, never primary.

---

## Step 4: Brave Search Query Templates for Official Websites

### Finding the Official Government Website

| Country | Query Template | Expected Domain |
|---------|---------------|-----------------|
| UK (council) | `"{council name}" council site:.gov.uk` | `{council}.gov.uk` |
| UK (council, alt) | `"{council name}" moderngov council members` | `{council}.moderngov.co.uk` |
| US (city) | `"{city name}" official website site:.gov` | `{city}.gov` |
| US (county) | `"{county name}" county government site:.gov` | `{county}county.gov` |
| France | `"mairie {city}" site:.fr` | `mairie-{city}.fr` or `{city}.fr` |
| Germany | `"{city}" stadtverwaltung site:.de` | `{city}.de` |
| Italy | `"comune di {city}" site:.it` | `comune.{city}.{province}.it` |
| Brazil | `"prefeitura {city}" site:.gov.br` | `{city}.{state}.gov.br` |
| Spain | `"ayuntamiento {city}" site:.es` | `{city}.es` |
| Canada | `"{city}" city government site:.ca` | `{city}.ca` |
| Australia | `"{city}" council site:.gov.au` | `{city}.{state}.gov.au` |
| Netherlands | `"gemeente {city}" site:.nl` | `{city}.nl` |
| Japan | `"{city}" site:.lg.jp` | `city.{city}.lg.jp` |

### Finding the Current Leader from the Official Website

| Country | Query Template |
|---------|---------------|
| UK | `site:{council}.gov.uk "leader of the council" OR "elected mayor"` |
| UK (ModernGov) | `site:{council}.moderngov.co.uk "leader" OR "mayor" OR "cabinet"` |
| US | `site:{city}.gov "mayor" OR "city council" "members"` |
| France | `site:mairie-{city}.fr "maire" OR "conseil municipal"` |
| Germany | `site:{city}.de "Buergermeister" OR "Oberbuergermeister"` |
| Italy | `site:comune.{city}.it "sindaco" OR "giunta"` |
| Brazil | `site:{city}.{state}.gov.br "prefeito" OR "vereadores"` |

### Finding Recent Decisions / Meeting Minutes

| Country | Query Template |
|---------|---------------|
| UK | `site:{council}.moderngov.co.uk "minutes" OR "decisions" 2026` |
| US | `site:{city}.legistar.com "agenda" OR "minutes" 2026` |
| France | `site:mairie-{city}.fr "conseil municipal" "deliberation" 2026` |
| Italy | `site:comune.{city}.it "delibere" OR "determine" 2026` |
| Brazil | `site:{city}.{state}.gov.br "ata" OR "pauta" "camara" 2026` |

### Forcing Current Year to Avoid Stale Results

Always append the current year to governance queries:
```
"prefeito de {city}" {year}
"mayor of {city}" {year}
"{area}" council leader {year}
```

---

## Step 5: How to Verify Currency (Is This Person Still in Office?)

### Verification Checklist

A name is considered VERIFIED if:
1. It comes from an official API that returns `isCurrentMember: true` or equivalent
2. The API data was retrieved within the last 7 days
3. OR it appears on the official government website with no end date listed

A name is considered PROBABLE if:
1. It comes from an official dataset (CSV) updated within the last 6 months
2. AND no contradicting source has been found

A name is considered STALE if:
1. The source dataset was last updated more than 6 months ago
2. OR Brave Search returns news of a resignation/election since the dataset date

A name is considered UNKNOWN if:
1. No official source returned data for this area
2. AND Brave Search found no official government page listing members

### What to Show for Each Trust Level

| Trust Level | Display | Source Badge |
|-------------|---------|-------------|
| VERIFIED | "John Smith (Labour)" | "Source: UK Parliament API, retrieved 2026-03-17" |
| PROBABLE | "John Smith (Labour)" | "Source: Open Council Data UK, dataset dated 2026-03-10" |
| STALE | "John Smith (Labour) -- may be outdated" | "Source: RNE France, last updated 2025-12-23" |
| UNKNOWN | "Official data not available for this area" | "We could not find a verified source" |

**NEVER show a name without a source. NEVER let Gemini fill in the blank.**

---

## Scraping Patterns for Common Government Website Types

### UK: ModernGov Member Index (`/mgMemberIndex.aspx`)

ModernGov is used by 350+ UK councils. The member index page lists all councillors.

**URL patterns to try (in order):**
1. `https://{council}.moderngov.co.uk/mgMemberIndex.aspx`
2. `https://democracy.{council}.gov.uk/mgMemberIndex.aspx`
3. `https://moderngov.{council}.gov.uk/mgMemberIndex.aspx`

**Note**: Some councils (e.g. Hackney, Tower Hamlets) return 403 on direct fetch. For these, the Open Council Data CSV is the fallback.

**What to extract:**
- Councillor name (link text)
- Party (listed next to name or in a column)
- Ward (listed in a column)
- Profile URL (the href on the councillor's name link)

**ModernGov API** (undocumented but exists on some instances):
- `https://{base}/mgWebService.asmx` -- SOAP web service
- Not reliable across all councils; prefer CSV scraping

---

### US: Legistar API (`webapi.legistar.com`)

Legistar is used by ~70% of large US cities. Has a real REST API.

**Endpoint**: `https://webapi.legistar.com/v1/{client}/persons`
**Returns**: PersonId, PersonFullName, PersonActiveFlag
**Filtering**: `?$filter=PersonActiveFlag eq 1` for current members
**Bodies**: `https://webapi.legistar.com/v1/{client}/bodies` -- committees and council
**Events**: `https://webapi.legistar.com/v1/{client}/events` -- meetings with agendas

**Client slugs for major cities:**
- San Francisco: `sfgov`
- New York City: `nyc` (also `legistar.council.nyc.gov`)
- Chicago: `chicago`
- Philadelphia: `phila`
- Oakland: `oakland`
- Seattle: `seattle`
- Long Beach: `longbeach`
- San Jose: `sanjose`

**Discovery**: If you don't know the client slug, Brave Search `"{city}" legistar` usually finds it.

---

### France: RNE CSV

The RNE (Repertoire National des Elus) is a single CSV covering every elected official in France.

**For mayors:**
- Download: `https://www.data.gouv.fr/fr/datasets/r/2876a346-d50c-4911-934e-19ee07b0e503`
- Separator: semicolon
- Key columns: Code commune, Nom, Prenom, Sexe, Date de naissance, Libelle de la commune, Date de debut du mandat
- Index by: Code commune (INSEE code, obtainable from Nominatim `address.municipality` + INSEE lookup)

**For all municipal councillors:**
- Download: `https://www.data.gouv.fr/fr/datasets/r/d5f400de-ae3f-4966-8cb6-a85c70c6c24a`
- Same structure, larger file (58.6 MB, ~500k rows)

**Lookup flow:**
1. Nominatim reverse geocode -> get commune name
2. Look up INSEE code for that commune (via `https://geo.api.gouv.fr/communes?nom={name}`)
3. Find mayor row in CSV where `Code commune` matches
4. Return: `{Prenom} {Nom}`, source: "RNE, Ministere de l'Interieur, updated {date}"

---

### Italy: DAIT CSV

**For mayors:**
- Download: `https://dait.interno.gov.it/documenti/sindaciincarica.csv` (1.7 MB)
- Index by: comune name or ISTAT code

**For all municipal administrators:**
- Download: `https://dait.interno.gov.it/documenti/ammcom.csv` (26.68 MB)

**Lookup flow:**
1. Nominatim reverse geocode -> get comune name
2. Find row in CSV where comune matches
3. Return name + role + party, source: "Ministero dell'Interno DAIT, updated 2026-02-03"

---

### Brazil: Prefeitura Websites

No single API for all mayors. TSE has election results but not a live registry.

**Lookup flow:**
1. Brave Search: `"prefeito de {city}" {year} site:.gov.br`
2. If a `.gov.br` result names a person, use that as source
3. Cross-reference with TSE election results for that municipality
4. If no `.gov.br` result: `"prefeito de {city}" {year}` (general search)
5. Only show name if found on an official `.gov.br` domain

---

## Recommended Architecture

### Data Layer (runs on server start, refreshes daily)

```
On server start:
  1. Download and index these CSV datasets:
     - Open Council Data UK (councillors.csv) -> Map<council+ward, Councillor[]>
     - France RNE mayors CSV -> Map<commune_code, Mayor>
     - France RNE municipal councillors CSV -> Map<commune_code, Councillor[]>
     - Italy DAIT sindaciincarica.csv -> Map<comune_name, Sindaco>
     - Italy DAIT ammcom.csv -> Map<comune_name, Admin[]>
  2. These CSVs total ~90MB. Load into memory as Maps for O(1) lookup.
  3. Store download timestamp. Re-download if >24 hours old.
  4. Log: "[CivicData] Loaded {n} UK councillors, {n} French mayors, {n} Italian sindaci"
```

### Request Pipeline (runs per area research request)

```typescript
async function lookupOfficeholders(area: string): Promise<OfficeholderResult[]> {
  // Step 1: Geocode
  const geo = await geocode(area);  // -> { lat, lng, country_code, admin_hierarchy }

  // Step 2: Route by country
  const results: OfficeholderResult[] = [];

  switch (geo.country_code) {
    case 'GB':
      // National: Parliament API (already implemented)
      const mp = await getUKMP(geo.postcode || geo.constituency);
      if (mp) results.push({ ...mp, trust: 'VERIFIED' });

      // Local: Open Council Data CSV lookup
      const councillors = ukCouncillorIndex.get(wardKey(geo.ward, geo.council));
      if (councillors) {
        councillors.forEach(c => results.push({ ...c, trust: 'PROBABLE' }));
      }

      // Council leader: Brave Search on official site
      const leaderResult = await findCouncilLeader(geo.council);
      if (leaderResult) results.push({ ...leaderResult, trust: 'PROBABLE' });
      break;

    case 'US':
      // Google Civic API (already implemented)
      const usReps = await getUSRepresentatives(geo.address);
      usReps.forEach(r => results.push({ ...r, trust: 'VERIFIED' }));

      // Supplement with Legistar if available
      const legistarSlug = legistarLookup.get(geo.city);
      if (legistarSlug) {
        const council = await fetchLegistarPersons(legistarSlug);
        // Cross-reference with Google Civic results
      }
      break;

    case 'CA':
      // Represent API -- single call, all levels
      const caReps = await fetch(
        `https://represent.opennorth.ca/representatives/?point=${geo.lat},${geo.lng}`
      ).then(r => r.json());
      caReps.objects.forEach(r => results.push({
        name: r.name, role: r.elected_office, party: r.party_name,
        source: 'Open North Represent API', sourceUrl: r.url,
        trust: 'VERIFIED'
      }));
      break;

    case 'FR':
      // RNE CSV lookup
      const communeCode = await getINSEECode(geo.commune);
      const maire = frenchMayorIndex.get(communeCode);
      if (maire) results.push({ ...maire, trust: 'PROBABLE' });
      const conseillers = frenchCouncillorIndex.get(communeCode);
      if (conseillers) conseillers.forEach(c => results.push({ ...c, trust: 'PROBABLE' }));

      // National: Assemblee Nationale API for depute
      const depute = await getDeputeForCirconscription(geo.department, geo.circonscription);
      if (depute) results.push({ ...depute, trust: 'VERIFIED' });
      break;

    case 'DE':
      // National + State: abgeordnetenwatch
      const deReps = await getAbgeordnetenwatch(geo.state, geo.constituency);
      deReps.forEach(r => results.push({ ...r, trust: 'VERIFIED' }));
      // Local: Brave Search on official city website
      const bgm = await findGermanMayor(geo.city);
      if (bgm) results.push({ ...bgm, trust: 'PROBABLE' });
      break;

    case 'IT':
      // DAIT CSV lookup for sindaco
      const sindaco = italianMayorIndex.get(geo.comune);
      if (sindaco) results.push({ ...sindaco, trust: 'PROBABLE' });
      // National: Camera SPARQL (complex, implement later)
      break;

    case 'BR':
      // Federal: Camara API for deputado
      const dep = await getCamaraDeputado(geo.state);
      if (dep) results.push({ ...dep, trust: 'VERIFIED' });
      // Local: Brave Search for prefeito
      const prefeito = await findBrazilianMayor(geo.city, geo.state);
      if (prefeito) results.push({ ...prefeito, trust: 'PROBABLE' });
      break;

    default:
      // Wikidata SPARQL for national legislators
      const wdReps = await queryWikidataLegislators(geo.country_code);
      wdReps.forEach(r => results.push({ ...r, trust: 'STALE' })); // Wikidata = never fully trusted
      break;
  }

  // Step 3: If no results from official sources, try Brave Search
  if (results.length === 0) {
    const searchResults = await braveSearchOfficials(area, geo.country_code);
    // Only use results from .gov / .gov.xx domains
    searchResults
      .filter(r => isOfficialDomain(r.url))
      .forEach(r => results.push({ ...r, trust: 'PROBABLE' }));
  }

  // Step 4: If STILL no results, return empty with explanation
  if (results.length === 0) {
    results.push({
      name: null,
      role: 'Unknown',
      trust: 'UNKNOWN',
      message: 'Official data not available for this area. We are working on expanding coverage.'
    });
  }

  return results;
}
```

### What Gemini's Role Becomes

Gemini NEVER generates politician names. Its role is:

1. **Structuring**: Given verified officeholder data + search results, produce the `governingBodies` JSON array with proper `level`, `keyPolicies`, etc.
2. **Summarising**: Write the `summary` field based on real data
3. **Identifying issues**: Extract `contestedIssues` from search results (with source URLs)
4. **Interview themes**: Suggest themes based on real issues found

The prompt to Gemini changes from:
> "Produce a briefing on {area}" (current -- Gemini invents names)

To:
> "Here are the VERIFIED officeholders for {area}: [list]. Here are search results about this area: [results]. Structure this into a briefing. Do NOT add any politician names not in the verified list. If a governing body exists but we have no verified name, set representative to null."

### Data Types

```typescript
interface OfficeholderResult {
  name: string | null;          // null = we don't know
  role: string;                 // "Mayor", "Ward Councillor", "MP", etc.
  party: string | null;
  area: string;                 // The area they represent
  trust: 'VERIFIED' | 'PROBABLE' | 'STALE' | 'UNKNOWN';
  source: string;               // "UK Parliament API", "Open Council Data UK", etc.
  sourceUrl: string;             // Direct URL to the source
  retrievedAt: string;           // ISO timestamp
  message?: string;              // Only for UNKNOWN -- explains why
}
```

---

## When to Show "Unknown" vs a Name

| Scenario | Show |
|----------|------|
| Official API returns current member | The name (VERIFIED) |
| Official CSV dataset has a match, updated <6 months ago | The name (PROBABLE) |
| Brave Search finds name on `.gov` domain, current year | The name (PROBABLE) |
| Official CSV dataset has a match, updated >6 months ago | The name + "may be outdated" (STALE) |
| Wikidata has a name but no official source confirms | The name + "from community data, unconfirmed" (STALE) |
| Brave Search finds name only on news/Wikipedia, not `.gov` | DO NOT SHOW -- too risky |
| No source found at all | "Official data not available" (UNKNOWN) |
| Gemini "knows" the answer | NEVER SHOW -- this is a hallucination |

---

## Migration Path from Current Code

### Current code (`research.ts` lines 66-73):
```typescript
// These Brave searches ask Gemini to guess names from search snippets
braveSearch(`"${area}" elected officials current ${year}`, 5),
braveSearch(`"${area}" mayor council president chair ${year}`, 5),
```

### New code should:
1. Call `lookupOfficeholders(area)` FIRST -- get verified names
2. Pass those names to Gemini as FACT, not as something to discover
3. Still run Brave Search for issues, demographics, news -- but NOT for names
4. In the Gemini prompt, add: `"VERIFIED OFFICEHOLDERS (do not modify or add to this list): [...]"`

### Files to modify:
- `/home/arthur/beat/server/src/routes/research.ts` -- main pipeline
- `/home/arthur/beat/server/src/civic-data.ts` -- add CSV loaders, new country handlers
- `/home/arthur/beat/server/src/brave.ts` -- add official-site-targeted search functions
- New file: `/home/arthur/beat/server/src/officeholder-lookup.ts` -- the lookup chain

---

## Appendix: Official Domain Patterns by Country

Use these to filter Brave Search results -- only trust names found on official domains.

| Country | Official Patterns |
|---------|------------------|
| UK | `.gov.uk`, `.parliament.uk`, `.moderngov.co.uk` |
| US | `.gov`, `.us` (state/local) |
| Canada | `.gc.ca` (federal), `.ca` (provincial/municipal) |
| France | `.gouv.fr`, `.fr` (mairies) |
| Germany | `.de` (municipal), `.bundestag.de`, `.landtag.*.de` |
| Italy | `.gov.it`, `.comune.*.it`, `.camera.it`, `.senato.it` |
| Brazil | `.gov.br`, `.leg.br`, `.jus.br` |
| Spain | `.gob.es`, `.es` (municipal) |
| Australia | `.gov.au` |
| Japan | `.go.jp`, `.lg.jp` |
| Netherlands | `.overheid.nl`, `.nl` (municipal) |
| Sweden | `.gov.se`, `.se` (municipal) |

---

## Summary

The pipeline priority is:

1. **Official API** (Parliament, Google Civic, Represent, etc.) -- VERIFIED
2. **Official dataset** (RNE, DAIT, Open Council Data, TSE) -- PROBABLE
3. **Official website** (found via Brave Search, `.gov` domain) -- PROBABLE
4. **Wikidata SPARQL** (cross-reference only) -- STALE
5. **General Brave Search** (news, Wikipedia) -- DO NOT USE FOR NAMES
6. **Gemini generation** -- ABSOLUTELY NEVER

If steps 1-4 all fail, show "Official data not available." That honest answer is infinitely better than a hallucinated wrong name shown to a user who then takes it to a real politician.
