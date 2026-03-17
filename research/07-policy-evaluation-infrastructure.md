# Policy Evaluation Infrastructure: Deep Research

## Purpose

Given an issue (e.g. "housing overcrowding in a London borough"), find what policies have been tried worldwide for this issue, what worked, what didn't, with evidence quality ratings. This document maps every concrete data source, its access method, data structure, and proposes an architecture for a "policy intelligence" layer.

---

## 1. What Works Centres (UK)

The UK What Works Network comprises independent evidence centres covering over GBP 200 billion of public spending. Each has a distinct evidence structure.

### 1.1 Education Endowment Foundation (EEF)

- **URL**: https://educationendowmentfoundation.org.uk/education-evidence/teaching-learning-toolkit
- **Coverage**: 33 topics, drawing on 2,950+ robust studies from 250+ meta-analyses
- **Evidence structure**: Each topic rated on three dimensions:
  - **Impact** (months of additional progress, e.g. "+5 months")
  - **Evidence strength** (padlock rating, 1-5)
  - **Cost** (GBP per pupil, rated 1-5)
- **Data access**: No public API. The toolkit is a web resource. Data would need to be scraped or manually structured. The underlying study database (2,500+ single studies) is not exposed programmatically.
- **Replication model**: This is the gold standard for how a "what works" toolkit should look. Every policy domain should have something like this.

### 1.2 Centre for Homelessness Impact

- **URL**: https://www.homelessnessimpact.org/intervention-tool-overview
- **Coverage**: 1,640 studies across two evidence gap maps (built with Campbell Collaboration)
- **Evidence structure** (developed with Campbell Collaboration):
  - **Strength of evidence**: 4 levels
    - *Considerable*: 3+ RCTs or 5+ studies, combined n >= 300
    - *Some*: 2+ RCTs or 3+ studies, combined n >= 200
    - *Limited*: 1+ RCT or 2+ studies, combined n >= 100
    - *Insufficient*: anything else
  - **Impact rating**: 7-point scale from `--` (strongly negative) to `++` (strongly positive)
    - `++`: 3+ RCTs showing positive effects, none showing adverse
    - `+`: 1+ RCT or 2+ studies positive, no contrary findings
    - `+/-`: 2+ RCTs non-significant
    - `-`: studies showing negative effects
    - `--`: multiple RCTs negative
  - **Cost-effectiveness**: assessed separately
- **Data access**: No public API. Evidence gap maps are interactive web tools. The underlying data (800 quantitative impact evaluations + 840 qualitative process evaluations) is browsable but not downloadable in bulk.

### 1.3 What Works Centre for Local Economic Growth

- **URL**: https://whatworksgrowth.org/
- **Coverage**: Systematic evidence reviews across employment training, business support, broadband, transport, housing, estate renewal, sports & culture, access to finance
- **Evidence structure**: Uses the **Maryland Scientific Methods Scale** (SMS) to rate individual studies 1-5:
  - Level 1: Cross-sectional comparison, no controls
  - Level 2: Before-after with controls, or cross-sectional with matching
  - Level 3: Comparison with controls for observable differences (e.g. diff-in-diff)
  - Level 4: Quasi-random assignment (IV, regression discontinuity)
  - Level 5: Randomised controlled trials
- **Scoring guide**: https://whatworksgrowth.org/wp-content/uploads/16-06-28_Scoring_Guide.pdf
- **Data access**: No API. Resource library searchable by topic and type at whatworksgrowth.org/resources/. Toolkits are web pages, not machine-readable.

### 1.4 Early Intervention Foundation (now Foundations)

- **URL**: https://guidebook.eif.org.uk/
- **Coverage**: 130+ interventions rated for impact on children and families
- **Evidence structure**: 4-level rating system:
  - Level 4: Long-term positive impact, 2+ rigorous studies
  - Level 3: Short-term positive impact, causal evidence from at least one well-conducted study
  - Level 2: Preliminary evidence of improving outcomes
  - Level 1: Logical basis for expecting impact (no robust evaluation yet)
- **Data access**: No API. The Guidebook is a web application. Each intervention has a structured page with fields: target population, age range, outcomes, evidence rating, cost, delivery format.

### 1.5 What Works Centre for Wellbeing

- **URL**: https://whatworkswellbeing.org/
- **Status**: Operated 2014-2024 (now archived)
- **Coverage**: Wellbeing evidence across work, community, relationships, health
- **Tools**: Wellbeing Measures Bank (searchable database of validated metrics including ONS4, WEMWBS, loneliness scales, social capital measures)
- **Data access**: Limited. Some data dashboards remain accessible. Evidence Knowledge Bank available as archived resource.

### 1.6 What Works for Crime Reduction (College of Policing)

- **URL**: https://www.college.police.uk/research/crime-reduction-toolkit
- **Coverage**: 30+ interventions for crime reduction
- **Evidence structure**: Similar traffic-light system rating impact, mechanism, implementation, and economic cost
- **Data access**: No API.

### Summary: What Works Centres

**Key finding**: None of the What Works Centres expose APIs. All use web-based toolkits. However, their evidence structures are well-defined and consistent enough to be reverse-engineered into a unified schema. The most sophisticated rating systems are the Centre for Homelessness Impact (7-point impact scale + 4-tier evidence strength) and EEF (months of progress + padlock ratings).

---

## 2. Campbell Collaboration

- **URL**: https://www.campbellcollaboration.org/
- **Coverage**: Systematic reviews and evidence gap maps across: Ageing, Business & Management, Children & Young Persons, Climate Solutions, Crime & Justice, Disability, Education, Sustainable Development, Knowledge Translation, Methods, Social Welfare
- **Library**: Open access, published in Campbell Systematic Reviews (Wiley)
- **Evidence structure**: Each review follows PRISMA standards. Reviews include forest plots, effect sizes, confidence intervals, risk of bias assessments.
- **Data access**:
  - Reviews published as open-access articles via Wiley Online Library (https://onlinelibrary.wiley.com/journal/18911803)
  - No dedicated API for the Campbell Library
  - Reviews are searchable on the website
  - **EPPI-Reviewer** is the underlying software for managing review data; free for Campbell/Cochrane authors
  - Data extraction and export possible through EPPI-Reviewer (not public-facing)
- **Integration approach**: Scrape/index Campbell Library. Each review can be parsed for: intervention type, population, comparison, outcomes, effect sizes, number of included studies, geographic coverage.

---

## 3. J-PAL (MIT)

- **URL**: https://www.povertyactionlab.org/evaluations
- **Coverage**: 1,200+ randomised evaluation summaries across 100+ countries
- **Sectors**: Agriculture, Crime/Violence, Education, Environment/Energy, Finance, Firms, Gender, Health, Labor Markets, Political Economy/Governance, Social Protection
- **Data structure** (per evaluation):
  - Sector and sub-sector tags
  - Intervention type (100+ categories)
  - Geographic location (country, region)
  - Target population
  - Outcome measures
  - Project status (Active, Completed, Cancelled)
  - Research initiative affiliation
  - "Data Available" flag
- **Data access**:
  - No direct API on povertyactionlab.org
  - Underlying datasets published on **Harvard Dataverse** (https://dataverse.harvard.edu/dataverse/jpal)
  - **Harvard Dataverse API** is fully RESTful:
    - Base: `https://dataverse.harvard.edu/api/`
    - Search: `GET /api/search?q={query}&type=dataset`
    - Dataset metadata: `GET /api/datasets/{id}`
    - File download: `GET /api/access/datafile/{id}`
    - Auth: API token via `X-Dataverse-key` header
    - Full docs: https://guides.dataverse.org/en/latest/api/
  - The Dataverse API gives access to individual evaluation datasets, not the evaluation summaries/metadata
- **Integration approach**: The evaluations page itself would need scraping to build the structured metadata index. Individual datasets are accessible via Dataverse API.

---

## 4. OECD Observatory of Public Sector Innovation (OPSI)

- **URL**: https://oecd-opsi.org/
- **Case study platform**: https://oecd-opsi.org/case-study-archive/
- **Coverage**: Public sector innovation case studies from OECD member countries and beyond, collected since 2014
- **Categories**: Innovation types (enhancement, adaptive, mission-oriented, anticipatory), methodologies, themes
- **Data access**: No public API documented. Case studies are web-browsable with filtering.
- **Toolkit Navigator**: https://oecd-opsi.org/toolkit-navigator/ — curated collection of innovation toolkits and methods
- **Integration approach**: Scrape case study archive. Each case study has structured fields: country, level of government, innovation type, year, description, results.

---

## 5. Local Government Association (UK) — LG Inform

### 5.1 Case Studies

- **URL**: https://www.local.gov.uk/case-studies
- **Coverage**: Best practice case studies from UK councils
- **Data access**: No API for case studies. Web-browsable.

### 5.2 LG Inform (Performance Data)

- **URL**: https://lginform.local.gov.uk/
- **Coverage**: 6,600+ performance metrics across UK local authorities
- **THIS IS THE MOST IMPORTANT API FOR LOCAL POLICY WORK**
- **API base**: `https://developertools.esd.org.uk/`
- **Full API documentation**: https://developertools.esd.org.uk/methods
- **Authentication**: Three modes:
  - Public-Private Key (PPK): `ApplicationKey` + `Signature` parameters
  - OAuth: user sign-in + subscription
  - Token: API token from authenticated user
- **Key endpoints**:
  - `/data` — metric data in customisable table format (params: area, metricType, period)
  - `/data.csv` — CSV export
  - `/data.json` — JSON format
  - `/areas` — geographic areas (paginated, 500 per page)
  - `/areas/{id}/shape` — KML boundary data
  - `/areaTypes` — area type classifications (MBC, London boroughs, etc.)
  - `/metricTypes` — all available metric definitions
  - `/metricTypes/{id}` — specific metric details
  - `/comparisonGroups` — groupings for benchmarking
  - `/datasets` — dataset metadata
  - `/lists` — classification lists and mappings
  - `/markers` — amenities, service incidents, location data
  - `/derivation` — source and calculation steps for any metric value
  - `/data/regression` — regression line coordinates between column pairs
- **Output formats**: JSON, CSV, HTML, JSONP, KML (for geographic), Power BI format
- **Value types**: raw, rank, band, direction, percentDifference, quartile
- **Geo data**: Full KML support for mapping area boundaries
- **What this means for us**: We can programmatically pull performance data for any UK local authority on thousands of metrics, compare authorities, track trends over time, and overlay geographic boundaries. This is the quantitative backbone for assessing policy outcomes at local level.

### 5.3 LG Inform Plus

- **URL**: https://www.local.gov.uk/our-support/research-and-data/lg-inform-data-benchmarking/lg-inform-plus
- Extends LG Inform with ward-level data, demographic profiling, and open data feeds
- Same API infrastructure (ESD developer tools)

---

## 6. Evidence Gap Maps — 3ie

- **URL**: https://www.3ieimpact.org/evidence-hub/evidence-gap-maps
- **Coverage**: 40+ interactive evidence gap maps covering agriculture, health, WASH, climate, energy, governance, education, transport, migration
- **Methodology**:
  - Systematic search and screening for impact evaluations and systematic reviews
  - Studies coded by: intervention category, outcome category, geographic location, population, study design
  - Systematic reviews appraised using standardised checklist
  - Visual matrix: interventions (rows) x outcomes (columns), cells show number of studies
- **Data access**:
  - **Open access to EGM platform has been discontinued** — must contact info@3ieimpact.org
  - Legacy platform still partially accessible: https://gapmaps.3ieimpact.org/
  - Development Evidence Portal: https://developmentevidence.3ieimpact.org/
  - Some maps offer Excel spreadsheet downloads
  - PDF reports and briefs available
- **Integration approach**: Contact 3ie for bulk data access. The Development Evidence Portal may have more accessible data. Individual EGMs can be downloaded as Excel where available.

---

## 7. Manifesto Trackers and Promise Databases

### 7.1 Manifesto Project Database (MARPOR) — **HAS AN API**

- **URL**: https://manifesto-project.wzb.eu/
- **Coverage**: Quantitative content analysis of party manifestos from 50+ countries, all free democratic elections since 1945
- **Data**: Coded policy positions on standardised categories (economic, social, foreign policy dimensions)
- **API base**: `https://manifesto-project.wzb.eu/api/v1/`
- **Authentication**: API key (register for account, generate key in profile)
  - Pass as: `api_key` parameter, `API_KEY` header, or `Authentication` header
- **Key endpoints**:
  - `list_core_versions` — available dataset versions
  - `list_metadata_versions` — corpus metadata versions
  - `get_core` — the main dataset (supports JSON, dta, xlsx, sav formats)
  - `get_parties` — party lists
  - `metadata` — corpus metadata for specific parties/elections
  - `texts_and_annotations` — manifesto texts with coding annotations
  - `get_core_codebook` — category definitions and codes
- **R package**: `manifestoR` on CRAN for R users
- **Rate limits**: Daily quota (specific numbers not published)
- **What this means for us**: Structured, machine-readable data on what political parties promise, coded by policy domain. We can link manifesto promises to policy outcomes.

### 7.2 Full Fact Government Tracker

- **URL**: https://fullfact.org/government-tracker/
- **Coverage**: ~300 pledges from Labour's 2024 manifesto, tracked line-by-line
- **Rating system**: Achieved, Appears on track, In progress, Appears off track, Not kept, Unclear or disputed, Wait and see
- **Methodology**: Each pledge assessed by fact checkers against primary sources (ONS data, Hansard, government publications). At least two senior team members review each status.
- **Data access**: No API. Web-only. Would need scraping.

### 7.3 PolitiFact Promise Trackers (US)

- **URL**: https://www.politifact.com/truth-o-meter/promises/
- **Coverage**: Biden, Trump, Obama promise trackers
- **Ratings**: Promise Kept, Promise Broken, Compromise, Stalled, In the Works, Not Yet Rated
- **Data access**: No API.

### 7.4 Institute for Government Trackers

- **URL**: https://www.instituteforgovernment.org.uk/our-work/trackers
- **Coverage**: Various UK policy implementation trackers
- **Data access**: No API.

---

## 8. International Policy Databases

### 8.1 UN-Habitat Best Practices Database

- **URL**: https://unhabitat.org/best-practices
- **Coverage**: 4,000+ proven solutions from 140 countries on social, economic, and environmental problems
- **Content**: Peer-reviewed best practices, good policies, enabling legislation, case studies
- **National Urban Policy Database**: Country-level data on existence, formulation, implementation, M&E of national urban policies, leading ministries, policy documents
- **Data access**: No API. Searchable web database. Some reports downloadable as PDF.

### 8.2 European Commission — Knowledge4Policy (K4P)

- **URL**: https://knowledge4policy.ec.europa.eu/
- **Coverage**: Evidence for EU policymaking across all domains
- **Tools**: AI Watch, Competence Centre on Composite Indicators, Competence Centre on Foresight
- **Data access**: Web-based knowledge platform. No single API, but the EC has various data portals.

### 8.3 EU Policy Lab

- **URL**: https://policy-lab.ec.europa.eu/
- **Focus**: Foresight, behavioural insights, design for policy
- **Not a database** — more of a methodology hub. Useful for understanding how to design policy experiments, not for sourcing evidence.

### 8.4 OECD iLibrary

- **URL**: https://www.oecd-ilibrary.org/
- **Coverage**: All OECD publications, statistics, working papers
- **Data access**: OECD.Stat has APIs for statistical data. Publications require subscription.

---

## 9. Proposed Policy Knowledge Graph Architecture

### 9.1 Core Ontology

The knowledge graph should model these entity types and relationships:

```
ISSUE (e.g. "housing overcrowding")
  ├── tagged with: DOMAIN (housing, health, education...)
  ├── scoped to: GEOGRAPHY (London Borough of Tower Hamlets)
  ├── measured by: METRIC (overcrowding rate, persons per room)
  └── addressed by: INTERVENTION[]

INTERVENTION (e.g. "social housing construction programme")
  ├── type: INTERVENTION_TYPE (supply-side, demand-side, regulatory...)
  ├── tried in: IMPLEMENTATION[]
  └── supported by: EVIDENCE[]

IMPLEMENTATION
  ├── where: GEOGRAPHY
  ├── when: TIME_PERIOD
  ├── by: IMPLEMENTING_BODY (council, central govt, NGO)
  ├── cost: COST_DATA
  ├── scale: POPULATION_REACHED
  └── produced: OUTCOME[]

OUTCOME
  ├── metric: METRIC
  ├── direction: POSITIVE | NEGATIVE | NEUTRAL
  ├── magnitude: EFFECT_SIZE
  └── measured by: EVIDENCE

EVIDENCE
  ├── type: RCT | QUASI_EXPERIMENTAL | OBSERVATIONAL | CASE_STUDY | EXPERT_OPINION
  ├── source: SOURCE (Campbell, J-PAL, EEF, What Works Centre...)
  ├── quality_rating: EVIDENCE_QUALITY
  ├── citation: REFERENCE
  ├── year: YEAR
  └── sample_size: INTEGER

EVIDENCE_QUALITY
  ├── maryland_sms_level: 1-5
  ├── grade_rating: HIGH | MODERATE | LOW | VERY_LOW
  ├── confidence_level: CONSIDERABLE | SOME | LIMITED | INSUFFICIENT
  └── risk_of_bias: LOW | UNCLEAR | HIGH
```

### 9.2 Technology Stack

```
┌──────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                     │
│  "Given issue X in location Y, what has worked?"         │
│  Returns: ranked interventions + evidence cards          │
└───────────────────────┬──────────────────────────────────┘
                        │
┌───────────────────────▼──────────────────────────────────┐
│                   QUERY ENGINE                            │
│  1. Parse issue → domain tags + geographic scope          │
│  2. Search knowledge graph for matching interventions     │
│  3. Rank by evidence quality + relevance                  │
│  4. Generate "mini meta-analysis" summary                 │
│  LLM layer: Gemini 3 for semantic matching + synthesis    │
└───────────────────────┬──────────────────────────────────┘
                        │
┌───────────────────────▼──────────────────────────────────┐
│                 KNOWLEDGE GRAPH (Neo4j)                   │
│  Nodes: Issues, Interventions, Implementations,          │
│         Outcomes, Evidence, Geographies, Metrics          │
│  Edges: ADDRESSES, TRIED_IN, PRODUCED, MEASURED_BY,      │
│         SUPPORTED_BY, SIMILAR_TO                          │
│  ~50,000 nodes initially, growing to 500,000+            │
└───────────────────────┬──────────────────────────────────┘
                        │
┌───────────────────────▼──────────────────────────────────┐
│                  DATA INGESTION LAYER                     │
│                                                          │
│  API Connectors (structured):                            │
│  ├── LG Inform API (ESD) ──── UK local authority metrics │
│  ├── Manifesto Project API ── party promises + positions │
│  ├── Harvard Dataverse API ── J-PAL evaluation datasets  │
│  └── OECD.Stat API ───────── international statistics    │
│                                                          │
│  Scrapers (semi-structured):                             │
│  ├── EEF Toolkit ──────────── education evidence         │
│  ├── Homelessness Impact ──── housing/homelessness       │
│  ├── EIF Guidebook ────────── early intervention         │
│  ├── J-PAL Evaluations ────── RCT summaries              │
│  ├── Campbell Library ─────── systematic reviews         │
│  ├── OPSI Case Studies ────── public sector innovation   │
│  ├── UN-Habitat ───────────── urban best practices       │
│  ├── Full Fact Tracker ────── promise delivery           │
│  └── 3ie Portal ──────────── development evidence        │
│                                                          │
│  NLP Pipeline (unstructured):                            │
│  ├── Academic papers (Semantic Scholar API, OpenAlex API) │
│  ├── Government reports (GOV.UK content API)             │
│  └── Grey literature (council reports, charity reports)  │
└──────────────────────────────────────────────────────────┘
```

### 9.3 Database Choice: Neo4j

Why a graph database over relational:
- Policy evidence is inherently a network: issues link to interventions, which link to implementations, which link to outcomes, which link to evidence
- "What's similar to this?" queries are natural graph traversals (e.g. "find interventions that worked for similar issues in similar geographies")
- Evidence chains can be arbitrary depth (a systematic review synthesises RCTs, which themselves reference outcome data)
- Neo4j has mature GDS (Graph Data Science) library for community detection, similarity algorithms, PageRank-style authority scoring

Cypher query example:
```cypher
// Given an issue, find what interventions have the strongest evidence
MATCH (i:Issue {name: "housing overcrowding"})-[:ADDRESSED_BY]->(int:Intervention)
      -[:SUPPORTED_BY]->(e:Evidence)
WHERE e.maryland_sms_level >= 3
RETURN int.name,
       avg(e.effect_size) AS avg_effect,
       count(e) AS num_studies,
       collect(DISTINCT e.geography) AS where_tried
ORDER BY avg_effect DESC, num_studies DESC
```

### 9.4 Semantic Matching Layer

Issues raised by users won't match database entries exactly. We need:

1. **Issue taxonomy**: Map free-text issues to a controlled vocabulary. Starting point: LGA's service list taxonomy (available via ESD developer tools `/lists` endpoint), cross-referenced with UN SDG targets and OECD policy domains.

2. **Embedding-based similarity**: Embed all issue descriptions and intervention descriptions using a text embedding model. At query time, find nearest neighbours in embedding space, then traverse the knowledge graph from those nodes.

3. **LLM-powered query expansion**: Use Gemini 3 to:
   - Parse a natural language issue into structured components (domain, geography, population, desired outcome)
   - Generate variant phrasings to broaden search
   - Synthesise results into a coherent narrative with evidence quality caveats

---

## 10. Statistical Methodology: "Meta-Study on Demand"

### 10.1 The Framework

For any given local issue, the system should perform an automated approximation of a rapid evidence assessment:

**Step 1: Scoping**
- Parse issue into: domain, population, geography, desired outcomes
- Identify relevant intervention categories
- Map to controlled vocabularies (EEF topics, Campbell coordinating groups, J-PAL sectors)

**Step 2: Evidence retrieval**
- Query knowledge graph for all relevant evidence nodes
- Supplement with live search of academic databases (Semantic Scholar API, OpenAlex API) for recent studies not yet in the graph
- Filter by: minimum evidence quality threshold, relevance to geographic/demographic context

**Step 3: Evidence quality assessment (algorithmic)**

Two established frameworks should be combined:

**Maryland Scientific Methods Scale (SMS)** — for individual study quality:
| Level | Design | Internal Validity |
|-------|--------|-------------------|
| 5 | RCT | Highest |
| 4 | Quasi-random (IV, RDD) | High |
| 3 | Controlled comparison (DiD, matching) | Moderate |
| 2 | Before-after with controls | Low-moderate |
| 1 | Cross-sectional, no controls | Low |

**GRADE framework** — for body-of-evidence quality:
- Start at High (RCTs) or Low (observational)
- **Downgrade for**: risk of bias, inconsistency across studies, indirectness (wrong population/setting), imprecision (wide CIs), publication bias
- **Upgrade for**: large effect size, dose-response gradient, all plausible confounders would reduce effect
- Final rating: High / Moderate / Low / Very Low certainty

**Automating GRADE-like assessment**:
- Study design detection: classifiable from methods section using NLP (RobotReviewer achieves 71-78% accuracy on risk-of-bias classification using CNNs)
- Sample size extraction: regex + NLP from abstracts
- Effect size extraction: parse reported statistics (Cohen's d, odds ratios, risk ratios)
- Inconsistency: compute I-squared heterogeneity across studies with same intervention-outcome pair
- Indirectness: measure similarity between study context (country, population, setting) and query context using structured metadata
- Imprecision: check if confidence intervals cross the line of no effect
- Publication bias: funnel plot asymmetry test (Egger's test) if >= 10 studies

**Step 4: Synthesis**
- Compute pooled effect size (random-effects meta-analysis) where >= 3 comparable studies exist
- Generate forest plot
- Produce narrative summary using LLM, structured as:
  - What interventions have been tried
  - What the evidence says (effect sizes, confidence)
  - How confident we should be (GRADE-like rating)
  - What's been tried in similar contexts (geographic/demographic transferability)
  - What evidence gaps remain

### 10.2 Key Tools for Automation

| Task | Tool | Access |
|------|------|--------|
| Literature search | Semantic Scholar API | Free, rate-limited |
| Literature search | OpenAlex API | Free, open |
| Risk of bias assessment | RobotReviewer | Open source (GitHub) |
| Data extraction | NLP pipeline (custom) | Build on spaCy/transformers |
| Meta-analysis computation | metafor (R) / PythonMeta | Open source |
| Evidence quality classification | Custom ML model trained on GRADE assessments | Build |
| Narrative synthesis | Gemini 3 | API |

### 10.3 Caveats and Honest Limitations

- **Fully automated meta-analysis is not yet reliable enough for clinical decisions.** Our system produces *indicative* evidence summaries, not definitive systematic reviews.
- **GRADE judgments are inherently subjective** (the framework itself says "all decisions to downgrade involve subjective judgements"). We can approximate but should flag uncertainty.
- **Transferability is hard** — an RCT from rural India may not apply to urban London. The system should explicitly flag geographic/demographic distance.
- **Publication bias is real** — we can test for it statistically but not eliminate it.
- **The system should always say what it doesn't know** — evidence gaps are as important as evidence presence.

---

## 11. Concrete API Summary

### APIs with programmatic access (ready to use)

| Source | API Base | Auth | Format | Coverage |
|--------|----------|------|--------|----------|
| **LG Inform** | `developertools.esd.org.uk` | PPK / OAuth / Token | JSON, CSV, HTML, KML | 6,600+ UK local authority metrics |
| **Manifesto Project** | `manifesto-project.wzb.eu/api/v1/` | API key | JSON, dta, xlsx, sav | Party manifestos, 50+ countries, since 1945 |
| **Harvard Dataverse** | `dataverse.harvard.edu/api/` | API token (X-Dataverse-key) | JSON | J-PAL datasets + thousands of social science datasets |
| **Semantic Scholar** | `api.semanticscholar.org/graph/v1` | API key (free tier) | JSON | 200M+ academic papers |
| **OpenAlex** | `api.openalex.org` | None (free) | JSON | 250M+ works, open bibliographic data |
| **GOV.UK Content API** | `www.gov.uk/api/content/` | None | JSON | All GOV.UK content including policy papers |
| **ONS API** | `api.beta.ons.gov.uk/v1` | None | JSON | UK national statistics |

### Sources requiring scraping or partnership

| Source | URL | Content | Approach |
|--------|-----|---------|----------|
| EEF Toolkit | educationendowmentfoundation.org.uk | 33 education interventions | Scrape structured pages |
| Centre for Homelessness Impact | homelessnessimpact.org | 1,640 studies | Scrape evidence maps |
| EIF Guidebook | guidebook.eif.org.uk | 130+ child/family interventions | Scrape intervention pages |
| Campbell Library | campbellcollaboration.org | Systematic reviews (social) | Scrape + Wiley API |
| J-PAL Evaluations | povertyactionlab.org/evaluations | 1,200+ RCT summaries | Scrape evaluation index |
| OPSI Case Studies | oecd-opsi.org/case-study-archive/ | Innovation case studies | Scrape |
| UN-Habitat | unhabitat.org/best-practices | 4,000+ best practices | Scrape |
| Full Fact Tracker | fullfact.org/government-tracker/ | ~300 UK govt pledges | Scrape |
| 3ie Evidence Portal | developmentevidence.3ieimpact.org | 40+ evidence gap maps | Contact for data access |

---

## 12. Implementation Roadmap

### Phase 1: Foundation (Weeks 1-4)
- Set up Neo4j instance with core ontology schema
- Build API connectors for LG Inform (highest value — immediate UK local authority data)
- Build scraper for EEF Toolkit (best-structured What Works source)
- Index Campbell Library reviews (richest evidence synthesis source)
- Create issue taxonomy from LGA service list + UN SDG mapping

### Phase 2: Evidence Ingestion (Weeks 5-8)
- Build scrapers for remaining What Works Centres
- Integrate J-PAL evaluation metadata
- Connect Semantic Scholar and OpenAlex for academic paper discovery
- Build NLP pipeline for extracting: study design, sample size, effect size, geography from paper abstracts
- Connect Manifesto Project API for promise-to-policy linking

### Phase 3: Intelligence Layer (Weeks 9-12)
- Build semantic search (embeddings) over issue and intervention descriptions
- Implement automated evidence quality scoring (SMS + simplified GRADE)
- Build "rapid evidence assessment" pipeline: issue in → ranked interventions + evidence cards out
- Integrate Gemini 3 for query understanding and narrative synthesis
- Build comparison tools: "how does Borough X compare to similar boroughs on this issue?"

### Phase 4: Living System (Ongoing)
- Scheduled re-scraping of all sources (weekly/monthly)
- Alert system: "new evidence published relevant to issues you're tracking"
- User feedback loop: local practitioners can flag relevance/accuracy
- Expand to additional countries and domains based on demand

---

## 13. Key Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| What Works sites change structure, breaking scrapers | Use resilient scraping with LLM-based extraction as fallback |
| Evidence quality assessment is inaccurate | Always show underlying evidence, never hide behind a single score |
| Users over-trust automated ratings | Prominent caveats, link to original sources, GRADE-style confidence language |
| UK-centric bias | Explicitly flag geographic transferability; weight international evidence lower for UK-specific queries |
| Data staleness | Timestamp all evidence; flag when newest evidence is >3 years old |
| Legal/copyright issues with scraping | Respect robots.txt; seek partnerships with What Works Centres for data access |
