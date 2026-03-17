# Google Maps Platform APIs — Frank Implementation Plan

**Date**: 2026-03-17
**Context**: Frank is a civic listening platform. Users research areas (governance, demographics, issues), go interview residents, and synthesise findings into policy proposals. The server runs Express on port 4740 with existing `/api/area-data` and `/api/gis` endpoints.

**Pricing note**: As of March 2025, Google replaced the $200/month credit with free monthly calls per SKU:
- **Essentials tier**: 10,000 free calls/month per SKU
- **Pro tier**: 5,000 free calls/month per SKU
- **Enterprise tier**: 1,000 free calls/month per SKU
After free tier, pay-as-you-go pricing applies.

**Keys**: Frank needs TWO separate keys in `.env`:
- `GEMINI_API_KEY` — for Gemini model calls (already configured)
- `GOOGLE_MAPS_API_KEY` — for Google Maps Platform APIs (separate Cloud project key)

---

## Tier 1: Implement Now (Biggest Impact, Least Effort)

### 1. Places API (New) — Nearby Search + Text Search

**What it does**: Find real places near any location. "Find community centres near Beckton", "mosques near E6", "pubs near this point". Returns name, address, rating, opening hours, photos, reviews.

**Why critical for Frank**: When a researcher picks an area, Frank can show REAL places to conduct interviews — not just "go to a community centre" but "go to Beckton Community Centre, 11 Kingsford Way, E6 5JQ, rated 4.2, open until 9pm". This transforms the interview planning experience.

**Pricing**:
- Nearby Search (Pro): $32/1,000 requests — **5,000 free/month**
- Text Search (Pro): $32/1,000 requests — **5,000 free/month**
- Place Details Essentials: $5/1,000 — **10,000 free/month**
- Place Photos Enterprise: $7/1,000 — **1,000 free/month**

With field masks, you control which SKU you trigger. Request only `displayName,formattedAddress,location` = Pro SKU. Add `rating,websiteUri` = Enterprise. Add `reviews` = Enterprise+Atmosphere.

**Supported civic place types** (all confirmed in Table A):
`community_center`, `mosque`, `church`, `library`, `local_government_office`, `school`, `hospital`, `pharmacy`, `park`, `post_office`, `police`, `fire_station`, `bus_station`, `train_station`

**Endpoint**: `POST https://places.googleapis.com/v1/places:searchNearby`

**Example request — find community centres near Beckton**:
```bash
curl -X POST 'https://places.googleapis.com/v1/places:searchNearby' \
  -H 'Content-Type: application/json' \
  -H 'X-Goog-Api-Key: YOUR_GOOGLE_MAPS_API_KEY' \
  -H 'X-Goog-FieldMask: places.displayName,places.formattedAddress,places.location,places.rating,places.currentOpeningHours,places.websiteUri,places.primaryType' \
  -d '{
    "includedTypes": ["community_center"],
    "maxResultCount": 10,
    "locationRestriction": {
      "circle": {
        "center": { "latitude": 51.5160, "longitude": 0.0594 },
        "radius": 2000.0
      }
    }
  }'
```

**Example request — Text Search for "mosques near Beckton"**:
```bash
curl -X POST 'https://places.googleapis.com/v1/places:searchText' \
  -H 'Content-Type: application/json' \
  -H 'X-Goog-Api-Key: YOUR_GOOGLE_MAPS_API_KEY' \
  -H 'X-Goog-FieldMask: places.displayName,places.formattedAddress,places.location,places.rating,places.primaryType' \
  -d '{
    "textQuery": "mosques near Beckton London",
    "pageSize": 10
  }'
```

**Integration with Frank server** — add route `/api/places`:

```typescript
// server/src/routes/places.ts
import { Router } from "express";

const router = Router();
const GMAPS_KEY = process.env.GOOGLE_MAPS_API_KEY;

// GET /api/places/nearby?lat=51.516&lng=0.059&type=community_center&radius=2000
router.get("/nearby", async (req, res) => {
  const { lat, lng, type, radius = "2000" } = req.query as Record<string, string>;
  if (!lat || !lng) return res.status(400).json({ error: "lat and lng required" });
  if (!GMAPS_KEY) return res.status(500).json({ error: "GOOGLE_MAPS_API_KEY not configured" });

  const body: any = {
    maxResultCount: 20,
    locationRestriction: {
      circle: {
        center: { latitude: parseFloat(lat), longitude: parseFloat(lng) },
        radius: Math.min(parseFloat(radius), 50000),
      },
    },
  };
  if (type) body.includedTypes = [type];

  const response = await fetch("https://places.googleapis.com/v1/places:searchNearby", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": GMAPS_KEY,
      "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.location,places.rating,places.currentOpeningHours,places.websiteUri,places.primaryType,places.id",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  res.json(data);
});

// GET /api/places/search?q=community+centres+near+Beckton
router.get("/search", async (req, res) => {
  const { q, lat, lng } = req.query as Record<string, string>;
  if (!q) return res.status(400).json({ error: "q (query) required" });
  if (!GMAPS_KEY) return res.status(500).json({ error: "GOOGLE_MAPS_API_KEY not configured" });

  const body: any = { textQuery: q, pageSize: 20 };
  if (lat && lng) {
    body.locationBias = {
      circle: {
        center: { latitude: parseFloat(lat), longitude: parseFloat(lng) },
        radius: 5000,
      },
    };
  }

  const response = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": GMAPS_KEY,
      "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.location,places.rating,places.currentOpeningHours,places.websiteUri,places.primaryType,places.id",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  res.json(data);
});

export default router;
```

**Priority**: CRITICAL. This is the single highest-impact API for Frank.

---

### 2. Air Quality API — Real-time AQI for Area Pages

**What it does**: Returns real-time air quality index (AQI), pollutant concentrations, and health recommendations for any lat/lng. Updated hourly. Covers 100+ countries at 500m resolution. Also provides heatmap tiles for map overlays.

**Why critical for Frank**: Air pollution was a key issue identified in Beckton/Shadwell research. Showing live AQI on the area page with health recommendations gives researchers immediate, sourced data about environmental conditions. This is exactly the kind of "ground truth" Frank should surface.

**Pricing**: Essentials tier — $5/1,000 requests — **10,000 free/month**. This is very generous. Even calling it on every area page load, 10k/month is plenty.

**Endpoint**: `POST https://airquality.googleapis.com/v1/currentConditions:lookup`

**Example request**:
```bash
curl -X POST \
  'https://airquality.googleapis.com/v1/currentConditions:lookup?key=YOUR_GOOGLE_MAPS_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "universalAqi": true,
    "location": { "latitude": 51.5160, "longitude": 0.0594 },
    "extraComputations": [
      "HEALTH_RECOMMENDATIONS",
      "DOMINANT_POLLUTANT_CONCENTRATION",
      "LOCAL_AQI",
      "POLLUTANT_ADDITIONAL_INFO"
    ],
    "languageCode": "en"
  }'
```

**Example response** (key fields):
```json
{
  "dateTime": "2026-03-17T14:00:00Z",
  "regionCode": "gb",
  "indexes": [{
    "code": "uaqi",
    "displayName": "Universal AQI",
    "aqi": 52,
    "category": "Moderate air quality",
    "dominantPollutant": "no2",
    "color": { "red": 0.949, "green": 0.980, "blue": 0.019 }
  }],
  "healthRecommendations": {
    "generalPopulation": "With this level of air quality...",
    "elderly": "If you start to feel respiratory discomfort...",
    "children": "...",
    "pregnantWomen": "..."
  }
}
```

**Integration** — add to `/api/area-data` response or create `/api/air-quality`:

```typescript
// Add to civic-data.ts or create separate route
async function getAirQuality(lat: number, lng: number) {
  const GMAPS_KEY = process.env.GOOGLE_MAPS_API_KEY;
  if (!GMAPS_KEY) return null;

  const res = await fetch(
    `https://airquality.googleapis.com/v1/currentConditions:lookup?key=${GMAPS_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        universalAqi: true,
        location: { latitude: lat, longitude: lng },
        extraComputations: [
          "HEALTH_RECOMMENDATIONS",
          "DOMINANT_POLLUTANT_CONCENTRATION",
          "LOCAL_AQI",
          "POLLUTANT_ADDITIONAL_INFO",
        ],
        languageCode: "en",
      }),
    }
  );
  if (!res.ok) return null;
  return res.json();
}
```

**Priority**: CRITICAL. Low effort, high impact, generous free tier, directly relevant to civic issues.

---

### 3. Geocoding API — Resolve Place Names to Coordinates

**What it does**: Convert "Beckton" or "North London" into lat/lng coordinates + structured address components (neighbourhood, ward, borough, postal code, country). Also does reverse geocoding (lat/lng to address).

**Is it better than Nominatim?** Yes, significantly:
- Much better at resolving informal/colloquial names ("North London", "the East End")
- Returns richer `address_components` with typed levels (administrative_area_level_1 through level_7, locality, sublocality, neighbourhood)
- More reliable, higher uptime, better international coverage
- But: does NOT return ward/constituency boundaries (use Postcodes.io for that, which Frank already does)

**Best use in Frank**: Resolve the initial area name that a user types (e.g. "Beckton", "Peckham", "Downtown Austin") into coordinates, then pass those coordinates to Postcodes.io for UK-specific administrative data. This replaces/supplements Nominatim for initial geocoding.

**Pricing**: Essentials — $5/1,000 requests — **10,000 free/month**

**Endpoint**: `GET https://maps.googleapis.com/maps/api/geocode/json`

**Example**:
```
https://maps.googleapis.com/maps/api/geocode/json?address=Beckton,+London&region=uk&key=YOUR_KEY
```

Returns: lat/lng, formatted address, place_id, and address_components array with types like `neighbourhood`, `sublocality`, `locality`, `administrative_area_level_2` (borough), etc.

**Priority**: CRITICAL. Essential for resolving user-typed area names to coordinates.

---

### 4. Street View Static API — Visual Context for Areas

**What it does**: Returns a street-level photograph for any location. Pass lat/lng + optional heading/pitch, get back a JPEG image. No JavaScript needed.

**Why valuable for Frank**: "This is what this street looks like." Powerful visual context on area pages and interview locations. When a researcher is preparing for fieldwork in an unfamiliar area, seeing the actual streetscape is invaluable.

**Pricing**: Essentials — $7/1,000 requests — **10,000 free/month**

**Endpoint**: `GET https://maps.googleapis.com/maps/api/streetview`

**Example**:
```
https://maps.googleapis.com/maps/api/streetview?size=600x400&location=51.5160,0.0594&fov=90&heading=235&pitch=10&key=YOUR_KEY
```

Returns: JPEG image directly (can be used as `<img src="...">`)

**Integration** — no server route needed, just construct the URL on the frontend:

```typescript
function getStreetViewUrl(lat: number, lng: number, size = "600x400") {
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  return `https://maps.googleapis.com/maps/api/streetview?size=${size}&location=${lat},${lng}&fov=90&key=${key}`;
}
```

**Priority**: CRITICAL. Zero server effort (just an image URL), immediate visual impact.

---

## Tier 2: Implement This Week (Valuable, More Work)

### 5. Maps Grounding (with Gemini) — AI Answers Grounded in Map Data

**What it does**: Allows Gemini to answer location-based questions using live Google Maps data. Instead of hallucinating about what's near a location, Gemini queries Google Maps in real time and returns factual, cited answers.

**How it works**: Add `googleMaps` to the `tools` array in your Gemini API call. Gemini will automatically invoke Maps when it detects geographic intent.

```json
{
  "tools": [{ "googleMaps": {} }],
  "toolConfig": {
    "retrievalConfig": {
      "latLng": { "latitude": 51.5160, "longitude": 0.0594 }
    }
  }
}
```

**Why valuable for Frank**: Frank already uses Gemini for research synthesis and chat. With Maps Grounding, the AI can answer questions like "What community resources exist near Beckton?" with real, current data rather than training-data knowledge. This is a natural extension of the existing chat/research flow.

**Note**: "Maps Grounding Lite" appears to be the standard version enabled via the Gemini API. The distinction from a "full" version is unclear from docs — likely refers to the SKU/pricing tier.

**Pricing**: Need to verify — likely tied to Gemini API usage with a per-grounding-call fee. Check `ai.google.dev` for current Maps Grounding pricing.

**Priority**: USEFUL. Medium effort (modify Gemini calls in `gemini.ts`), but powerful because it makes every AI response location-aware.

---

### 6. Elevation API — Flood Risk Indicator

**What it does**: Returns elevation in metres above sea level for any point. Can sample elevation along paths.

**Why useful for Frank**: Low-lying areas are flood-prone. Showing "this area is 2m above sea level" on the area page is meaningful civic data, especially for areas near rivers or coasts. In Beckton, proximity to the Thames and the Royal Docks makes elevation data directly relevant to flood risk narratives.

**Pricing**: Essentials — $5/1,000 requests — **up to 512 coords per request** — **5,000 free/month**

**Endpoint**: `GET https://maps.googleapis.com/maps/api/elevation/json?locations=51.5160,0.0594&key=YOUR_KEY`

**Integration** — add to area-data response:

```typescript
async function getElevation(lat: number, lng: number) {
  const GMAPS_KEY = process.env.GOOGLE_MAPS_API_KEY;
  if (!GMAPS_KEY) return null;
  const res = await fetch(
    `https://maps.googleapis.com/maps/api/elevation/json?locations=${lat},${lng}&key=${GMAPS_KEY}`
  );
  if (!res.ok) return null;
  const data = await res.json();
  return data.results?.[0]?.elevation ?? null; // metres above sea level
}
```

**Priority**: USEFUL. Very low effort, adds meaningful environmental context.

---

### 7. Maps JavaScript API — Interactive Maps in the Frontend

**What it does**: Full Google Maps in the browser with satellite imagery, Street View integration, drawing tools, heatmap layers, data-driven styling, and boundary visualisation.

**Advantages over Leaflet/OpenStreetMap**:
- Far superior satellite imagery (regularly updated, high resolution)
- Built-in Street View panorama integration
- Administrative boundary display and interaction
- Places library integration (search directly on the map)
- Better styled maps with cloud-based map styling
- WebGL-powered data visualisation

**Disadvantages**:
- Costs money per map load ($7/1,000 — 10,000 free/month)
- Heavier JS bundle than Leaflet
- Less "open" philosophy (vendor lock-in)

**Verdict for Frank**: Keep Leaflet for the basic map view (it's free and works). Use Google Maps JavaScript API for specific features that need it: satellite view toggle, Street View embedding, boundary overlays. Or switch entirely if the 10k free loads/month is sufficient.

**Pricing**: $7/1,000 map loads — **10,000 free/month** (enough for ~330 loads/day)

**Priority**: USEFUL. Not urgent if current Leaflet setup works, but the satellite view and Street View integration would be a significant UX upgrade.

---

## Tier 3: Implement Later (Nice to Have)

### 8. Places Aggregate API — Service Density Analysis

**What it does**: Analyse place distributions with location insights. Likely shows counts/density of place types (shops, healthcare, schools) within a defined area.

**Status**: Documentation was not publicly accessible at time of research (404 on multiple URL patterns). This may be a very new API still in preview/beta.

**Why interesting for Frank**: "There are 3 GP surgeries serving 40,000 people in this ward" is powerful civic data. Being able to quantify service density per area would directly inform policy proposals.

**Priority**: NICE-TO-HAVE. Monitor for when docs become available. Could become Tier 1 if it does what it sounds like.

---

### 9. Solar API — Energy Poverty Indicator

**What it does**: Analyses rooftop solar potential for buildings. Returns building dimensions, solar flux data, annual sunlight hours, and optimal panel placement.

**Potential civic use**: Map areas with high solar potential but low adoption — potential indicator of energy poverty or missed renewable opportunity. Could overlay with deprivation data: "This deprived area has excellent solar potential but zero installations."

**Pricing**: Unknown per-request cost. Building Insights endpoint is the most relevant.

**Priority**: NICE-TO-HAVE. Interesting but niche. Only implement if energy/climate becomes a core Frank research theme.

---

### 10. Address Validation API

**What it does**: Validates and standardises addresses. Returns formatted address, geocode, and USPS/Royal Mail delivery point data.

**Potential use**: Validate addresses entered by interviewees. Standardise location data across interviews.

**Pricing**: Pro — $17/1,000 requests — **5,000 free/month**

**Priority**: NICE-TO-HAVE. Postcodes.io handles UK address resolution well enough.

---

## Skip: Not Worth It for Frank

### Google Civic Information API

**What it does**: Returns elected officials and election info for US addresses. Covers federal, state, and some local levels.

**UK coverage**: Essentially NONE. This is a US-focused API. It does not cover UK local councils, wards, or constituencies.

**Frank already has better**: The existing `civic-data.ts` uses Postcodes.io + UK Parliament API + TheyWorkForYou, which gives full UK coverage at ward/constituency level. For US locations, Frank already calls the Civic Information API as a fallback (line 745 of civic-data.ts).

**Verdict**: Already implemented where useful. No further work needed.

---

### Maps Static API

**What it does**: Returns a static map image (like a screenshot of Google Maps).

**Why skip**: Frank already has interactive maps via Leaflet. Static map images add little value when you have an interactive map. Street View Static API (Tier 1) is far more useful.

---

### Maps Embed API

**What it does**: Embeds a Google Map via iframe.

**Why skip**: Frank already has a proper map implementation. Iframes are inflexible.

---

### Map Tiles API

**What it does**: Serves raw map tiles for custom rendering.

**Why skip**: Leaflet + CARTO/OSM tiles work fine. Only useful if switching to a fully custom map renderer.

---

### Directions / Distance Matrix / Routes API

**What it does**: Navigation and route planning.

**Why skip**: Frank is not a navigation app. Researchers don't need turn-by-turn directions within the platform.

---

### Roads API

**What it does**: Snaps GPS points to road segments.

**Why skip**: No use case in Frank.

---

### Geolocation API

**What it does**: Determines location from cell towers and WiFi access points.

**Why skip**: Browser geolocation API does this natively for free.

---

### Pollen API / Weather API

**What it does**: Pollen counts and weather forecasts.

**Why skip**: Not relevant to civic research. Weather is available everywhere else.

---

### Aerial View API

**What it does**: Cinematic aerial fly-over videos of locations.

**Why skip**: Cool but no civic value. Street View is more useful.

---

### Maps Datasets API

**What it does**: Upload and manage custom geographic datasets.

**Why skip**: Frank's data is in SQLite/JSON, not custom map datasets.

---

## Summary Priority Matrix

| API | Priority | Free Tier | Effort | Impact |
|-----|----------|-----------|--------|--------|
| **Places API (New)** | CRITICAL | 5K nearby + 5K text/mo | Medium | Huge — real interview locations |
| **Air Quality API** | CRITICAL | 10K/mo | Low | High — live environmental data |
| **Geocoding API** | CRITICAL | 10K/mo | Low | High — resolve area names |
| **Street View Static** | CRITICAL | 10K/mo | Minimal | High — visual area context |
| **Maps Grounding (Gemini)** | USEFUL | TBD | Medium | High — AI with real map data |
| **Elevation API** | USEFUL | 5K/mo | Minimal | Medium — flood risk context |
| **Maps JavaScript API** | USEFUL | 10K loads/mo | High | Medium — satellite + Street View |
| **Places Aggregate** | NICE | TBD | TBD | Potentially high |
| **Solar API** | NICE | TBD | Medium | Niche |
| **Address Validation** | NICE | 5K/mo | Low | Low |

## .env Configuration

Add to Frank's server `.env`:

```
# Google Maps Platform (separate from Gemini)
GOOGLE_MAPS_API_KEY=AIza...your-maps-key...

# Already present:
GEMINI_API_KEY=AIza...your-gemini-key...
```

For the frontend (Street View image URLs), also add to the web `.env`:

```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIza...your-maps-key...
```

**Important**: The Google Maps API key should be restricted in the Cloud Console:
- API restrictions: Only enable the specific APIs you use
- Application restrictions: HTTP referrer for frontend key, IP address for server key
- Consider separate keys for server (unrestricted by referrer) and frontend (referrer-restricted)

## Implementation Order

1. Add `GOOGLE_MAPS_API_KEY` to server `.env`
2. Create `/api/places` route (Nearby Search + Text Search)
3. Add Air Quality to `/api/area-data` response
4. Add Geocoding fallback for area name resolution
5. Add Street View image URLs to area page frontend
6. Add Elevation to `/api/area-data` response
7. Enable Maps Grounding in Gemini calls
8. Evaluate Maps JavaScript API vs keeping Leaflet
