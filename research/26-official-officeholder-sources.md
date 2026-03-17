# Audit: Official Government Sources for Current Elected Officials

*Critical audit for Frank/Beat - eliminating Gemini hallucination of politician names*
*Date: 2026-03-17*

---

## The Problem

Frank currently uses Gemini to **generate** politician names, which hallucinates. Gemini should only be used to **structure** data (parse, format, categorize), never to **generate** names. Every politician name shown to users must come from either:

1. An **official government API or dataset**, or
2. A **verified Brave Search result** (with source URL)

---

## Country-by-Country Audit

### 1. United Kingdom

#### National: UK Parliament Members API
- **URL**: `https://members-api.parliament.uk`
- **API**: YES (REST, JSON, OpenAPI spec at `/swagger/v1/swagger.json`)
- **Levels**: MPs (House of Commons) + Lords (House of Lords) only. **NO local councillors.**
- **Current**: YES - official Parliament data, updated in real time
- **Free**: YES
- **Key endpoints**:
  - `/api/Members/Search` - search current members
  - `/api/Members/{id}` - member details, biography, contact
  - `/api/Posts/GovernmentPosts` - current government ministers
  - `/api/Location/Constituency/Search` - constituency lookup
- **We already use this**: YES

#### Local: Open Council Data UK
- **URL**: `https://opencouncildata.co.uk`
- **API**: NO (CSV downloads only, no REST API)
- **Levels**: Local councillors across 369 councils (18,645 councillors in GB + 462 in NI)
- **Current**: YES - GB data last updated 2026-03-17, NI data 2026-02-11
- **Free**: YES
- **Covers**: County Councils, District Councils, Metropolitan Boroughs, Unitary Authorities, London, Scotland, Wales, Northern Ireland
- **Limitation**: CSV only - would need periodic download and import. Not an official government source; community-maintained by psephologists. But the data is sourced from council websites.

#### Local Alternative: democracy.club
- **URL**: `https://candidates.democracyclub.org.uk`
- **API**: YES (REST)
- **Notes**: Crowdsourced candidate data for elections. More focused on candidates than current officeholders.

#### VERDICT (UK):
- **National**: Parliament API is excellent. USE IT.
- **Local**: No official government API exists for all councillors. Open Council Data UK (CSV) is the best available source. For a specific council, scraping individual council websites or using TheyWorkForYou may be needed. **Gap exists.**

---

### 2. United States

#### Federal: Congress.gov API
- **URL**: `https://api.congress.gov`
- **API**: YES (REST, JSON/XML)
- **Levels**: Federal only - House of Representatives + Senate
- **Current**: YES - maintained by Library of Congress
- **Free**: YES (requires API key from api.data.gov)
- **Key endpoints**: `/member` - current and historical members of Congress

#### State: Open States (now Plural Policy)
- **URL**: `https://v3.openstates.org` (redirects to `open.pluralpolicy.com`)
- **API**: YES (REST + GraphQL)
- **Levels**: State legislators in all 50 states + DC + Puerto Rico + US Congress
- **Current**: YES - scrapers run multiple times daily from official state sources
- **Free**: YES
- **Notes**: Actively maintained since 2021 by Plural (policy software company). **Does NOT cover local officials.**

#### All Levels: Google Civic Information API
- **URL**: `https://www.googleapis.com/civicinfo/v2`
- **API**: YES (REST, JSON)
- **Levels**: Potentially ALL levels - federal, state, county, city, school board, special districts
- **Current**: YES (pulls from multiple official sources)
- **Free**: YES (requires Google API key)
- **Key endpoints**:
  - `/representatives` - returns all representatives for a given address
  - `/divisions` - search political divisions by name or OCD ID
  - `/elections` - available elections
- **HOW IT WORKS**: Pass a US address, get back all officeholders at every level for that address
- **CRITICAL CAVEAT**: Coverage is **inconsistent** at local levels. Some municipalities and school boards are not covered. More reliable for federal/state, patchy for hyperlocal.
- **We already use this**: YES (for US)

#### VERDICT (US):
- **Federal**: Congress.gov API (authoritative) or Google Civic API
- **State**: Open States / Plural Policy (comprehensive)
- **Local**: Google Civic API is the ONLY option covering local levels, but coverage is patchy. No single government API covers all US local officials (there are 90,000+ local governments).

---

### 3. Canada

#### All Levels: Represent API (Open North)
- **URL**: `https://represent.opennorth.ca`
- **API**: YES (REST, JSON)
- **Levels**: Federal (MPs) + Provincial (MLAs/MPPs/MNAs/MHAs) + Municipal (7,000+ mayors and councillors) + 8,000+ municipal wards
- **Current**: Update frequency not documented; data sourced from official government sources
- **Free**: YES (open source)
- **We already use this**: YES

#### VERDICT (Canada):
- Represent API is **the best single source in any country** - covers all three levels. But currency of municipal data is uncertain. Federal/provincial data appears reliable. **Recommend periodic spot-checks against official sources.**

---

### 4. France

#### All Levels: Répertoire National des Élus (RNE)
- **URL**: `https://www.data.gouv.fr/datasets/repertoire-national-des-elus-1`
- **API**: YES (data.gouv.fr API for dataset access) + CSV downloads
- **Levels**: ALL levels - députés, sénateurs, maires, conseillers municipaux, conseillers départementaux, conseillers régionaux, MEPs, overseas representatives (12 categories total)
- **Current**: YES - updated quarterly by Ministry of Interior. Last update: 2025-12-23.
- **Free**: YES
- **Source**: Official government data compiled from prefectures and municipal authorities
- **THIS IS THE GOLD STANDARD** - one official dataset covering every elected official in France at every level.

#### National (Alternative): Assemblée Nationale Open Data
- **URL**: `https://data.assemblee-nationale.fr`
- **API**: YES
- **Levels**: Députés only
- **Notes**: More detailed legislative activity data than RNE

#### National (Alternative): NosDéputés.fr / NosSénateurs.fr
- **Status**: NosSénateurs.fr is **SHUT DOWN** (ceased operations March 2023). Archive only at archive.nossenateurs.fr.
- NosDéputés.fr returned 503 error - may also be down.
- **DO NOT RELY ON THESE**

#### VERDICT (France):
- **RNE on data.gouv.fr is excellent** - official, comprehensive, all levels. Use this as primary source.
- Quarterly updates mean there could be up to 3-month lag after elections.

---

### 5. Germany

#### National + State: abgeordnetenwatch.de API
- **URL**: `https://www.abgeordnetenwatch.de/api`
- **API**: YES (REST, JSON)
- **Levels**: Bundestag + European Parliament + all 16 Landtag (state) parliaments
- **Current**: YES
- **Free**: YES (CC0 license)
- **Key endpoints**:
  - `/api/v2/parliaments` - list all parliaments
  - `/api/v2/politicians` - politician data
  - `/api/v2/candidacies-mandates` - current mandates
- **Limitation**: **NO local/municipal officials** (no Bürgermeister, Gemeinderäte, etc.)
- **Note**: This is a civil society organization (NGO), not an official government source. But data is sourced from official records.

#### National: Bundestag Open Data
- **URL**: `https://www.bundestag.de/services/opendata`
- **API**: YES (DIP API) + XML/JSON downloads
- **Levels**: Bundestag members only
- **Current**: YES - biography data of all MdBs since 1949
- **Free**: YES

#### VERDICT (Germany):
- **National**: Bundestag open data (official) or abgeordnetenwatch (more convenient API)
- **State**: abgeordnetenwatch covers all 16 Landtage
- **Local**: **NO source identified.** Germany has ~11,000 municipalities. No centralized database of local officials exists. **Major gap.**

---

### 6. Italy

#### National: Camera dei Deputati (Chamber of Deputies)
- **URL**: `https://dati.camera.it`
- **API**: YES (SPARQL endpoint at `https://dati.camera.it/sparql`)
- **Levels**: Deputies (lower house) only
- **Current**: YES - 725M+ RDF triples, updated regularly (last: 2026-03-17)
- **Free**: YES (CC BY-SA 4.0)

#### National: Senato della Repubblica (Senate)
- **URL**: `https://dati.senato.it`
- **API**: YES (SPARQL endpoint) + CSV/JSON/XML downloads
- **Levels**: Senators only
- **Current**: YES
- **Free**: YES (CC BY 3.0)

#### Local + Regional: Ministry of Interior (DAIT)
- **URL**: `https://dait.interno.gov.it/elezioni/open-data`
- **API**: NO (downloadable datasets only)
- **Levels**: ALL local and regional officials - sindaci (mayors), consiglieri comunali, provinciali, regionali
- **Current**: YES - "Amministratori locali e regionali in carica" last updated 2026-02-03
- **Free**: YES
- **THIS IS THE KEY SOURCE** - official government registry of all local/regional administrators

#### VERDICT (Italy):
- **National**: Camera SPARQL + Senato SPARQL (both official, both SPARQL which is more complex to query)
- **Local/Regional**: Ministry of Interior dataset is excellent - covers all local officials. Download-only, no REST API.
- **Good overall coverage** but requires multiple sources and SPARQL expertise.

---

### 7. Brazil

#### Federal Deputies: Câmara dos Deputados API
- **URL**: `https://dadosabertos.camara.leg.br`
- **API**: YES (REST, JSON/XML/CSV)
- **Levels**: Federal deputies only
- **Current**: YES - daily updates
- **Free**: YES

#### Federal Senators: Senado Open Data
- **URL**: `https://www12.senado.leg.br/dados-abertos`
- **API**: YES (REST)
- **Levels**: Federal senators only
- **Current**: YES
- **Free**: YES

#### All Levels (Electoral): TSE Open Data
- **URL**: `https://dadosabertos.tse.jus.br`
- **API**: YES (CKAN API)
- **Levels**: ALL elected positions - president, governors, senators, federal/state deputies, mayors, city councillors (167 datasets)
- **Current**: YES - replaced old repository in 2022
- **Free**: YES (fully open)
- **Note**: This is ELECTORAL data (who won elections) rather than a live registry of current officeholders. Officials who resign/die between elections may not be immediately reflected.

#### VERDICT (Brazil):
- **Federal**: Excellent APIs for both Câmara and Senado
- **State/Local**: TSE provides election results at all levels. For current officeholders between elections, may need to cross-reference.
- **Overall good coverage**

---

### 8. Spain

#### National Congress (Congreso de los Diputados)
- **URL**: `https://www.congreso.es`
- **API**: Limited. Website returned 403 on open-data pages. No well-documented REST API found.
- **Levels**: Federal deputies
- **Current**: Website lists current deputies but structured data access is poor
- **Free**: YES (what's available)

#### Senate (Senado)
- **URL**: `https://www.senado.es`
- **API**: NO documented API. Website returned 403.
- **Levels**: Senators
- **Notes**: Website lists current senators but no programmatic access confirmed

#### VERDICT (Spain):
- **Poor API infrastructure.** May need to scrape congreso.es/senado.es or use Wikidata as fallback.
- **Local**: No centralized source identified for ayuntamientos (municipalities).
- **Major gap.**

---

### 9. Netherlands

#### National: Tweede Kamer (House of Representatives) Open Data
- **URL**: `https://opendata.tweedekamer.nl`
- **API**: YES (OData API for queries + SyncFeed API for synchronization)
- **Levels**: Members of the Tweede Kamer (lower house)
- **Current**: YES
- **Free**: YES
- **Formats**: JSON (OData), XML (Atom/SyncFeed)

#### VERDICT (Netherlands):
- **National**: OData API is good for lower house.
- **Senate (Eerste Kamer)**: Not confirmed - likely available on their website but no API documented.
- **Local**: No centralized source identified for gemeenteraadsleden (municipal councillors). **Gap.**

---

### 10. Sweden

#### National: Riksdag Open Data
- **URL**: `https://www.riksdagen.se/sv/dokument-och-lagar/riksdagens-oppna-data/`
- **API**: YES
- **Levels**: Riksdag members (current + historical since ~1990)
- **Current**: YES
- **Free**: YES (no fees, no license - just cite Riksdag as source)
- **Also includes**: Voting records, speeches, documents (back to 1961)

#### VERDICT (Sweden):
- **National**: Excellent official API.
- **Local**: No centralized source for kommunfullmäktige (municipal councillors). **Gap.**

---

### 11. Australia

#### National: OpenAustralia API
- **URL**: `https://www.openaustralia.org.au/api`
- **API**: YES (REST, XML/JSON/PHP)
- **Levels**: Federal Parliament only (House of Representatives + Senate)
- **Current**: YES
- **Free**: YES for low-volume non-commercial use
- **Note**: This is a civil society project (like TheyWorkForYou), not official government.

#### Official: Parliament of Australia
- **URL**: `https://www.aph.gov.au/Senators_and_Members`
- **API**: NO confirmed REST API. Website has search/browse for members but no documented programmatic access.
- **Notes**: ParlInfo search system exists but API access unclear.

#### VERDICT (Australia):
- **National**: OpenAustralia API works but is not official. Official Parliament website lacks a documented API.
- **State/Local**: No centralized source. Each state parliament would need separate handling. **Gap.**

---

### 12. Japan

#### National: National Diet
- **URL**: `https://www.shugiin.go.jp` (House of Representatives), `https://www.sangiin.go.jp` (House of Councillors)
- **API**: NO confirmed REST API for member data
- **Notes**: National Diet Library has APIs for legislative documents but member data is website-only

#### VERDICT (Japan):
- **No API for elected officials.** Would need scraping or Wikidata.
- **Major gap.**

---

### 13. India

#### National: Sansad (Parliament)
- **URL**: `https://sansad.in/ls/members` (Lok Sabha), `https://sansad.in/rs/members` (Rajya Sabha)
- **API**: NO REST API
- **Levels**: Lists current MPs on website with filtering by name, party, constituency, state
- **Export**: Excel download available, plus "Party Position" and "Bilingual List" downloads
- **Free**: YES

#### VERDICT (India):
- **No API.** Excel downloads from sansad.in are the best official source.
- **State/Local**: No centralized source for MLAs or municipal councillors. Each state assembly has its own website. **Major gap.**

---

### 14. South Africa

#### National: Parliament of South Africa
- **URL**: `https://www.parliament.gov.za`
- **API**: NO
- **Levels**: National Assembly + NCOP members listed on website
- **Notes**: Website lists members but no documented API or structured data export

#### VERDICT (South Africa):
- **No API.** Website only. Would need scraping or Wikidata.

---

## Global / Cross-Country Sources

### Wikidata (EveryPolitician)
- **URL**: `https://query.wikidata.org/sparql`
- **Coverage**: 663K+ politicians, 259 countries
- **API**: YES (SPARQL)
- **Free**: YES (CC0)
- **Can filter current officeholders**: YES - query for P39 (position held) with no P582 (end date) qualifier
- **Sample SPARQL for current officeholders**:
  ```sparql
  SELECT ?person ?personLabel ?position ?positionLabel ?constituency ?constituencyLabel WHERE {
    ?person p:P39 ?stmt.
    ?stmt ps:P39 ?position.
    OPTIONAL { ?stmt pq:P768 ?constituency. }
    FILTER NOT EXISTS { ?stmt pq:P582 ?endDate. }
    ?position wdt:P279* wd:Q4175034.  # legislator
    SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
  }
  ```
- **CRITICAL ISSUES**:
  1. Data can be **stale** - volunteers update it, not governments
  2. Missing end dates don't always mean "currently serving" - sometimes the end date was simply never added
  3. Better for some countries than others (UK/US/France well-covered, smaller countries less so)
  4. Includes dead politicians if end dates are missing
- **USE AS**: Fallback/cross-reference, NOT primary source

### EveryPolitician.org
- **URL**: `https://everypolitician.org`
- **Status**: Still active as a Wikidata-based project
- **Coverage**: 663K politicians, 175K positions, 259 countries
- **Tools**: PoliLoom (data enrichment), GovDirectory (government structure mapping)
- **License**: CC BY-NC 4.0
- **Note**: Community-driven, not official. Data quality varies.

### CIA World Factbook
- **Heads of state/government only** - not useful for legislators or local officials
- Good for verifying who is president/PM of a country

---

## Summary Matrix: What's Available vs What's Needed

| Country | National API | State/Regional API | Local API | Best Source | Reliability |
|---------|-------------|-------------------|-----------|-------------|-------------|
| **UK** | Parliament API | N/A | CSV only (OpenCouncilData) | Parliament API + OpenCouncilData CSV | HIGH (national) / MEDIUM (local) |
| **US** | Congress.gov API | Open States API | Google Civic (patchy) | Google Civic for all levels | HIGH (fed/state) / MEDIUM (local) |
| **Canada** | Represent API | Represent API | Represent API | Represent API (all levels) | HIGH (fed/prov) / MEDIUM (municipal) |
| **France** | RNE (data.gouv.fr) | RNE | RNE | RNE - covers everything | HIGH |
| **Germany** | Bundestag API | abgeordnetenwatch | NONE | abgeordnetenwatch (nat+state) | HIGH (nat/state) / NONE (local) |
| **Italy** | Camera + Senato SPARQL | Min. Interior dataset | Min. Interior dataset | Multiple sources needed | HIGH |
| **Brazil** | Câmara + Senado APIs | TSE election data | TSE election data | Câmara/Senado APIs + TSE | HIGH |
| **Spain** | Website only (no API) | NONE | NONE | Wikidata fallback | LOW |
| **Netherlands** | Tweede Kamer OData | NONE | NONE | OData API | MEDIUM |
| **Sweden** | Riksdag API | NONE | NONE | Riksdag API | HIGH (national only) |
| **Australia** | OpenAustralia API | NONE | NONE | OpenAustralia | MEDIUM |
| **Japan** | NONE | NONE | NONE | Wikidata fallback | LOW |
| **India** | Excel downloads | NONE | NONE | sansad.in Excel | LOW-MEDIUM |
| **South Africa** | NONE | NONE | NONE | Wikidata fallback | LOW |

---

## Recommended Data Strategy for Frank

### Tier 1: Official API (highest trust, use directly)
These sources have real-time or near-real-time APIs. Query them live or cache with short TTL.

| Country | Source | Endpoint |
|---------|--------|----------|
| UK (national) | Parliament Members API | `members-api.parliament.uk/api/Members/Search` |
| US (federal) | Congress.gov API | `api.congress.gov/v3/member` |
| US (all levels) | Google Civic Info API | `googleapis.com/civicinfo/v2/representatives` |
| US (state) | Open States API | `v3.openstates.org/people` |
| Canada (all) | Represent API | `represent.opennorth.ca/representatives/` |
| France (all) | RNE via data.gouv.fr | `data.gouv.fr` dataset download |
| Germany (nat+state) | abgeordnetenwatch API | `abgeordnetenwatch.de/api/v2/politicians` |
| Brazil (deputies) | Câmara API | `dadosabertos.camara.leg.br/api/v2/deputados` |
| Brazil (senators) | Senado API | `www12.senado.leg.br/dados-abertos` |
| Netherlands | Tweede Kamer OData | `opendata.tweedekamer.nl` |
| Sweden | Riksdag API | `riksdagen.se` open data |

### Tier 2: Official Dataset (download periodically)
These are official government data but require periodic download rather than live API calls.

| Country | Source | Format | Update Frequency |
|---------|--------|--------|-----------------|
| UK (local) | Open Council Data UK | CSV | Continuously updated |
| France (all) | RNE | CSV | Quarterly |
| Italy (national) | Camera + Senato | SPARQL/RDF | Regular |
| Italy (local) | Min. Interior DAIT | Download | Updated when officials change |
| Brazil (all levels) | TSE | CKAN/CSV | After elections |
| India (national) | sansad.in | Excel | When composition changes |
| Germany (national) | Bundestag | XML | Regular |

### Tier 3: Brave Search Verification (for gaps)
For countries/levels without official APIs, use Brave Search to find and verify names from official government websites. Always include the source URL.

| Country | What to search | Expected source |
|---------|---------------|----------------|
| Spain | "{city} ayuntamiento concejales" | Municipal websites |
| Japan | "{prefecture} 議員一覧" | Prefectural assembly websites |
| South Africa | "parliament.gov.za members" | parliament.gov.za |
| Australia (state) | "{state} parliament members" | State parliament websites |
| Germany (local) | "{city} stadtrat mitglieder" | Municipal websites |

### Tier 4: Wikidata (cross-reference only)
Use Wikidata SPARQL queries filtered for current officeholders (P39 with no P582 end date) as a CROSS-REFERENCE, never as a primary source. If Wikidata says someone holds office but no official source confirms it, DO NOT show it.

---

## Key Architectural Decisions

### 1. NEVER use Gemini to generate politician names
Gemini's role is strictly:
- Parsing and structuring data from official sources
- Formatting responses for users
- Categorizing/summarizing policy positions
- **NEVER**: "Who is the mayor of {city}?" -> Gemini answers with a name

### 2. Cache official data aggressively
- National-level data changes rarely (elections every 2-5 years)
- Cache TTL: 24 hours for API sources, refresh datasets weekly for download sources
- Store source URL and retrieval timestamp with every cached record

### 3. Show provenance to users
Every politician name displayed should have a "source" attribute:
- `source: "uk-parliament-api"`
- `source: "google-civic-api"`
- `source: "brave-search:https://council-website.gov.uk/members"`
- NEVER: `source: "gemini-generated"`

### 4. Graceful degradation
If no official source is available for a location:
1. Try Brave Search for the specific official government page
2. If found, extract and cite the source
3. If not found, tell the user: "Official data not available for this area. We're working on expanding coverage."
4. NEVER hallucinate a name

---

## Immediate Action Items

1. **Audit current Frank code** - find everywhere Gemini is asked to generate politician names and replace with API calls
2. **Implement RNE import** for France (best single dataset, covers everything)
3. **Set up Open Council Data UK CSV import** for UK local councillors
4. **Add TSE data import** for Brazil local officials
5. **Add Italy DAIT import** for Italian local officials
6. **Implement Wikidata SPARQL** as cross-reference layer (never primary)
7. **Add source provenance tracking** to every politician record in the database
