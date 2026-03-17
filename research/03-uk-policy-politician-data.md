# UK Local Government Policy Data, Council Decisions & Politician Information

## Research Date: 2026-03-16

Comprehensive guide to programmatic access to UK political and local government data. Focus on what is buildable today.

---

## 1. TheyWorkForYou API

**URL:** `https://www.theyworkforyou.com/api/`
**Auth:** API key required (self-service signup at `/api/key`)
**Pricing:** From £20/month. Free/reduced for non-profits and charities.
**Formats:** JSON, XML, PHP serialized, JavaScript, RABX

### Endpoints

| Function | Description |
|----------|-------------|
| `getConstituency` | Search for UK Parliament constituency, returns details |
| `getConstituencies` | List all UK Parliament constituencies |
| `getPerson` | Main details for a person |
| `getMP` | Main details for an MP (query by postcode, constituency, or ID) |
| `getMPInfo` | Extra info for a person (voting record summaries, etc.) |
| `getMPsInfo` | Extra info for multiple people |
| `getMPs` | List of all current MPs |
| `getLord` / `getLords` | Lords data |
| `getMLA` / `getMLAs` | Northern Ireland Assembly members |
| `getMSP` / `getMSPs` | Scottish Parliament members |
| `getGeometry` | Centre point + bounding box of constituencies |
| `getBoundary` | Boundary polygon of a constituency |
| `getCommittee` | Members of a Select Committee |
| `getDebates` | Debates (Commons, Westminster Hall, Lords) |
| `getWrans` | Written Answers |
| `getWMS` | Written Ministerial Statements |
| `getHansard` | Universal endpoint for any Hansard content |
| `getComments` | Site comments |
| `convertURL` | Convert parliament.uk Hansard URL to TWFY URL |
| `getQuota` | Check your API usage (doesn't consume quota) |

### Example Request
```
GET https://www.theyworkforyou.com/api/getMP?key=YOUR_KEY&postcode=SW1A+1AA&output=json
```

### What You Can Build
- Postcode-to-representative lookup
- MP activity dashboards (speeches, votes, written questions)
- Constituency comparison tools
- Parliamentary debate search and analysis

---

## 2. MySociety APIs

### 2a. MapIt — Postcode to Administrative Areas

**URL:** `https://mapit.mysociety.org/`
**Docs:** `https://mapit.mysociety.org/docs/`
**Auth:** API key via URL param `api_key=KEY` or header `X-Api-Key`
**Pricing:** From £20/month. Free for low-volume non-profit use.
**Rate tracking:** `X-Quota-Current` and `X-Quota-Limit` response headers

#### Key Endpoints

| Endpoint | Purpose |
|----------|---------|
| `/postcode/{postcode}` | Postcode to all containing areas |
| `/postcode/partial/{partial}` | Partial postcode lookup |
| `/point/{SRID}/{x},{y}` | Coordinate to areas (SRIDs: 4326/WGS84, 27700/OSGB) |
| `/nearest/{SRID}/{x},{y}` | Nearest postcode to coordinates |
| `/area/{ID}` | Area info and geometry |
| `/area/{ID}/children` | Child areas, touching, overlapping areas |
| `/areas/{IDs}` | Multiple area lookup |
| `/code/{type}/{code}` | External code lookup (ONS, GSS codes) |
| `/types` | All available area types |
| `/generations` | Boundary generation timeline |
| `/quota` | Usage check (free) |

#### Area Types Returned
Wards, constituencies (Westminster, Senedd, Scottish Parliament), council areas, parish councils, NHS CCGs, European regions, and more.

#### Geometry Formats
KML, GeoJSON, WKT — append format to area endpoint.

#### What You Can Build
- "Who represents me?" tools from postcode
- Geographic boundary visualization
- Area-level data aggregation pipelines

### 2b. WhatDoTheyKnow (Alaveteli) — FOI Requests

**URL:** `https://www.whatdotheyknow.com/`
**Platform:** Powered by Alaveteli (open source)
**Scale:** 1M+ FOI requests and responses archived

#### Read API
- Append `.json` to any URL to get JSON response
  - `/request/{id}.json` — Full request details
  - `/body/{authority_slug}.json` — Authority info
  - `/user/{user_id}.json` — User profile
- Atom feeds on most listing pages (also available as JSON)
- Filter by authority, file type, date range, or status

#### Write API
- `POST /api/v2/request` — Create a new FOI request
- `GET /api/v2/request/{id}.json` — Get request details
- `POST /api/v2/request/{id}.json` — Add correspondence

#### What You Can Build
- FOI response analysis pipeline
- Track authority response rates and times
- Automated FOI submission workflows
- Search existing FOI responses before making new requests

### 2c. WriteToThem
Contact representatives. Not a data API — it's a tool for sending messages to elected representatives. Useful as a UX reference but not for data extraction.

---

## 3. UK Parliament Official APIs

**Developer Hub:** `https://developer.parliament.uk/`
**Auth:** No API key required for most endpoints
**Format:** JSON, XML

### 3a. Members API
**Base:** `https://members-api.parliament.uk/`
**Swagger spec:** `/swagger/v1/swagger.json`

Covers all MPs and Lords — biographical data, party affiliation, constituency, portrait photos, contact details.

### 3b. Commons Votes API
**Base:** `https://commonsvotes-api.parliament.uk/`

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/data/division/{divisionId}.json` | GET | Single division with full vote breakdown |
| `/data/divisions.json/search` | GET | Search divisions by term, date, member |
| `/data/divisions.json/searchTotalResults` | GET | Count matching divisions |
| `/data/divisions.json/groupedbyparty` | GET | Vote tallies grouped by party |
| `/data/divisions.json/membervoting` | GET | All votes for a specific member |

#### Search Parameters
- `searchTerm` — text search in title/number
- `memberId` — filter by specific MP
- `startDate` / `endDate` — date range (yyyy-MM-dd)
- `divisionNumber` — specific division number
- `skip` / `take` — pagination (default take=25)

### 3c. Other Parliament APIs
- **Lords Votes API** — similar structure to Commons
- **Bills API** — bill stages, amendments, sponsors
- **Oral Questions API** — tabled questions and motions
- **Committees API** — membership, inquiries, publications
- **Historic Hansard API** — `https://api.parliament.uk/historic-hansard/api`

### 3d. Older Data Platform
**URL:** `https://data-odp.parliament.uk/`
Offers OData endpoint, SPARQL endpoint, and parameterised queries. Different functionality from the Developer Hub APIs.

### What You Can Build
- Complete MP voting record analysis
- Party rebellion tracking
- Bill progress monitoring
- Cross-referencing votes with debate speeches

---

## 4. Council Meeting Minutes & Decisions

### The Problem
There is NO single standard or aggregator for council meeting minutes. Each council publishes independently.

### ModernGov (Civica) — De Facto Standard
**Used by:** Majority of borough and county councils in England
**URL pattern:** `https://democracy.{council}.gov.uk/` or `https://meetings.{council}.gov.uk/` or `https://{council}.moderngov.co.uk/`

#### Hidden SOAP API
ModernGov exposes a WSDL endpoint on many installations:
```
http://democracy.{council}.gov.uk/mgWebService.asmx?WSDL
```
Undocumented but functional. Provides committee lists, meeting details, member info.

#### Python Package: `moderngov`
```bash
pip install moderngov
```
```python
from moderngov import api

council = api.Website('https://meetings.eastleigh.gov.uk')
council.committee.list()    # All committees
council.wards.list()        # All wards
council.members.list()      # All councillors
council.members.by_id(123)  # Specific councillor
```
**Requires:** Python >= 3.10
**Data:** Committees, wards, members, meetings
**CLI:** `-w` wards, `-m` members, `-M [id]` member detail, `-b` committees

#### Scraping Strategy
1. Identify which ModernGov instance a council uses
2. Use the `moderngov` Python package for structured access
3. Fall back to WSDL/SOAP for deeper data
4. HTML scraping as last resort — pages are reasonably structured

### Key Limitation
Council meeting minutes are typically published as PDF or Word documents attached to meeting entries. Extracting structured data from these requires document parsing (PDF extraction, etc.).

---

## 5. Manifestos & Promise Tracking

### 5a. Manifesto Project Database (MARPOR)
**URL:** `https://manifesto-project.wzb.eu/`
**Coverage:** 5,285 manifestos from 877 elections in 67 countries (including UK)
**Data:** Full text of manifestos, sentence-level policy coding
**Access:**
- Free account required: `https://manifesto-project.wzb.eu/signup`
- API key issued on registration
- R package `manifestoR` for programmatic access:
  ```r
  library(manifestoR)
  mp_setapikey("your_key")
  # Download UK manifesto corpus
  ```
- Python: Use the API directly (REST endpoints)
**License:** Academic use primarily; check terms for commercial

### 5b. Promise Trackers

| Source | URL | Coverage |
|--------|-----|----------|
| Institute for Government Manifesto Tracker | `instituteforgovernment.org.uk/manifesto-tracker` | Government manifesto delivery analysis |
| GovTracker | `govtracker.co.uk` | Independent government accountability tracking |
| Vote for Policies Promise Tracker | `tracker.voteforpolicies.org.uk` | 2019 manifesto policy tracking |
| IfG Performance Tracker | `instituteforgovernment.org.uk/our-work/trackers` | Whitehall Monitor, Parliamentary Monitor, Performance Tracker |

### 5c. Direct Manifesto Sources
- Party websites publish manifestos as PDFs at election time
- UK Web Archive (British Library) archives party websites
- Labour manifesto archive: `labour-party.org.uk/manifestos/`
- No standardized local manifesto database exists — local manifestos are ad hoc PDFs

### What You Can Build
- Manifesto text analysis pipeline using MARPOR data
- Promise delivery tracker combining IfG data with parliamentary activity
- Local manifesto scraper targeting party websites pre-election

---

## 6. Voting Records

### MPs (National)
Excellent coverage via multiple sources:
- **Commons Votes API** (see Section 3b) — official, structured, complete
- **TheyWorkForYou API** — `getMPInfo` returns voting summaries
- **Public Whip** (`publicwhip.org.uk`) — analyses voting patterns, rebellion rates
  - Shares codebase with TheyWorkForYou
  - Data available via GitHub: member files in JSON/XML
  - Attendance rates, rebellion rates, individual division votes

### Councillors (Local)
**Major gap.** Individual councillor voting records are generally NOT recorded or published. The Local Audit and Accountability Act 2014 only requires recording individual votes on budget matters. This is a known transparency gap — there have been petitions (e.g., on 38 Degrees) demanding change.

**Workaround:** Some councils record named votes in meeting minutes (PDF/Word). Extracting this requires document parsing of ModernGov minutes attachments.

---

## 7. Democracy Club

**URL:** `https://democracyclub.org.uk/`
**API Docs:** `https://developers.democracyclub.org.uk/api/v1/`
**Candidates API:** `https://candidates.democracyclub.org.uk/api/docs/`

### Authentication
- Unauthenticated: 10 requests/minute
- Authenticated: Create account for API token, passed as `auth_token=TOKEN`

### API Versions
- **v0.9** — Stable, deprecated. Best for bulk downloads.
- **next** — Current bleeding edge. Recommended for new projects.

### Key Endpoints

| Endpoint | Purpose |
|----------|---------|
| `/postcode/{postcode}` | Upcoming ballots, candidates, polling stations |
| `/address/{slug}` | Address-specific election data |
| `/elections/` | List elections with filtering (coords, current, future, identifier) |
| `/elections/{id}` | Single election details |

### Data Coverage
- All General Elections since 2010
- All local and devolved elections since 2016
- All by-elections since May 2017
- Candidate data: name, party, area (minimum); photos, statements, contact info (where crowdsourced)

### Bulk Downloads
All candidate and results data available as CSV under CC BY 4.0.

### Limitations
- Does NOT serve winners or results of completed elections via API (use CSV downloads)
- Polling station data may be unavailable in some areas
- Candidate verification varies

### What You Can Build
- "What elections are coming up?" tools
- Candidate comparison pages
- Electoral history databases from CSV bulk data

---

## 8. FOI Requests — Programmatic Access

### How FOI Works in the UK
- Freedom of Information Act 2000 covers all public authorities
- 20 working day response deadline
- Requests can be made by anyone (no citizenship requirement)
- Environmental information handled under separate EIR regulations

### WhatDoTheyKnow as Data Source
(See Section 2b for API details)
- 1M+ archived requests — search before making new ones
- 15-20% of all UK central government FOI requests go through WDTK
- All requests and responses are public and searchable
- Atom feeds for monitoring new requests/responses by authority

### Automation Strategy
1. **Search existing responses** first via JSON API
2. **Monitor new responses** via Atom feeds
3. **Submit new requests** via Write API (v2)
4. **Track status** — WDTK auto-follows up after 20 working days

### Alaveteli (Open Source Platform)
**GitHub:** `https://github.com/mysociety/alaveteli`
Can be self-hosted for managing FOI workflows.

---

## 9. Planning Applications

### 9a. Planning Data Platform (Official)
**URL:** `https://www.planning.data.gov.uk/`
**OpenAPI spec:** `https://www.planning.data.gov.uk/openapi.json`
**Status:** Beta — not recommended for production systems yet

#### Endpoints

| Endpoint | Purpose |
|----------|---------|
| `GET /entity.json` | Search entities with extensive filtering |
| `GET /entity.geojson` | Same as above, GeoJSON format |
| `GET /entity/{id}.json` | Single entity |
| `GET /entity/dataset-name-search.json` | Search by dataset name |
| `GET /dataset.json` | List all datasets |
| `GET /dataset/{dataset}.json` | Specific dataset metadata |

#### Filtering
By postcode, UPRN, typology, dataset, organization, entity number, CURIE, date ranges, geographic coordinates, WKT geometry. Pagination via `limit` and `offset`.

### 9b. Planning London Datahub
**URL:** `https://www.london.gov.uk/programmes-strategies/planning/digital-planning/planning-london-datahub`
Unified dataset from all London planning authorities. API access available.

### 9c. Individual Council Planning Portals
Many councils publish planning data on their open data portals (e.g., Camden: `opendata.camden.gov.uk`).

### 9d. Commercial APIs
- **Searchland** (`searchland.co.uk/api`) — UK-wide planning data, hourly updates
- **LandHawk** (`landhawk.uk/api`) — enriched planning data

### What You Can Build
- Planning application tracker for specific areas
- Development impact analysis tools
- Community notification systems for nearby planning applications

---

## 10. Council Budget & Spending Data

### Transparency Code Requirements
The Local Government Transparency Code 2015 mandates councils publish:
- All spending over £500 (monthly)
- Procurement card transactions
- Contracts and tender documents
- Senior salary data
- Land and property assets
- Grants to voluntary organizations

### data.gov.uk — CKAN API
**Base URL:** `https://data.gov.uk/api/action/`
**Auth:** None required
**Rate limits:** None

#### Key Endpoints

| Endpoint | Purpose |
|----------|---------|
| `package_search?q=spending` | Search datasets by keyword |
| `package_search?fq=organization:{council}` | Filter by council |
| `package_show?id={dataset-id}` | Get dataset metadata and resource URLs |
| `package_list` | List all datasets |
| `organization_list` | List all publishers |
| `organization_show?id={publisher}` | Publisher details |

#### Example
```
GET https://data.gov.uk/api/action/package_search?q=council+spending+over+500&fq=organization:camden-council
```

### LG Inform Plus
**URL:** `https://lginformplus.org/`
**API:** `https://developertools.esd.org.uk/api`
**Auth:** Registration required, API key issued
**Free tier:** First 2 GB free
**Coverage:** 15,000+ metric types, 1 billion+ data values

Covers demographics, performance metrics, financial data, geographic data. Query by any combination of metric types, areas, and time periods.

### MHCLG Open Data Communities
**URL:** `https://opendatacommunities.org/`
200+ datasets covering deprivation, housing, local government finance, planning. Includes SPARQL endpoint for programmatic queries.

### What You Can Build
- Council spending analysis and comparison tools
- Budget transparency dashboards
- Cross-authority benchmarking using LG Inform Plus
- Spending trend analysis over time

---

## 11. "What Works" Evidence Databases

### The What Works Network

| Centre | Domain | Evidence Tool |
|--------|--------|---------------|
| **Education Endowment Foundation** | educationendowmentfoundation.org.uk | Teaching & Learning Toolkit — 2,950 studies, 30 topic areas |
| **College of Policing** | college.police.uk | Crime Reduction Toolkit — 80 interventions rated |
| **What Works for Local Economic Growth** | whatworksgrowth.org | Evidence reviews on local growth interventions |
| **Centre for Homelessness Impact** | homelessnessimpact.org | Evidence Finder + Intervention Tool — 1,640 studies, Evidence & Gap Maps |
| **Foundations** (formerly EIF) | foundations.org.uk | Children and families early intervention evidence |
| **Centre for Ageing Better** | ageing-better.org.uk | Quality of life for older people |
| **Youth Futures Foundation** | youthfuturesfoundation.org | Youth employment interventions |
| **Youth Endowment Fund** | youthendowmentfund.org.uk | Youth offending prevention |
| **Wales Centre for Public Policy** | wcpp.org.uk | Cross-cutting Welsh policy evidence |
| **NICE** | nice.org.uk | Health and social care (extensive API) |
| **TASO** | taso.org.uk | Higher education access & outcomes |

### Programmatic Access
Most What Works centres publish evidence as web-based toolkits without formal APIs. Practical approaches:

- **EEF Teaching & Learning Toolkit:** Web scraping of toolkit pages. Structured data (effect sizes, cost ratings, evidence strength) presented consistently.
- **Crime Reduction Toolkit:** Interactive web tool. Scrapable — each intervention has consistent rating format.
- **Centre for Homelessness Impact:** Evidence Finder and Intervention Tool are web-based. Evidence & Gap Maps cover 1,640 studies. No API but structured enough to scrape.
- **NICE:** Has a formal API (`https://developer.nice.org.uk/`) — the most API-friendly What Works centre.

### Other Evidence Sources
- **Campbell Collaboration** (`campbellcollaboration.org`) — Systematic reviews in social policy. Campbell UK & Ireland hub at Queen's University Belfast. No public API but structured search.
- **EPPI-Centre** (UCL) — Evidence synthesis tools and database.

### What You Can Build
- Cross-cutting evidence search aggregating multiple What Works databases
- Policy intervention comparison tool with effect sizes and cost ratings
- Local area policy recommendation engine based on evidence strength

---

## 12. Open Council Data UK

**URL:** `http://opencouncildata.co.uk/`
**Coverage:** All UK councils (England, Wales, Scotland, Northern Ireland)

### Data Available
- All councillor names, parties, and wards
- Councillor email addresses
- Council leadership roles and portfolios
- By-election and local election data

### Access
Website-based with downloadable datasets. No formal API, but structured data suitable for scraping or bulk download.

---

## 13. Additional Useful Sources

### Local Elections Archive (Nuffield)
**URL:** `politicscentre.nuffield.ox.ac.uk`
900,000+ candidates in local elections since the 19th century. Names, parties, votes received, elected status.

### Electoral Commission API
**URL:** `https://api.electoralcommission.org.uk/`
Election information, registered parties, spending returns.

### PolData (GitHub)
**URL:** `https://github.com/erikgahner/PolData`
Curated list of political science datasets including UK data.

### PartyFacts
**URL:** `https://partyfacts.herokuapp.com/`
Cross-national party identification linking dataset.

---

## Architecture Recommendations

### Priority Data Sources for a UK Policy Platform

**Tier 1 — Start here (well-documented APIs, reliable):**
1. TheyWorkForYou API — MP info, debates, written answers
2. UK Parliament Commons Votes API — detailed voting records
3. MapIt — postcode-to-area resolution
4. Democracy Club CSV downloads — candidate and election data
5. data.gov.uk CKAN API — council spending data

**Tier 2 — Valuable but requires more work:**
6. ModernGov Python package — council meetings and members
7. Planning Data Platform API — planning applications
8. WhatDoTheyKnow JSON API — FOI request archive
9. LG Inform Plus API — council performance metrics
10. Manifesto Project API — manifesto text analysis

**Tier 3 — Scraping required:**
11. What Works centre toolkits — evidence on interventions
12. IfG manifesto/promise trackers — policy delivery tracking
13. Individual council transparency pages — budget documents
14. Open Council Data UK — councillor information

### Suggested Data Pipeline
```
Postcode Input
    → MapIt (resolve to constituency, ward, council)
    → TheyWorkForYou (MP details, recent activity)
    → Commons Votes API (voting record)
    → Democracy Club (upcoming elections, candidates)
    → ModernGov (local council meetings, councillors)
    → data.gov.uk (council spending)
    → Planning Data (local planning applications)
    → What Works centres (evidence for local policy issues)
```

### Key Technical Notes
- Most APIs return JSON; some Parliament APIs also offer XML
- No API keys needed for: Parliament APIs, data.gov.uk CKAN, Democracy Club (with rate limits)
- API keys needed for: TheyWorkForYou, MapIt, LG Inform Plus, Manifesto Project
- Local councillor voting records are a known data gap with no current solution
- Council meeting minutes require PDF/Word document parsing — no structured data standard exists
