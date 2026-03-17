# Map Overlays for Civic Storytelling & Post-Interview Consolidation Session

**Date**: 2026-03-17
**Context**: Frank is a civic listening platform. Researchers go into areas, interview residents about their lived experience, and synthesise findings into policy proposals. The platform needs (1) map overlays that tell a civic story, not just display data, and (2) a structured post-interview consolidation session where the interviewer reviews, corrects, and enriches the AI's initial analysis of the recording.

---

## Part 1: Civic Map Overlays — Prioritised

The GIS backend (`/home/arthur/gis/backend/services/`) already has 25+ services. The question is not "what data can we show" but "what data tells a story a resident or councillor would care about."

### Tier 1: Implement First (Direct Civic Relevance)

#### 1. Deprivation by LSOA (Index of Multiple Deprivation 2025)

**What it shows**: Each Lower-layer Super Output Area (roughly 1,500 people) coloured by its deprivation decile — from dark red (most deprived 10%) to dark green (least deprived 10%).

**Why it matters**: This is the single most powerful civic overlay. It immediately contextualises every interview. When a resident says "nothing ever gets fixed round here," the IMD overlay shows whether they live in the most deprived 5% of neighbourhoods in England. It grounds anecdote in statistical reality.

**Data source**: The English Indices of Deprivation 2025 were published 30 October 2025 on GOV.UK. LSOA boundary GeoJSON is available from the ONS Open Geography Portal. The IMD has seven domains: Income, Employment, Education, Health, Crime, Barriers to Housing & Services, and Living Environment — each can be shown as a separate sub-overlay.

**Implementation**:
- Download IoD25 CSV + LSOA boundary GeoJSON (one-time, ~15MB)
- Pre-join into a single GeoJSON with decile properties per domain
- Serve as a static tile layer or vector GeoJSON via the GIS backend
- Colour scheme: 10-step diverging palette (red-amber-green) with legend explaining deciles
- On hover/click: show the LSOA name, IMD rank (out of 33,755), and domain scores

**Civic story**: "This neighbourhood is in the most deprived 10% for health and housing, but the least deprived 30% for crime. The issues residents raise are consistent with this profile."

#### 2. Air Quality Overlay (AQI Heatmap)

**What it shows**: Real-time air quality coloured by AQI level — green (good), yellow (moderate), orange (unhealthy for sensitive groups), red (unhealthy), purple (very unhealthy).

**Why it matters**: Air pollution is a top civic concern in urban areas. In Beckton fieldwork, residents mentioned pollution from the A13, the sewage works, and industrial sites. Showing a live AQI overlay turns "it smells bad" into "the PM2.5 level is 3x the WHO guideline."

**Existing capability**: The GIS backend already has both `air_quality.py` (OpenAQ stations) and `google_air_quality.py` (Google Air Quality API with health recommendations). Google also provides AQI heatmap tiles that can be overlaid directly on a map.

**Implementation**:
- Use Google Air Quality API heatmap tiles for the visual overlay (already available as a tile layer)
- On click at any point, fetch current conditions from the existing `/api/google-air-quality` endpoint
- Display: AQI number, dominant pollutant, health recommendation for vulnerable groups
- Optionally show OpenAQ station locations as markers for transparency about data sources

**Civic story**: "The air quality in this area regularly exceeds WHO guidelines. 3 of 5 residents mentioned respiratory issues. The dominant pollutant is NO2 from road traffic."

#### 3. Transit Accessibility (15-Minute Isochrone)

**What it shows**: Walking isochrones (5, 10, 15 minutes) from any point, combined with transit stop locations. Areas outside the 15-minute walk to a bus or train stop are highlighted as "transit deserts."

**Why it matters**: Car dependence is a civic burden — it affects who can access jobs, healthcare, and education. The 15-minute city score (already built in `fifteen_min_city.py`) quantifies this. Showing it visually on a map makes the argument visceral.

**Existing capability**: `isochrone.py` (walking isochrones via OSMnx), `transit.py` (bus/rail/tram stops via Overpass), `fifteen_min_city.py` (composite score via Google Places + Routes).

**Implementation**:
- Layer 1: Transit stops as icons (bus = blue circle, rail = red diamond, tram = green square)
- Layer 2: 15-minute walking isochrone from the area centre, shaded in translucent green
- Layer 3: Heatmap of "distance to nearest transit stop" — red where >800m to any stop
- Interactive: click any point to generate a fresh isochrone from that location

**Civic story**: "65% of this ward is more than a 10-minute walk from the nearest bus stop. Residents without cars cannot reach the GP surgery within 15 minutes on foot."

#### 4. Interview Locations with Quotes (The "Voice Map")

**What it shows**: Pins on the map where interviews took place or where residents mentioned specific places. Each pin carries the relevant quote, the issue discussed, and the speaker's demographic profile (anonymised).

**Why it matters**: This is uniquely Frank's. No GIS product does this. It transforms the map from a data display into a narrative surface — the map *speaks* with residents' voices.

**Implementation**:
- Each interview gets a location (either GPS from recording, or interviewer-confirmed location)
- Each place mentioned in the transcript gets a pin (geocoded and interviewer-verified — see Part 2)
- Pin click opens a card: quote text, issue tag, speaker demographic summary, date
- Cluster pins when zoomed out; expand on zoom
- Filter by issue tag (housing, transport, health, crime, environment, services)
- Colour pins by issue category

**Civic story**: "12 residents across 3 streets all mentioned the same abandoned building. 8 of them used the word 'dangerous.' The building is 200m from a primary school."

#### 5. Green Space Accessibility

**What it shows**: Parks and green spaces as polygons, plus a heatmap showing distance to the nearest park from every point in the area.

**Why it matters**: Access to green space is a public health indicator. The WHO recommends everyone should live within 300m of green space. Showing gaps reveals inequity.

**Existing capability**: `green_space.py` (parks/gardens/forests from Overpass with area calculations and nearest-park distance).

**Implementation**:
- Green space polygons filled in semi-transparent green
- Heatmap: distance to nearest park boundary — green (<300m), amber (300-600m), red (>600m)
- Stats panel: green space ratio, nearest park distance, total green area
- Overlay with IMD deprivation to show whether deprived areas also lack green space

**Civic story**: "This estate has 4,200 residents and the nearest park is 850m away. The green space ratio is 3%, compared to 18% in the neighbouring ward."

### Tier 2: Implement Next (Strong Civic Value)

#### 6. Places Mentioned in Interviews (Auto-Detected)

This is the "smart" version of overlay #4. Rather than only showing where interviews happened, it shows every place mentioned in every interview — the shopping centre, the GP surgery, the school, "the slag heap," "Asda," "Galleons Reach" — all geocoded and pinned to the map with the context of what was said about them.

**Implementation**: See Part 2 (place extraction pipeline).

#### 7. Land Use / Zoning

**What it shows**: The area coloured by land use category — residential (yellow), commercial (blue), industrial (grey), green (green), water (blue).

**Why it matters**: Shows the character of a neighbourhood at a glance. Industrial zones adjacent to residential areas are a common civic tension. Reveals how much land is devoted to each use.

**Existing capability**: `landuse.py` with categorisation and area breakdown percentages.

**Civic story**: "32% of the land within 500m of this estate is classified as industrial. Residents report noise, truck traffic, and air quality concerns."

#### 8. Building Density and Age

**What it shows**: Building footprints coloured by type (residential, commercial, industrial) or by construction era where data is available.

**Why it matters**: Housing stock age correlates with insulation quality, damp, and energy costs. Dense post-war estates have different issues from Victorian terraces or new-build developments.

**Existing capability**: `buildings.py` (footprints with type and levels), `morphology.py` (coverage ratio, compactness, nearest-neighbour distance).

**Civic story**: "This area has a building coverage ratio of 0.42, with an average building area of 85m2. The morphology indicates dense, uniform post-war housing stock."

#### 9. Elevation / Flood Risk

**What it shows**: Terrain elevation as a coloured grid, highlighting low-lying areas that may be flood-prone.

**Why it matters**: Flooding is a major civic concern in river/coastal areas. Low elevation + proximity to water = risk.

**Existing capability**: `elevation.py` (Open-Meteo 5x5 grid with min/max/mean stats).

**Enhancement**: Overlay with Environment Agency flood risk zones (freely available as GeoJSON from data.gov.uk).

**Civic story**: "The mean elevation of this neighbourhood is 2.1m above sea level. It sits within Flood Zone 3 (high risk). 4 of 7 residents mentioned flooding."

#### 10. Noise Pollution

**What it shows**: Road and rail noise levels as a heatmap, based on Defra's Strategic Noise Mapping (Round 4, 2022 data).

**Why it matters**: Noise is an under-reported civic burden. Residents near major roads or railways experience chronic noise exposure that affects sleep, concentration, and mental health.

**Data source**: Defra publishes strategic noise maps on a 10m grid via the Defra Data Services Platform (environment.data.gov.uk). Metrics include Lden (day-evening-night level) and LAeq,16h (16-hour equivalent level). Available as GIS shapefiles.

**Implementation**:
- Download Defra noise data for the area of interest (or serve via WMS tile layer from Defra)
- Colour by noise level: green (<55 dB), amber (55-65 dB), orange (65-75 dB), red (>75 dB)
- Overlay with residential buildings to show how many homes are in high-noise zones

**Civic story**: "230 homes on this street experience daytime noise levels above 70 dB — equivalent to standing next to a vacuum cleaner, all day."

### Tier 3: Implement Later (Useful Context)

#### 11. Street View at Interview Locations
Use existing `street_view.py` to show a Street View image for each interview pin. Visual context for what the area looks like.

#### 12. Walkability Score
Already built in `walkability.py`. Show as a single number (0-100) with breakdown by component. Useful for area summaries but not a compelling map overlay on its own.

#### 13. Solar Exposure / Daylight Hours
Built in `solar.py`. Niche but relevant for energy poverty discussions.

#### 14. Satellite Imagery Toggle
Built in `satellite.py`. Useful as a base layer option rather than an overlay.

#### 15. POI Density
Built in `pois.py`. Shows service availability but overlaps with the 15-minute city analysis.

---

## Part 2: Extracting Places from Interview Transcripts

When a resident says "the slag heap," "the shopping centre," "Galleons Reach," or "Britvic factory," the platform needs to: (a) detect it as a place reference, (b) resolve it to coordinates, (c) pin it on the map, and (d) attach the relevant quote.

### The Pipeline

```
Audio -> Whisper Transcription -> Place Detection (NER) -> Candidate Resolution (Geocoding)
  -> Interviewer Verification (Post-Interview Session) -> Confirmed Pin on Map
```

### Stage 1: Place Detection (Named Entity Recognition)

**Tool**: spaCy with the `en_core_web_trf` (transformer) model, which has the best NER accuracy for English.

**How it works**: spaCy's NER identifies entities labelled `GPE` (geo-political entity — countries, cities, states), `LOC` (non-GPE locations — mountain ranges, bodies of water), and `FAC` (facilities — buildings, airports, highways, bridges).

**The problem with informal references**: spaCy will catch "Galleons Reach" and "Beckton" but will miss "the shopping centre," "the slag heap," and "that pub on the corner." These are *definite descriptions* (linguistic term), not proper nouns.

**Solution — two-pass approach**:

1. **Pass 1: spaCy NER** — catches formal place names. Extract all GPE, LOC, FAC entities.

2. **Pass 2: LLM-based extraction** — send the transcript to Gemini with a prompt like:

   > "Extract all references to specific places, buildings, landmarks, or locations from this interview transcript. Include informal references like 'the shopping centre', 'the pub on the corner', 'that factory'. For each, provide: the exact text, the surrounding sentence for context, and your best guess at what the place might be."

   This catches what NER misses because LLMs understand context and pragmatics.

**Output**: A list of place mentions, each with:
- `text`: the exact words used ("the shopping centre")
- `context`: the surrounding sentence
- `type`: formal_name / informal_reference / landmark
- `confidence`: high / medium / low
- `llm_guess`: optional best guess ("Galleons Reach Shopping Park")

### Stage 2: Candidate Resolution (Geocoding)

For each detected place mention, generate candidate coordinates:

1. **Formal names** (e.g., "Galleons Reach"): Geocode using Google Geocoding API or Nominatim (existing `geocode.py`), biased to the interview area's coordinates. This usually returns a single high-confidence result.

2. **Informal references** (e.g., "the shopping centre"): Use the LLM's guess as a search query with Google Places Text Search, biased to the interview location. "shopping centre near Beckton" will return Galleons Reach Shopping Park.

3. **Very local references** (e.g., "the slag heap"): These may not appear in any gazetteer. Flag for interviewer confirmation. The LLM guess + local area context may help, but the interviewer is the ground truth.

**Geoparsing tools worth knowing about**:
- **Mordecai 3** (github.com/ahalterman/mordecai3): A neural geoparser that resolves place names using a transformer model + Geonames gazetteer. Good for formal toponyms.
- **LLM-based geoparsing**: Recent research (arXiv:2510.08741) shows LLMs can resolve complex compositional location references ("the corner of Mill Road and Parker Street") by combining geospatial reasoning with knowledge base lookups.

**Key insight**: Context-aware geoparsing is critical. "The shopping centre" in Beckton means Galleons Reach. In Peckham it means Aylesham Centre. The interview's area location must be passed as context to every geocoding call.

### Stage 3: Interviewer Verification

All geocoded places are presented to the interviewer in the post-interview consolidation session (see Part 3) for confirmation or correction. No place pin should appear on the public map without interviewer sign-off.

### Data Model for Place Mentions

```typescript
interface PlaceMention {
  id: string;
  interviewId: string;

  // Detection
  rawText: string;           // "the shopping centre"
  context: string;           // "She said she walks to the shopping centre every morning"
  detectionMethod: "ner" | "llm" | "manual";

  // Resolution
  resolvedName: string | null;      // "Galleons Reach Shopping Park"
  lat: number | null;
  lng: number | null;
  geocodeSource: "google" | "nominatim" | "interviewer" | null;
  geocodeConfidence: "high" | "medium" | "low" | "unresolved";

  // Verification
  interviewerVerified: boolean;
  interviewerCorrected: boolean;

  // Content
  issueTags: string[];       // ["transport", "accessibility"]
  timestampStart: number;    // seconds into recording
  timestampEnd: number;
}
```

---

## Part 3: Post-Interview Consolidation Session — UX Design

### Design Philosophy

The consolidation session is not a chore — it is the researcher's opportunity to enrich the data while their memory is fresh. It should feel like a guided debrief, not a form to fill out.

**Inspiration from qualitative research tools**:

- **NVivo / Atlas.ti**: Use a "code-as-you-read" paradigm. The researcher reads the transcript and highlights segments, assigning codes. This is thorough but slow and requires training.
- **Dovetail**: Uses AI to auto-summarise and auto-tag, then the researcher reviews. Tags show up on a tag board where they can be grouped into themes. The key UX insight: *tag first, analyse second*.
- **Looppanel**: Emphasises the post-interview debrief — immediately after the call, the AI generates a summary and the researcher edits it. This "hot debrief" captures context that fades within hours.

**Frank's approach**: Combine the best of these. The AI does the heavy lifting (transcription, place detection, issue tagging, summarisation). The interviewer reviews and corrects in a guided flow. The session should take 10-20 minutes for a 30-minute interview.

### UX Flow: The Five Steps

#### Step 1: Transcript Review + Key Moments (3-5 min)

**What the interviewer sees**: The full transcript displayed with timestamps, synchronised with audio playback. AI has highlighted "key moments" — segments where the tone shifted, a strong opinion was expressed, or a specific place/issue was mentioned.

**What they do**:
- Scan the transcript (they were just there, they know what was said)
- Confirm or dismiss AI-highlighted moments
- Flag any sections the AI missed
- Mark any sections that should be redacted (off-the-record comments)

**UX pattern**: Dovetail-style highlight + tag. Click a highlighted segment to see the AI's note ("This seems like a strong statement about housing"). Accept, dismiss, or edit.

#### Step 2: Place Confirmation on Map (3-5 min)

**What the interviewer sees**: A map of the interview area with pins for every place the AI detected. Each pin shows the place name (or "Unknown place — 'the shopping centre'"), the relevant quote, and a confidence indicator.

**What they do**:
- **Green pins (high confidence)**: "Galleons Reach" resolved to correct location. Interviewer taps to confirm or skips (confirmed by default after 48h).
- **Amber pins (medium confidence)**: "the shopping centre" — AI guessed Galleons Reach Shopping Park. Interviewer confirms, corrects (tap elsewhere on map), or dismisses.
- **Red pins (low confidence / unresolved)**: "the slag heap" — AI could not resolve. Interviewer taps the map to place the pin manually, or types a name to search.
- **Add missing places**: "They also talked about the Beckton Arms but the AI didn't catch it." Interviewer can add pins manually.

**UX pattern**: Inspired by map-based survey tools. The map is interactive (Leaflet with draw capabilities). To correct a pin, the interviewer long-presses the pin and drags it, or taps "Relocate" and taps the correct spot. For new pins, they tap "Add place" then tap the map.

**Library recommendation**: Use **Terra Draw** (github.com/JamesLMilner/terra-draw) for cross-library drawing support, or Leaflet's built-in marker dragging. Avoid full Leaflet.Draw (overkill — we only need point placement, not polygons/polylines).

**Key interaction**: When the interviewer taps a pin, the audio plays from the timestamp where that place was mentioned. This helps them remember the context.

#### Step 3: Clarification Questions (2-3 min)

**What the interviewer sees**: A series of AI-generated questions, presented one at a time, card-style (like a chat interface or flashcard deck).

**Types of questions**:

1. **Ambiguous references**: "The person mentioned 'the council' — did they mean Newham Council (local authority) or the GLA (Greater London Authority)?"
   - Multiple choice with an "other" option

2. **Demographic estimation**: "You spoke with someone who mentioned living here 15 years. What age range would you estimate? [18-30] [30-45] [45-60] [60-75] [75+]"
   - Tap to select

3. **Conversation structure**: "The recording is 28 minutes. Were these separate conversations or one continuous interview?"
   - [One person, continuous] [Multiple people, together] [Multiple people, separate conversations]
   - If multiple: "Where does the second conversation start?" [show waveform, let them tap]

4. **Location context**: "The interview was recorded near [GPS location]. Was this where the conversation happened, or did you walk/drive somewhere?"
   - [Yes, this is correct] [No, we were actually at...] [map tap to correct]

5. **Unclear audio**: "At 14:32, the transcript reads '[inaudible] ...about the bins.' Can you fill in what was said?"
   - Text input with audio playback from that timestamp

**UX pattern**: Each question is a card. Swipe right to answer, swipe left to skip. A progress bar shows how many questions remain. The AI prioritises questions by impact — place resolution questions first, then demographic, then clarification.

**Generation**: The questions are generated by sending the transcript + detected entities to Gemini with a prompt that asks it to identify ambiguities, under-specified references, and missing context that a human present at the interview could resolve.

#### Step 4: Issue Tagging (2-3 min)

**What the interviewer sees**: The transcript divided into segments, each with an AI-suggested issue tag. Tags are drawn from Frank's issue taxonomy (housing, transport, health, education, environment, crime, employment, services, community, cost-of-living).

**What they do**:
- Confirm correct tags (tap the tag = confirmed, green border)
- Correct wrong tags (tap to see the full taxonomy, select the right one)
- Add missing tags (segments the AI did not tag but should have)
- Split segments (the AI grouped two distinct issues into one segment)

**UX pattern**: A scrollable list of transcript segments with chips for each tag. Tapping a chip cycles through confirm/edit/remove. Very similar to Gmail's label interface.

**Important**: Tags are *not* researcher opinions. They categorise what the *resident* talked about. The AI's initial tags come from analysing the transcript content, not from sentiment analysis.

#### Step 5: Summary Review (1-2 min)

**What the interviewer sees**: An AI-generated summary of the interview — 3-5 sentences covering who was interviewed, what issues they raised, and what places they mentioned.

**What they do**:
- Read the summary
- Edit anything inaccurate (inline editing)
- Add any context the AI could not know ("This person was visibly upset when talking about the school closure" / "They were speaking on behalf of their elderly neighbour who cannot leave the house")

**UX pattern**: A text area pre-filled with the AI summary. The interviewer edits in place. Their additions are marked as "interviewer notes" and preserved alongside the AI summary.

### After Consolidation

Once the interviewer completes all five steps:
- All verified place pins appear on the area map
- The transcript is tagged and segmented
- The summary is finalised
- The data is ready for cross-interview analysis (comparing themes across all interviews in the area)

The interviewer sees a confirmation screen: "Interview processed. 4 places confirmed. 7 issues tagged. Ready for analysis." With a button to start the next interview.

### Session Timing and Urgency

The consolidation session should be prompted immediately after recording stops. If the interviewer does not complete it within 2 hours, send a reminder. After 24 hours, the AI's best guesses are accepted as defaults (with a flag that they were not interviewer-verified). The interviewer can always return and edit later, but the quality of corrections degrades rapidly with time.

---

## Part 4: What the Map Shows for Each Interview Pin

When someone clicks an interview pin on the area map, they should see:

### The Pin Card

```
┌─────────────────────────────────────────────┐
│ 📍 Interview #7 — Beckton, E6              │
│ 15 March 2026 · 28 min · 1 person          │
│                                              │
│ [Street View thumbnail image]               │
│                                              │
│ Issues raised:                               │
│ [Housing] [Transport] [Environment]          │
│                                              │
│ Key quote:                                   │
│ "We've been waiting three years for them     │
│  to fix the damp. Three years."              │
│                                              │
│ Places mentioned:                            │
│ • Galleons Reach Shopping Park (transport)   │
│ • Beckton DLR (transport)                    │
│ • The old Britvic factory site (environment) │
│                                              │
│ Demographics:                                │
│ Age: 45-60 · Lived here: 15 years           │
│ Gender: not recorded · Ethnicity: not asked  │
│                                              │
│ [View full transcript] [Play audio excerpt]  │
└─────────────────────────────────────────────┘
```

### The Place-Mention Pin Card

When someone clicks a *place mention* pin (not an interview pin):

```
┌─────────────────────────────────────────────┐
│ 📍 Galleons Reach Shopping Park             │
│ Mentioned in 4 interviews                    │
│                                              │
│ What people said:                            │
│                                              │
│ Interview #3 (Housing):                      │
│ "It's the only place to shop but you need    │
│  a car to get there with bags."              │
│                                              │
│ Interview #7 (Transport):                    │
│ "The bus to Galleons Reach only comes every  │
│  40 minutes after 6pm."                      │
│                                              │
│ Interview #11 (Community):                   │
│ "We used to have proper shops on the high    │
│  street. Now it's all in the retail park."   │
│                                              │
│ Interview #14 (Accessibility):               │
│ "My mum can't walk that far. She's          │
│  basically stuck."                           │
│                                              │
│ Issue breakdown:                             │
│ [Transport: 2] [Community: 1]               │
│ [Accessibility: 1]                           │
│                                              │
│ [Show on map] [View all interviews]          │
└─────────────────────────────────────────────┘
```

This is where Frank's civic intelligence becomes visible. A single place, mentioned by multiple residents, with a clear pattern of concern. This is the data that becomes a policy proposal.

---

## Part 5: Technical Implementation Notes

### Map Library

Stay with **Leaflet** for now. It handles all the overlay types described here (GeoJSON polygons, heatmaps via Leaflet.heat, markers with popups, draggable markers for place correction). The Google Maps JavaScript API adds satellite imagery and built-in Street View but costs per load and adds vendor lock-in.

If satellite imagery is needed, use Esri World Imagery tiles (free) as an optional base layer.

### Overlay Toggle UX

The map should have a layer control panel (right side, collapsible) with checkboxes for each overlay:
- [ ] Deprivation (IMD 2025)
- [ ] Air Quality (live AQI)
- [ ] Transit Accessibility
- [ ] Green Space Access
- [ ] Interview Voices
- [ ] Places Mentioned
- [ ] Land Use
- [ ] Building Density
- [ ] Elevation / Flood Risk
- [ ] Noise Pollution

Maximum 2-3 overlays active simultaneously to avoid visual clutter. When an overlay is activated, a legend appears in the bottom-left corner explaining the colour scale.

### NER + Geocoding Pipeline (Server-Side)

```
POST /api/interviews/:id/extract-places

1. Load transcript text
2. Run spaCy NER (en_core_web_trf) -> extract GPE, LOC, FAC entities
3. Run Gemini extraction -> extract informal place references
4. Deduplicate (merge "Galleons Reach" and "Galleons Reach Shopping Park")
5. For each place:
   a. If formal name: geocode via Google Geocoding API (biased to area lat/lng)
   b. If informal: text search via Google Places API (biased to area lat/lng)
   c. If unresolvable: flag for interviewer
6. Return list of PlaceMention objects with confidence levels
7. Store in database, awaiting interviewer verification
```

### Consolidation Session API

```
GET  /api/interviews/:id/consolidation
  -> Returns: transcript, detected places, generated questions, suggested tags, AI summary

POST /api/interviews/:id/consolidation/places/:placeId/verify
  -> Body: { confirmed: boolean, correctedLat?: number, correctedLng?: number, correctedName?: string }

POST /api/interviews/:id/consolidation/questions/:questionId/answer
  -> Body: { answer: string | string[] }

POST /api/interviews/:id/consolidation/tags
  -> Body: { segments: [{ start: number, end: number, tags: string[] }] }

POST /api/interviews/:id/consolidation/summary
  -> Body: { editedSummary: string, interviewerNotes: string }

POST /api/interviews/:id/consolidation/complete
  -> Marks the consolidation as done, publishes verified data
```

---

## Summary: What to Build and When

### Sprint 1 (This Week)
1. **IMD Deprivation overlay** — download data, create GeoJSON layer, add to map
2. **Air Quality overlay** — wire up existing Google AQ API as a heatmap tile layer
3. **Interview pin cards** — basic pin-on-map with quote, issues, and demographics

### Sprint 2 (Next Week)
4. **Place extraction pipeline** — spaCy NER + Gemini extraction + geocoding
5. **Consolidation session UI** — Step 2 (place confirmation on map) and Step 3 (clarification questions)
6. **Transit accessibility overlay** — combine existing isochrone + transit endpoints

### Sprint 3 (Week After)
7. **Full consolidation session** — all five steps
8. **Place-mention aggregation** — cross-interview place cards showing all quotes per location
9. **Green space accessibility** — distance-to-park heatmap
10. **Land use overlay**

### Sprint 4 (Following Week)
11. **Elevation / flood risk** — with Environment Agency flood zone overlay
12. **Noise pollution** — Defra strategic noise map tiles
13. **Building density/age overlay**
14. **Summary dashboard** — area-level statistics drawn from all overlays + all interviews
