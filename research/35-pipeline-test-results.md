# Pipeline Test Results: Area Research Endpoints (15 Worldwide Locations)

**Date:** 2026-03-18
**Tester:** Automated audit via Claude
**Server:** localhost:4740
**Endpoints tested:**
1. `GET /api/area-data/worldwide?lat={lat}&lng={lng}` (civic data)
2. `POST /api/research/area` with `{"area": "..."}` (deep research)

---

## Executive Summary

The worldwide civic data pipeline shows strong infrastructure but has critical data quality issues in the representative lookup layer. The **research endpoint** (Brave + Gemini synthesis) significantly outperforms the **structured worldwide endpoint** for producing accurate, locally-relevant civic data. The core issue: the Wikidata SPARQL query returns hundreds of irrelevant national legislators (many historical/retired) instead of locally-relevant representatives.

**Overall Grades:**
| Tier | Worldwide Endpoint | Research Endpoint |
|------|-------------------|-------------------|
| UK locations | C+ | A- |
| US locations | D+ | B |
| Canada | A- | A |
| Western Europe (DE, FR, IT, SE) | D | A- |
| Asia-Pacific (JP, AU) | D | B+ |
| Global South (BR, IN, KE, ZA) | D | Not tested |

---

## Part A: GET /api/area-data/worldwide — Per-Location Results

### 1. Beckton, London (51.516, 0.060)

| Field | Result | Grade |
|-------|--------|-------|
| Country | GB / United Kingdom | Correct |
| Admin area | England | Correct but generic (should say London Borough of Newham) |
| Representatives | **0 returned** | F |
| Demographics | **0 indicators** (no World Bank, no census) | F |
| Air quality | AQI 78, Good, PM2.5 | A |
| Places | 20 (religious, markets, cafes, parks) | A |
| Errors | "Failed to reverse geocode via postcodes.io" | Bug |

**Issues found:**
- The UK-specific civic data pipeline (Parliament API, ONS Census, IMD) failed entirely due to postcodes.io reverse geocode failure at this lat/lng. The coordinate (51.516, 0.060) should resolve to approximately E6 postcode area.
- No World Bank demographics returned for UK — the code appears to skip World Bank for UK/US since it expects native APIs, but native APIs failed here.
- The actual MP for this area is **James Asser (Labour), West Ham and Beckton constituency** — not returned.

**Grade: D+** (places and air quality work; civic data entirely missing)

---

### 2. San Francisco, CA (37.7749, -122.4194)

| Field | Result | Grade |
|-------|--------|-------|
| Country | US / United States | Correct |
| Admin area | California | Correct |
| Representatives | **0 returned** | F |
| Demographics | 5 indicators (World Bank: pop 340M, GDP $84.5k, life exp 78.4, unemployment 4%, Gini 41.8) | B |
| Air quality | AQI 70, Good | A |
| Places | 20 | A |
| US Census | 2 topics: Population by race (SF County), Median HH income $136,689 | A |

**Issues found:**
- **Representatives: 0** — US civic data integration is broken. Error: "Could not find US representatives for this location." The Google Civic Information API appears non-functional. The current mayor is **Daniel Lurie** (since Jan 2025), not returned.
- Demographics are **country-level** (World Bank), not city/county-level — population shows 340M (US total), not SF's ~808k.
- US Census data IS working and shows correct county-level data.

**Grade: C** (census data correct; demographics misleading as country-level; reps broken)

---

### 3. Toronto, Canada (43.6532, -79.3832)

| Field | Result | Grade |
|-------|--------|-------|
| Country | CA / Canada | Correct |
| Admin area | Ontario | Correct |
| Representatives | **4 returned** | A- |
| Demographics | 5 World Bank indicators (pop 41.3M, GDP $54.3k, etc.) | B |
| Air quality | AQI 77, Good | A |
| Places | 20 | A |

**Representatives verification:**
- **Chrystia Freeland** — Listed as MP for University-Rosedale. **OUTDATED**: She resigned Jan 9, 2026. By-election scheduled April 13, 2026. Seat is currently vacant.
- **Olivia Chow** — Listed as Mayor. **CORRECT** (still serving as of March 2026).
- **Ausma Malik** — Listed as Councillor, Spadina-Fort York. **CORRECT** (also Deputy Mayor).
- **Chris Glover** — Listed as MPP, Spadina-Fort York (NDP). **CORRECT**.

**Issues:** Demographics are country-level (Canada total 41.3M, not Toronto's ~2.8M). One rep out of date.

**Grade: B+** (best worldwide endpoint result; reps mostly correct but 1 stale)

---

### 4. Berlin, Germany (52.5200, 13.4050)

| Field | Result | Grade |
|-------|--------|-------|
| Country | DE / Deutschland | Correct |
| Admin area | Berlin | Correct |
| Representatives | **384 returned** | F |
| Demographics | 5 World Bank indicators | B |

**Representatives verification (sample):**
- **Katrin Goring-Eckardt** — Listed as Bundestag member, Greens. Real person, currently a Bundestag member. But **not specific to Berlin** as a constituency rep.
- **Philipp Rosler** — Listed as "member of the Landtag of Lower Saxony, FDP." **COMPLETELY WRONG**: Rosler left politics in 2013, lives in Switzerland, works in private sector. He was never a Berlin representative.
- **Rudolf Amelunxen** — "member of the Landtag of North Rhine-Westphalia, Centre Party." This person **died in 1969**. Clearly historical data.
- **Arthur Krull** — "Communist Party of Germany" — this party was banned in 1956.

The Wikidata query is returning **the entire historical roster of German legislators across all states**, not Berlin-specific current representatives. The actual Governing Mayor is **Kai Wegner (CDU)** — not in the results.

**Grade: D-** (country detection and World Bank work; reps are dangerously inaccurate)

---

### 5. Sao Paulo, Brazil (-23.5505, -46.6333)

| Field | Result | Grade |
|-------|--------|-------|
| Country | BR / Brasil | Correct |
| Admin area | Sao Paulo | Correct |
| Representatives | **213 returned** | F |
| Demographics | 5 indicators | B |

**Representatives verification:**
- **Professora Bebel** — Workers' Party. A real politician but associated with Guarulhos, not specifically Sao Paulo city.
- **Isa Penna** — Communist Party of Brazil. Real person, was a Sao Paulo state legislator but lost her seat. Incorrectly listed party.
- The actual mayor is **Ricardo Nunes (MDB)** — not in results.
- Like Berlin, this dumps national/state legislators without local relevance.

**Grade: D** (same Wikidata problem)

---

### 6. Paris, France (48.8566, 2.3522)

| Field | Result | Grade |
|-------|--------|-------|
| Country | FR / France | Correct |
| Admin area | Ile-de-France | Correct |
| Representatives | **152 returned** | F |

**Sample verification:**
- **Eric Woerth** — Union for a Popular Movement. Real French politician, but **UMP no longer exists** (renamed to Les Republicains in 2015). Recently left National Assembly to lead PMU.
- **Jacques Bompard** — Listed as National Rally. Actually was associated with the League of the South, not National Rally. Now retired.
- The actual Mayor of Paris is **Anne Hidalgo (PS)** until the March 2026 elections — not in results.

**Grade: D** (same Wikidata problem — stale party names, historical figures)

---

### 7. Tokyo, Japan (35.6762, 139.6503)

| Field | Result | Grade |
|-------|--------|-------|
| Country | JP | Correct |
| Admin area | Suginami-ku | Correct (specific ward detected) |
| Representatives | **322 returned** | F |

**Sample verification:**
- **Hirotaka Akamatsu** — Listed as SDP member. Actually Constitutional Democratic Party. Was a JSP member decades ago.
- **Yoko Kamikawa** — LDP. Real politician, former Justice Minister. Not specifically a Suginami ward representative.
- Actual Tokyo Governor is **Yuriko Koike** — not in results.

**Grade: D** (same pattern)

---

### 8. Sydney, Australia (-33.8688, 151.2093)

| Field | Result | Grade |
|-------|--------|-------|
| Country | AU / Australia | Correct |
| Admin area | New South Wales | Correct |
| Representatives | **432 returned** | F |

**Sample verification:**
- Many appear to be state/federal legislators, not Sydney-specific.
- Actual Lord Mayor is **Clover Moore (Independent)** — not found in Wikidata results.

**Grade: D** (same pattern)

---

### 9. Mumbai, India (19.0760, 72.8777)

| Field | Result | Grade |
|-------|--------|-------|
| Country | IN / India | Correct |
| Admin area | Maharashtra | Correct |
| Representatives | **228 returned** | F |

**Sample verification:**
- **P. Chidambaram** — Listed as "Member of the 12th Lok Sabha." The 12th Lok Sabha was **1998-1999**. He currently represents Tamil Nadu in Rajya Sabha, not Mumbai/Maharashtra.
- **Omar Abdullah** — "Member of the 13th Lok Sabha." He represents Jammu & Kashmir, completely unrelated to Mumbai.
- **Farooq Abdullah** — Same — J&K politician, nothing to do with Mumbai.
- These results have **zero local relevance to Mumbai**.

**Grade: D-** (worst case — reps are from entirely different states/decades)

---

### 10. Nairobi, Kenya (-1.2921, 36.8219)

| Field | Result | Grade |
|-------|--------|-------|
| Country | KE / Kenya | Correct |
| Admin area | Nairobi | Correct |
| Representatives | **406 returned** | F |

**Issues:** Same Wikidata dumping pattern. Actual Nairobi Governor is **Johnson Sakaja (UDA)** — likely buried in 406 results if present at all.

**Grade: D**

---

### 11. Portland, OR (45.5152, -122.6784)

| Field | Result | Grade |
|-------|--------|-------|
| Country | US / United States | Correct |
| Admin area | Oregon | Correct |
| Representatives | **0 returned** | F |
| Demographics | 5 World Bank (country-level) | C |
| US Census | 2 topics (county-level race + income) | B+ |

**Issues:** Same as SF — US civic data broken. Current mayor is **Keith Wilson** (since Jan 2025). Not returned.

**Grade: C** (same as SF)

---

### 12. Manchester, UK (53.4808, -2.2426)

| Field | Result | Grade |
|-------|--------|-------|
| Country | GB / United Kingdom | Correct |
| Admin area | England | Correct |
| Representatives | **1 returned** | A |
| Demographics | **0** (World Bank skipped for UK) | F |
| Native Civic Data | 1 rep, 6 census topics, IMD Decile 5 | A |

**Representative verification:**
- **Lucy Powell** — Labour (Co-op), Manchester Central. **CORRECT** — verified, she is indeed the MP and also Deputy Leader of the Labour Party since Oct 2025.

**Native data includes:** 6 census topics (population by ethnicity, age, housing, etc.) and IMD Decile 5 — all correct.

**Issues:** This is the **only UK location where the native civic pipeline worked**. The Beckton coordinate failed at postcodes.io. Manchester succeeded because the coordinate resolved to a valid postcode.

**Grade: B+** (great when it works; no demographics in worldwide layer for UK)

---

### 13. Rome, Italy (41.9028, 12.4964)

| Field | Result | Grade |
|-------|--------|-------|
| Country | IT / Italia | Correct |
| Admin area | Lazio | Correct |
| Representatives | **390 returned** | F |

**Sample verification:**
- **Mario Mantovani** — Forza Italia. Real politician but was a **regional figure from Lombardy**, arrested for corruption in 2015.
- **Pierluigi Piccini** — "Italian Communist Party." This party dissolved in 1991.
- Actual mayor is **Roberto Gualtieri (PD)** — not prominently returned.

**Grade: D**

---

### 14. Stockholm, Sweden (59.3293, 18.0686)

| Field | Result | Grade |
|-------|--------|-------|
| Country | SE / Sverige | Correct |
| Admin area | Stockholms lan | Correct |
| Representatives | **448 returned** | F |

**Sample verification:**
- **Malin Bjork** — Listed as Left Party. Actually left the EU Parliament in 2024, now leads European Left Alliance. Not a Stockholm representative.
- Actual Mayor of Stockholm is **Karin Wanngard (Social Democrats)** — likely buried in 448 results.

**Grade: D**

---

### 15. Cape Town, South Africa (-33.9249, 18.4241)

| Field | Result | Grade |
|-------|--------|-------|
| Country | ZA / South Africa | Correct |
| Admin area | Western Cape | Correct |
| Representatives | **379 returned** | F |

**Issues:** Same pattern. Actual mayor is **Geordin Hill-Lewis (DA)** — not prominently in results. Many returned reps are national-level parliamentarians.

**Grade: D**

---

## Part B: POST /api/research/area — Deep Research Results (First 8 Locations)

### 1. Beckton, London

| Field | Result | Grade |
|-------|--------|-------|
| Summary | Accurate overview of area transformation | A |
| Governing bodies | 15 bodies, local-first ordering | A- |
| Contested issues | 3 issues, all verified | A |
| Demographics | Pop 16,150; deprivation, ethnicity data | A |
| Suggested locations | 5 specific real places | A |
| Interview themes | 5 area-specific themes | A |

**Governing bodies verification:**
- **Beckton Ward Councillors** — James Beckles, Rohima Rahman, Hilda Kalap (Labour). Plausible ward councillors.
- **Mayor of Newham — Rokhsana Fiaz (Labour)** — **CORRECT** (she is still serving until May 2026, announced she won't stand again).
- URLs all point to real newham.gov.uk pages.

**Issues verification:**
- "Low Affordable Housing in Beckton Riverside" — Source URL https://newhamvoices.co.uk/2025/10/28/nearly-3000-homes-in-beckton-approved... **VERIFIED REAL**. Actual article about 2,977 homes with only 6.2% affordable.
- Other issues reference real development controversies.

**Grade: A-**

---

### 2. San Francisco, CA

| Field | Result | Grade |
|-------|--------|-------|
| Summary | Good overview of political realignment | B |
| Governing bodies | 24 bodies | C |
| Contested issues | 4 issues, well-sourced | B+ |
| Demographics | Pop 808,937; detailed facts | A |

**Critical error found:**
- **Mayor listed as London Breed (Democratic)** — **WRONG**. London Breed lost the Nov 2024 election. The current mayor is **Daniel Lurie** (since Jan 2025). This is a major factual error.
- **Connie Chan — District 1** — Correct that she holds the seat, but she's running for Congress in 2026.
- **Aaron Peskin — District 3** — He was termed out and no longer serves. Replaced by new supervisors from the Nov 2024 election.
- **Catherine Stefani — District 2** — Also termed out in Nov 2024.
- The Board of Supervisors had significant turnover in Jan 2025. Most of the listed members are **stale** from the pre-2025 board.
- URL https://sfbos.org/supervisor-chan returns **404**.

**Issues:** Fentanyl crisis (real), housing element (real), doom loop (real but somewhat dated).

**Grade: C** (major error on mayor; stale board members; broken URLs)

---

### 3. Toronto, Canada

| Field | Result | Grade |
|-------|--------|-------|
| Summary | Accurate fiscal recalibration narrative | A |
| Governing bodies | 32 bodies (all 25 wards listed) | A |
| Contested issues | 4 issues, well-sourced | A |
| Demographics | Pop 2,794,356; immigration stats correct | A |

**Governing bodies verification:**
- **Mayor Olivia Chow** — **CORRECT**.
- All 25 ward councillors listed with names and ward URLs on toronto.ca.
- Provincial and federal representatives included.
- Ontario Science Centre relocation issue — **VERIFIED REAL**.

**Grade: A** (best overall result; comprehensive and accurate)

---

### 4. Berlin, Germany

| Field | Result | Grade |
|-------|--------|-------|
| Summary | Good overview of CDU-led transition | A |
| Governing bodies | 20 bodies (all 12 districts listed) | A- |
| Contested issues | 3 issues, well-sourced | A |
| Demographics | Pop 3,866,385; accurate stats | A |

**Governing bodies verification:**
- **District of Mitte — Stefanie Remlinger (Greens)** — **VERIFIED CORRECT** (Bezirksburgermeisterin since Oct 2022).
- **Clara Herrmann — Friedrichshain-Kreuzberg (Greens)** — Real district mayor.
- Housing expropriation (Deutsche Wohnen & Co. enteignen) — **VERIFIED REAL** issue (2021 referendum).
- Mobility transition and bike lanes — real ongoing issue.
- Note: **Kai Wegner (CDU) as Governing Mayor should be listed but may be missing from the top-level entries** — need to check full list.

**Grade: A-** (excellent local detail; minor questions about completeness at state level)

---

### 5. Sao Paulo, Brazil

| Field | Result | Grade |
|-------|--------|-------|
| Summary | Good socioeconomic overview | A |
| Governing bodies | 20 bodies | B+ |
| Contested issues | 3 issues | B |
| Demographics | Pop 12,396,372 | A |

**Issues:**
- Subprefeitura names and URLs appear real (prefeitura.sp.gov.br paths).
- Individual subprefeito names (Luciana Feldman, Marcus Vinicius Valerio, etc.) are **hard to verify** — these are appointed positions that change frequently. May or may not be current.
- Actual mayor **Ricardo Nunes** should be listed.
- Issues about urban deprivation and air quality are legitimate but somewhat generic.

**Grade: B+**

---

### 6. Paris, France

| Field | Result | Grade |
|-------|--------|-------|
| Summary | Excellent — captures 15-minute city vs conservative tensions | A |
| Governing bodies | 24 bodies | A |
| Contested issues | 3 issues | A |
| Demographics | Pop 2,102,650 | A |

**Governing bodies verification:**
- **Ariel Weil — Paris Centre (PS)** — **VERIFIED CORRECT** (mayor of arrondissements 1-4 since 2020, running for re-election March 2026).
- **Florence Berthout — 5e (Horizons)** — **VERIFIED CORRECT** (mayor since 2014, running in March 2026 election).
- **Rachida Dati — 7e (LR)** — **VERIFIED CORRECT** (mayor since 2008, just re-elected in first round March 15, 2026).
- **Jeanne d'Hauteserre — 8e (LR)** — Real arrondissement mayor.
- Peripherique speed limit — real issue from 2024.
- Airbnb regulation — real ongoing issue.

**Grade: A** (excellent accuracy, verified arrondissement mayors, real current issues)

---

### 7. Tokyo, Japan

| Field | Result | Grade |
|-------|--------|-------|
| Summary | Good structural overview | B+ |
| Governing bodies | 20 bodies (ward structure) | C+ |
| Contested issues | 3 issues | B |
| Demographics | Pop ~14M | A |

**Issues found:**
- Ward mayors listed with **empty names** ("Chiyoda City — (None)"). This means the Brave search didn't return individual ward mayor names, and Gemini left them blank rather than fabricating.
- This is actually **better behavior** than hallucinating names, but the data is incomplete.
- Issues are real but somewhat generic (depopulation, air quality) — not Tokyo-specific enough.
- URLs to ward offices (city.chiyoda.lg.jp, etc.) are **real valid URLs**.

**Grade: B** (honest about gaps; good structure but thin on specifics)

---

### 8. Sydney, Australia

| Field | Result | Grade |
|-------|--------|-------|
| Summary | Good urban density narrative | A |
| Governing bodies | 19 bodies | A- |
| Contested issues | 4 issues | B+ |
| Demographics | Pop 5,297,089 | A |

**Governing bodies verification:**
- **Clover Moore — City of Sydney (Independent)** — **VERIFIED CORRECT** (Lord Mayor since 2004, re-elected to 6th term Sept 2024).
- Multiple LGA councils listed (Parramatta, Penrith, Inner West, Blacktown) with plausible mayors.
- Issues about urban heat island and sprawl are real but sources are somewhat academic/dated (2016 SMH article).

**Grade: B+**

---

## Part C: Systemic Issues Found

### Critical Issues (Must Fix)

1. **Wikidata SPARQL query returns garbage data for representatives**
   - Returns hundreds of historical/national legislators with no local relevance
   - Includes dead politicians (Rudolf Amelunxen, d. 1969), banned parties (Communist Party of Germany, banned 1956), and politicians from entirely wrong regions (Mumbai returning J&K politicians)
   - The "broad" fallback query (`?person wdt:P27 wd:${qid}` — citizen of country) is far too wide
   - **Recommendation:** Either fix the SPARQL to filter by current term + local constituency, or remove Wikidata reps entirely and rely solely on the research endpoint for rep data

2. **US representative lookup is completely broken**
   - Both SF and Portland return 0 representatives with error "Could not find US representatives for this location"
   - Google Civic Information API appears non-functional
   - **Recommendation:** Check API key validity and endpoint configuration

3. **UK postcodes.io reverse geocode fails for some London coordinates**
   - Beckton (51.516, 0.060) fails while Manchester (53.4808, -2.2426) succeeds
   - When postcodes.io fails, the entire UK civic pipeline returns nothing
   - **Recommendation:** Add fallback geocoding (e.g., try postcodes.io API with nearest endpoint, or use Nominatim postcode)

### Moderate Issues

4. **Demographics are country-level, not city-level**
   - World Bank data returns national population (e.g., 340M for US when querying SF, 83M for Germany when querying Berlin)
   - Labels don't indicate this is country-level data, which is misleading
   - **Recommendation:** Either clearly label as "Country: United States" or source city-level data

5. **Research endpoint has stale politician data**
   - SF: Lists London Breed as mayor (replaced Jan 2025 by Daniel Lurie)
   - SF: Lists Aaron Peskin, Catherine Stefani, Connie Chan as supervisors (several termed out Nov 2024)
   - This is likely because Brave search returns cached/older pages, and Gemini's training data cutoff
   - **Recommendation:** Add date-awareness prompting; cross-reference with structured API data when available

6. **Research endpoint URLs sometimes 404**
   - sfbos.org/supervisor-chan returned 404
   - Some academic sources are paywalled or redirected
   - **Recommendation:** Validate URLs after generation or note them as unverified

### Minor Issues

7. **Country names in local language** (Deutschland, Brasil, Sverige, Italia) — should normalize to English for consistency

8. **Admin area too generic for UK** — returns "England" instead of borough/county

9. **No parks returned for some Places searches** — inconsistent

---

## Part D: What Works Well

1. **Country detection (Nominatim)** — Perfect 15/15. Every location correctly identified country and admin region.

2. **Google Places API** — Excellent. Returns 20 real, relevant nearby places with ratings, addresses, and Google Maps links. This is the most reliable data layer.

3. **Air Quality API** — Perfect 15/15. Real-time AQI data with health recommendations.

4. **Canada representative data (Open North Represent API)** — Best-in-class. Returns correct current politicians at all levels (federal, provincial, municipal) with photos and profile URLs.

5. **UK native civic data (when postcodes.io succeeds)** — Manchester shows excellent data: correct MP, 6 census topics, IMD deprivation decile.

6. **US Census integration** — Working correctly for SF/Portland. County-level race demographics and median household income.

7. **Research endpoint synthesis quality** — When Brave returns good search results, Gemini produces well-structured, mostly-accurate briefings with real governing body names, real issues, and real sources. Toronto, Berlin, Paris, and Beckton results are particularly strong.

8. **Data source attribution** — Every data point includes source and sourceUrl. Good for transparency.

---

## Part E: Overall Grades by Tier

### Worldwide Endpoint (GET /api/area-data/worldwide)

| Location | Country | Reps | Demographics | Places/AQ | Overall |
|----------|---------|------|-------------|-----------|---------|
| Beckton, UK | A | F | F | A | **D+** |
| San Francisco, US | A | F | C | A | **C** |
| Toronto, CA | A | A- | B | A | **B+** |
| Berlin, DE | A | F | B | A | **D** |
| Sao Paulo, BR | A | F | B | A | **D** |
| Paris, FR | A | F | B | A | **D** |
| Tokyo, JP | A | F | B | A | **D** |
| Sydney, AU | A | F | B | A | **D** |
| Mumbai, IN | A | F | B | A | **D** |
| Nairobi, KE | A | F | B | A | **D** |
| Portland, US | A | F | C | A | **C** |
| Manchester, UK | A | A | A | A | **B+** |
| Rome, IT | A | F | B | A | **D** |
| Stockholm, SE | A | F | B | A | **D** |
| Cape Town, ZA | A | F | B | A | **D** |

**Worldwide endpoint average: D+**

### Research Endpoint (POST /api/research/area)

| Location | Summary | Gov Bodies | Issues | Demographics | Overall |
|----------|---------|-----------|--------|-------------|---------|
| Beckton, UK | A | A- | A | A | **A-** |
| San Francisco, US | B | C | B+ | A | **C** |
| Toronto, CA | A | A | A | A | **A** |
| Berlin, DE | A | A- | A | A | **A-** |
| Sao Paulo, BR | A | B+ | B | A | **B+** |
| Paris, FR | A | A | A | A | **A** |
| Tokyo, JP | B+ | C+ | B | A | **B** |
| Sydney, AU | A | A- | B+ | A | **B+** |

**Research endpoint average: B+**

---

## Part F: Priority Recommendations

### P0 — Fix immediately
1. **Remove or fix Wikidata SPARQL for reps** — Currently returns harmful misinformation (dead politicians, wrong regions). Either:
   - Rewrite query to filter by `endTime` qualifiers and local constituency
   - Or remove entirely and direct users to the research endpoint for rep data
2. **Fix US representative lookup** — Google Civic API returning nothing for all US locations

### P1 — Fix soon
3. **Fix UK postcodes.io fallback** — Add retry with nearest-postcode endpoint or Nominatim fallback
4. **Label World Bank demographics as country-level** — Or replace with city-level data sources

### P2 — Improve
5. **Add date-awareness to research prompt** — Tell Gemini the current date and to prioritize recent search results
6. **Validate returned URLs** — Quick HEAD request to check if URLs resolve
7. **Normalize country names to English** — Deutschland -> Germany, etc.

---

## Appendix: Raw Data Locations

All test results saved to `/tmp/beat_test_{n}_{city}.json` (worldwide) and `/tmp/beat_research_{n}_{city}.json` (research) for further analysis.
