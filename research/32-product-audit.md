# 32 — Frank Product Audit: Hardcoded, Fake, and Missing

**Date**: 2026-03-18
**Scope**: Full codebase audit of all 16 core files
**Goal**: Identify everything preventing Frank from being a real end-to-end product for any location worldwide

---

## File-by-File Audit

### 1. `/web/app/beckton/page.tsx` — Hardcoded Beckton showcase page

**HARDCODED:**
- Imports `BECKTON_ANALYSIS`, `BECKTON_PROPOSALS`, `BECKTON_BRIEFING` directly from `becktonData.ts` — all data is a TypeScript constant, not fetched from any API or database
- Imports `BECKTON_MAP_POINTS`, `BECKTON_MAP_SUMMARY` from `becktonMapPoints.ts` — hardcoded pin data
- Area name "Beckton" hardcoded in `<FrankHeader area="Beckton" />`
- Subtitle "Newham . E6 . Ward: Beckton (E05013904) . Constituency: West Ham and Beckton" hardcoded in the JSX
- Postcode `E6 5XT` hardcoded as CivicDataPanel prop
- Legend text references "Beckton ward", "Constituency", "Newham borough", "LSOAs" — all hardcoded

**FAKE/DUMMY:**
- None per se — the Beckton data is from real field interviews. But the entire page is static; it reads no data from a server or database at runtime.

**MISSING:**
- "+1 this affects me" and "add voice" buttons on issues are completely non-functional (no onClick handler, no API call)
- No way to navigate to this page from the dynamic `[area]` page — it's a separate route entirely
- No integration with the recording pipeline — Beckton interview data is baked in, not from sessions
- No way for new interviews to feed into this page

---

### 2. `/web/app/[area]/page.tsx` — Dynamic area briefing page

**HARDCODED:**
- Nothing hardcoded to Beckton; this page is genuinely dynamic

**FAKE/DUMMY:**
- The "No interviews recorded for this area yet" message is always shown, even for Beckton which has interviews — there is no check against actual recorded sessions
- Research results are cached only in `sessionStorage` — ephemeral, lost on tab close

**MISSING:**
- Does not load or display interview data at all — no issues tab, no quotes, no voices, no proposals
- Missing the entire "issues" tab, "proposals" tab, and "data" tab that exist on the Beckton page — this page is structurally simpler than Beckton
- No map with interview pins (uses BriefingMap which is research-only, not CivicMap with interview data)
- No filter buttons on the map (negative/positive/nostalgic)
- Redirect logic for canonical slugs could loop or break for areas with unusual characters
- No loading timeout or retry mechanism if research takes too long

---

### 3. `/web/lib/becktonData.ts` — Hardcoded Beckton seed data

**HARDCODED:**
- Entire file is hardcoded: 726 lines of static TypeScript data
- All 8 interview voices with session IDs (`session-beckton-1` through `session-beckton-8`) are hardcoded — not from the sessions store
- All 6 issues with quotes, scores, and related issues
- All 5 policy proposals with full implementation steps, costs, drawbacks, sources
- All 5 contested issues, all suggested locations, all interview themes
- All governing bodies (5 entries: ward councillors, borough mayor, GLA, London Assembly, MP) with names, parties
- Population figure (15,800), demographic highlights
- `isBecktonSlug()` function matches a handful of hardcoded slug variants

**FAKE/DUMMY:**
- Nothing is fake — this data is from real Arthur Camara field interviews. But it cannot be updated or extended without editing source code.

**MISSING:**
- No mechanism to generate this structure from actual recorded sessions
- No pipeline: record interview -> transcribe -> analyze -> produce issues/quotes/proposals
- The analysis pipeline exists on the server (`/api/analyze`, `/api/policy`) but is never connected to produce a becktonData-like structure for any area

---

### 4. `/web/lib/dummyData.ts` — Shadwell demo seed data

**HARDCODED:**
- 584 lines of static Shadwell data, structurally identical to becktonData.ts
- All session IDs are `session-demo-1` through `session-demo-10` — not from any real recordings
- All 6 issues, 10 voices, 3 policy proposals for Shadwell

**FAKE/DUMMY:**
- The file is literally named `dummyData.ts`
- Unlike Beckton, the Shadwell data is fabricated/hypothetical — described as "Realistic civic field intelligence data for demo/Mozilla grant purposes"
- Quotes attributed to specific people (ages, locations, occupations) are invented
- `isShadwellSlug()` exists but Shadwell has no dedicated page — this data appears unused in production

**MISSING:**
- No page references this file — it appears to be dead code or reserved for a future demo
- Should either be removed or clearly labeled as synthetic demo data

---

### 5. `/web/components/CivicMap.tsx` — Interview data map

**HARDCODED:**
- Map center: `[51.516, 0.060]` — these are Beckton coordinates
- Boundary GeoJSON paths hardcoded to Beckton-specific files:
  - `/boundaries/beckton-ward.geojson`
  - `/boundaries/west-ham-and-beckton-constituency.geojson`
  - `/boundaries/newham-borough.geojson`
  - `/boundaries/beckton-lsoas.geojson`
- Map fits to ward boundary on load (Beckton ward)

**FAKE/DUMMY:**
- None — it renders real map points passed via props

**MISSING:**
- No way to pass boundary file paths as props — boundaries are always Beckton's
- No fallback if boundary files don't exist for a non-Beckton area
- No dynamic boundary loading based on area name or coordinates
- LSOA deprivation choropleth (recommended in becktonMapPoints.ts comments but not implemented)
- Air quality heatmap overlay (recommended but not implemented)
- Community places overlay from Google Places API (recommended but not implemented)

---

### 6. `/web/components/AreaMap.tsx` — Older interview pin map

**HARDCODED:**
- Map center: `[51.516, 0.060]` — Beckton coordinates
- `INTERVIEW_PINS` array: 6 pins all at Beckton locations (slag heap, retail park, football pitch, Aldi, pub, shops)
- Same Beckton boundary GeoJSON paths as CivicMap:
  - `/boundaries/beckton-ward.geojson`
  - `/boundaries/west-ham-and-beckton-constituency.geojson`
  - `/boundaries/newham-borough.geojson`

**FAKE/DUMMY:**
- Interview pin coordinates are real Beckton locations, but the voice counts per pin are hardcoded numbers, not queried from sessions

**MISSING:**
- No props for pins or center — everything is internal constants
- Completely non-reusable for any other area
- Appears to be an older version of CivicMap — may be dead code

---

### 7. `/web/components/CivicDataPanel.tsx` — Official data display

**HARDCODED:**
- Nothing hardcoded — this component is genuinely dynamic, accepting `postcode`, `lat`, `lng` as props

**FAKE/DUMMY:**
- None — calls real APIs (`/api/area-data`, `/api/area-data/worldwide`)

**MISSING:**
- IMD deprivation denominator is hardcoded to 33,755 (England only) — will be wrong for Scotland, Wales, N. Ireland, or non-UK
- Sub-domain rank labels ("worst 10%", "worst 20%") only make sense for England's IMD ranking
- No handling of non-English deprivation indices
- Representatives list filters out items starting with "Q" (Wikidata QIDs) — hack that should be fixed upstream
- Capped at 20 representatives displayed — may truncate important local officials
- No loading skeleton or progressive rendering

---

### 8. `/web/components/BriefingMap.tsx` — Dynamic area map

**HARDCODED:**
- Nothing hardcoded — accepts `lat`, `lng`, `areaName` as props

**FAKE/DUMMY:**
- None

**MISSING:**
- Makes a direct call to Nominatim public API from the client browser (`nominatim.openstreetmap.org`) — rate limit risk, should be proxied through server
- Overpass API call for sub-boundaries also directly from client — slow and unreliable
- Sub-boundaries (Overpass query) appear to query child relations of the OSM result, but the GeoJSON conversion from Overpass relations is not implemented — `subBoundaries` state is set but never rendered
- No interview pins shown on this map (unlike CivicMap/AreaMap)
- Single pin icon only, no sentiment coloring

---

### 9. `/web/app/record/page.tsx` — Recording page

**HARDCODED:**
- `recognition.lang = "en-GB"` — only supports British English speech recognition
- Domain `frank.call.partners/record` hardcoded in the "open on your phone" prompt

**FAKE/DUMMY:**
- None — recording genuinely works via Web Speech API

**MISSING:**
- **No audio recording** — uses Web Speech API for transcription only, does not capture or save actual audio files (`audioPath` field exists on Session but is never populated)
- Web Speech API (`webkitSpeechRecognition`) only works in Chrome/Edge — no fallback for Firefox or Safari
- No language selection — hardcoded to `en-GB`, unusable for non-English speakers
- No offline capability — requires internet for speech recognition
- "View results" button navigates to `/results/${areaSlug}` but there is no `/results` page — this route likely 404s
- Consent toggles have no backend enforcement — the `consentGiven` boolean is saved but nothing enforces data retention policies
- No data deletion mechanism if participant withdraws consent
- No audio recording confirmation or playback
- No note-taking UI for "notes-only mode" despite the toggle existing
- GPS randomisation (mentioned in Beckton page as "GPS-randomised") is not implemented — exact coordinates are saved

---

### 10. `/server/src/routes/research.ts` — Research pipeline

**HARDCODED:**
- Port `4742` hardcoded for GIS backend calls (3 occurrences: `http://localhost:4742/api/geocode/...`)
- Minimum governing body counts hardcoded in prompt: "Minimum 15 governing bodies for any city, minimum 20 for large cities"

**FAKE/DUMMY:**
- None — uses real Brave Search + Gemini + civic data APIs

**MISSING:**
- No caching — every research request triggers multiple Brave searches + Gemini calls (expensive)
- No rate limiting — any user can trigger expensive API calls repeatedly
- No progress streaming to the client — the request just hangs until complete (can take 30-60 seconds)
- Research results are not persisted — only cached in the browser's sessionStorage
- Official URL enrichment for governing bodies does sequential Brave searches — slow
- No validation of Gemini's JSON output beyond basic parsing — hallucinated data passes through
- The iterative research loop (`research-loop.ts`) exists but is NOT used by this route — the route does a single-pass research instead

---

### 11. `/server/src/research-loop.ts` — Iterative research loop

**HARDCODED:**
- Port `4742` hardcoded for GIS backend (2 occurrences)
- `MAX_ITERATIONS = 4` hardcoded

**FAKE/DUMMY:**
- None

**MISSING:**
- **Not wired into any route** — this file exports `deepResearch()` and `synthesizeBriefing()` but no route calls them
- No progress callback mechanism that reaches the client
- No result caching or persistence
- The `synthesizeBriefing()` function is implemented but also never called from any route

---

### 12. `/server/src/civic-data.ts` — UK civic data APIs

**HARDCODED:**
- Nothing significantly hardcoded — well-structured with proper API calls

**FAKE/DUMMY:**
- None — calls real APIs (Postcodes.io, Parliament API, Nomis, ONS Beta, IMD CSV)

**MISSING:**
- `getLGInformData()` returns `null` always — requires API key, noted as TODO
- IMD CSV is downloaded fresh each server start (~10MB) — no disk caching between restarts
- `isUSLocation()` uses crude lat/lng bounding box — misses Alaska, Hawaii, US territories
- US Census data is county-level only, not tract/block group level
- No data sources for: Scotland, Wales, N. Ireland (different Parliament APIs), Australia, or any non-UK/US/CA country's structured data
- Census data is 2021 only — no mechanism to update when 2031 census arrives

---

### 13. `/server/src/worldwide-civic.ts` — Worldwide data module

**HARDCODED:**
- Large `COUNTRY_QID` mapping table (200+ countries) — needs maintenance as Wikidata IDs change (rare but possible)
- `EU_COUNTRIES` set hardcoded

**FAKE/DUMMY:**
- None

**MISSING:**
- Eurostat integration is a TODO stub — `getEurostatDemographics()` returns empty array with a console log
- Wikidata SPARQL queries return national legislators only — no regional/municipal representatives for non-UK/US/CA countries
- No Italian-specific data sources (relevant given Arthur's Daemon/Italy work)
- No local government data for most of the world — only national parliament members via Wikidata
- Canada's Represent API is the only municipal-level international source

---

### 14. `/server/src/google-apis.ts` — Google Maps Platform

**HARDCODED:**
- Nothing — uses `process.env.GOOGLE_API_KEY`

**FAKE/DUMMY:**
- None — real API calls

**MISSING:**
- No error handling for API key missing/invalid — silent failures
- No API usage tracking or budget alerts
- No caching of Places results (same area queried repeatedly = repeated API costs)
- Street View URL is constructed but never displayed in any UI component

---

### 15. `/server/src/routes/area-data.ts` — Area data endpoint

**HARDCODED:**
- Nothing

**FAKE/DUMMY:**
- None

**MISSING:**
- No caching layer — every request hits all upstream APIs fresh
- No rate limiting

---

### 16. `/server/src/index.ts` — Server entry point

**HARDCODED:**
- GIS proxy targets `http://localhost:4742` — assumes GIS service is always local
- Port 4740 default

**FAKE/DUMMY:**
- None

**MISSING:**
- `cors({ origin: "*" })` — wide open, no origin restriction
- No authentication or authorization on any route
- No request logging middleware
- No Cloudflare Turnstile or any bot protection
- GIS proxy has no error details — returns generic 502

---

### Additional files checked:

**`/server/src/store.ts`** — Session storage
- JSON-file-based storage (one file per session in `data/sessions/`)
- Not a database — no querying, no indexing, no relations
- No data validation on read
- No encryption of sensitive data (GPS coordinates, postcodes, interview content)
- No backup mechanism
- Sessions survive server restarts (persisted to disk) — better than in-memory, but fragile

**`/web/lib/api.ts`** — Frontend API client
- Uses relative URLs (`/api/...`) — works with Next.js proxy but breaks if API is on different domain
- No retry logic, no timeout handling
- `researchArea()` call can hang indefinitely

**`/web/lib/becktonMapPoints.ts`** — Map overlay data
- 500+ lines of hardcoded Beckton-specific map points
- Contains detailed roadmap for overlays (IMD choropleth, air quality heatmap, community places) — none implemented

---

## Prioritized TODO List

### CRITICAL (product doesn't work without these)

1. **Dynamic area page is structurally incomplete compared to Beckton page** — The `[area]/page.tsx` lacks issues tab, proposals tab, voices, quotes, interview pins, and map filters. A user arriving on any non-Beckton area sees a research summary and governing bodies but none of the rich interview-driven content that makes Beckton compelling. The two pages need to be unified into one template.

2. **No pipeline from recordings to area page content** — Recording sessions are saved as JSON files, but there is no automated or manual pipeline to: (a) aggregate sessions by area, (b) extract issues and quotes, (c) generate policy proposals, (d) produce the structured data that the Beckton page displays. The `/api/analyze` and `/api/policy` endpoints exist but are never called by any page.

3. **Recording page "View results" button links to `/results/${slug}` which doesn't exist** — After finishing a recording, the user hits a 404. Should redirect to the area page or a session summary page.

4. **No actual audio recording** — The recording page only does speech-to-text transcription via Web Speech API. No audio file is captured or saved. The `audioPath` field on Session is always empty. For a field interview tool, the original audio is essential for verification, re-transcription, and consent.

5. **CivicMap and AreaMap have hardcoded Beckton boundaries** — Both map components fetch Beckton-specific GeoJSON files (`/boundaries/beckton-ward.geojson`, etc.). For any other area, boundaries simply don't load. These components need to accept boundary data as props or fetch dynamically based on area coordinates.

6. **Research loop not wired in** — `research-loop.ts` implements a sophisticated iterative research system (search, analyze gaps, search again, up to 4 rounds) but no route calls it. The actual `/api/research/area` endpoint does a simpler single-pass approach. The loop should replace or augment the single-pass.

7. **No caching of research results on the server** — Research results (expensive: multiple Brave searches + Gemini calls) are cached only in browser sessionStorage. Closing the tab loses everything. The server should persist briefings to disk or database.

8. **Speech recognition only works in Chrome** — Web Speech API (`webkitSpeechRecognition`) is Chrome/Edge only. Firefox and Safari users get silent failure. Need a fallback (e.g., Whisper API, Deepgram, or MediaRecorder + server-side transcription).

9. **Speech recognition hardcoded to English (`en-GB`)** — No language selector. Unusable for interviews in other languages. A worldwide civic tool must support multilingual recording.

### IMPORTANT (product works but is incomplete)

10. **No user accounts or authentication** — Anyone can create sessions, view all sessions, trigger expensive API calls. No way to associate sessions with a researcher. No admin panel.

11. **"+1 this affects me" and "add voice" buttons are non-functional** — These are rendered in the Beckton issues tab but have no onClick handler and no backend endpoint. This is a core participatory feature.

12. **GPS coordinates are not randomised** — The Beckton page claims "GPS-randomised, consent given" but the recording page saves exact coordinates. For participant privacy, GPS should be fuzzed by 50-200m before storage.

13. **No consent enforcement** — Consent toggles exist on the recording page but the boolean is saved without any downstream effect. No data retention policy enforcement. No mechanism for participants to request data deletion (GDPR requirement).

14. **No rate limiting or API cost controls** — Any visitor can trigger unlimited Brave Search + Gemini + Google API calls. A single bad actor could exhaust API budgets.

15. **Eurostat integration is a stub** — `getEurostatDemographics()` returns an empty array. EU regional demographic data (NUTS3 level) is not available. This matters for European areas.

16. **No Cloudflare Turnstile or bot protection** — Mentioned in project context but not implemented anywhere.

17. **IMD deprivation panel assumes England** — Denominator hardcoded to 33,755 LSOAs. Ranking labels ("worst 10%") only valid for England. Breaks silently for Scotland, Wales, N. Ireland, or non-UK locations.

18. **BriefingMap makes direct client-side calls to Nominatim and Overpass** — Should be proxied through the server to avoid rate limiting and maintain control. Overpass sub-boundary data is fetched but never rendered.

19. **Shadwell dummy data is likely dead code** — `dummyData.ts` with `isShadwellSlug()` doesn't appear to be used by any page or component. Should be removed or connected.

20. **No comment/discussion section on area pages** — Research docs mention civic participation features but there's no way for residents to comment on issues, challenge findings, or add context beyond the "+1" button (which itself doesn't work).

21. **No loading/progress feedback for research** — The `[area]` page shows loading steps but the actual API call (`researchArea()`) is a single blocking request with no progress streaming. The server doesn't stream progress events.

22. **LG Inform API integration returns null** — The function exists with a comment saying it requires an API key. Local government performance data is unavailable.

### NICE TO HAVE (polish and extensions)

23. **Map overlays: IMD deprivation choropleth, air quality heatmap, community places** — All three are described in detail in `becktonMapPoints.ts` comments with clear implementation plans. Data sources are already working. Would transform the map from pins to a full civic audit tool.

24. **PDF/document export** — The `/api/document/generate` and `/api/export` routes exist on the server but no UI triggers them. Would allow researchers to export briefings as shareable documents.

25. **Street View integration** — `getStreetViewUrl()` is implemented in google-apis.ts but never used in any UI component.

26. **Italian-specific civic data sources** — Given the Daemon/Italy connection, Italian municipal data (ANPR, ISTAT, Camera dei Deputati API) would be valuable but is absent.

27. **Offline recording capability** — The recording page requires internet for Web Speech API. A PWA with local recording + sync would enable field use in areas with poor connectivity.

28. **Session playback/review UI** — Sessions are saved but there's no way to review past sessions, replay audio (which isn't recorded anyway), or edit transcripts.

29. **Multi-researcher collaboration** — No concept of teams, shared areas, or collaborative analysis.

30. **Automated issue clustering across sessions** — Currently, the analysis pipeline (if connected) would analyze sessions individually. No mechanism to cluster similar issues across multiple sessions to detect patterns.

31. **Data encryption at rest** — Session JSON files contain sensitive personal data (GPS, age, gender, postcode, interview content) stored in plaintext on disk.

---

## Summary

The codebase has two distinct layers of completeness:

**Well-built (works worldwide now):**
- The research pipeline (Brave + Gemini) produces real briefings for any area on Earth
- CivicDataPanel dynamically loads representatives, census data, and deprivation data for UK/US/CA/worldwide
- The worldwide-civic module correctly routes to country-specific APIs
- BriefingMap fetches and displays real boundaries from Nominatim
- The recording page genuinely captures speech-to-text and GPS

**Hardcoded or broken:**
- The "good" Beckton page with rich interview data is entirely static — a hand-built showcase
- The dynamic `[area]` page has none of Beckton's richness (no issues, no quotes, no proposals)
- There is no pipeline connecting recordings -> analysis -> the rich page format
- Two map components (CivicMap, AreaMap) are hardcoded to Beckton boundaries
- The iterative research loop exists but is unused
- No audio capture, no multilingual support, no working participation buttons

**The core gap**: The product can research any area and display official data. It can record speech and save transcripts. But there is no connection between these two halves. The Beckton page proves the end state is powerful — but replicating it for any area requires building the analysis-to-display pipeline that turns raw sessions into structured issues, voices, and proposals.
