// ============================================================================
// Frank — Google Maps Platform APIs
// Places (New), Air Quality, Geocoding, Street View, Civic Information
// ============================================================================

const API_KEY = process.env.GOOGLE_API_KEY || "";

// ---------------------------------------------------------------------------
// Geocoding — resolve area names to coordinates
// ---------------------------------------------------------------------------

export interface GeocodingResult {
  formattedAddress: string;
  lat: number;
  lng: number;
  types: string[];
  placeId: string;
}

export async function geocode(query: string): Promise<GeocodingResult[]> {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json() as { results: Array<{ formatted_address: string; geometry: { location: { lat: number; lng: number } }; types: string[]; place_id: string }> };
  return (data.results || []).map((r) => ({
    formattedAddress: r.formatted_address,
    lat: r.geometry.location.lat,
    lng: r.geometry.location.lng,
    types: r.types,
    placeId: r.place_id,
  }));
}

// ---------------------------------------------------------------------------
// Places (New) — find real venues near a location
// ---------------------------------------------------------------------------

export interface NearbyPlace {
  name: string;
  address: string;
  types: string[];
  lat: number;
  lng: number;
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
}

export async function findNearbyPlaces(
  lat: number,
  lng: number,
  types: string[],
  radius: number = 1000,
  maxResults: number = 10
): Promise<NearbyPlace[]> {
  const url = "https://places.googleapis.com/v1/places:searchNearby";
  const body = {
    includedTypes: types,
    maxResultCount: maxResults,
    locationRestriction: {
      circle: {
        center: { latitude: lat, longitude: lng },
        radius,
      },
    },
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": API_KEY,
      "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.types,places.location,places.rating,places.userRatingCount,places.googleMapsUri",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) return [];
  const data = await res.json() as { places?: Array<{ displayName?: { text: string }; formattedAddress?: string; types?: string[]; location?: { latitude: number; longitude: number }; rating?: number; userRatingCount?: number; googleMapsUri?: string }> };

  return (data.places || []).map((p) => ({
    name: p.displayName?.text || "Unknown",
    address: p.formattedAddress || "",
    types: p.types || [],
    lat: p.location?.latitude || 0,
    lng: p.location?.longitude || 0,
    rating: p.rating,
    userRatingCount: p.userRatingCount,
    googleMapsUri: p.googleMapsUri,
  }));
}

// Convenience: find interview-relevant places
export async function findInterviewLocations(lat: number, lng: number): Promise<{
  communitySpaces: NearbyPlace[];
  religiousSpaces: NearbyPlace[];
  markets: NearbyPlace[];
  cafes: NearbyPlace[];
  parks: NearbyPlace[];
}> {
  const [communitySpaces, religiousSpaces, markets, cafes, parks] = await Promise.all([
    findNearbyPlaces(lat, lng, ["community_center", "library", "civic_center"], 1500, 5),
    findNearbyPlaces(lat, lng, ["mosque", "church", "hindu_temple", "synagogue"], 1500, 5),
    findNearbyPlaces(lat, lng, ["market", "supermarket", "shopping_mall"], 1000, 5),
    findNearbyPlaces(lat, lng, ["cafe", "restaurant"], 800, 5),
    findNearbyPlaces(lat, lng, ["park", "playground"], 1000, 5),
  ]);
  return { communitySpaces, religiousSpaces, markets, cafes, parks };
}

// ---------------------------------------------------------------------------
// Air Quality — live AQI for any location
// ---------------------------------------------------------------------------

export interface AirQualityData {
  aqi: number;
  category: string;
  dominantPollutant: string;
  color: { r: number; g: number; b: number };
  healthRecommendation?: string;
  source: string;
  sourceUrl: string;
}

export async function getAirQuality(lat: number, lng: number): Promise<AirQualityData | null> {
  const url = `https://airquality.googleapis.com/v1/currentConditions:lookup?key=${API_KEY}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      location: { latitude: lat, longitude: lng },
      extraComputations: ["HEALTH_RECOMMENDATIONS"],
      languageCode: "en",
    }),
  });

  if (!res.ok) return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = await res.json() as any;
  const idx = data.indexes?.[0];
  if (!idx) return null;

  return {
    aqi: idx.aqi,
    category: idx.category,
    dominantPollutant: idx.dominantPollutant,
    color: idx.color || { r: 0, g: 0, b: 0 },
    healthRecommendation: data.healthRecommendations?.generalPopulation,
    source: "Google Air Quality API",
    sourceUrl: "https://developers.google.com/maps/documentation/air-quality",
  };
}

// ---------------------------------------------------------------------------
// Street View — static image URL for any location
// ---------------------------------------------------------------------------

export function getStreetViewUrl(lat: number, lng: number, width: number = 600, height: number = 300): string {
  return `https://maps.googleapis.com/maps/api/streetview?size=${width}x${height}&location=${lat},${lng}&key=${API_KEY}`;
}

// ---------------------------------------------------------------------------
// Civic Information (US) — representatives
// ---------------------------------------------------------------------------

export async function getUSCivicReps(address: string): Promise<Array<{
  name: string;
  party: string;
  office: string;
  level: string;
  photoUrl: string | null;
  urls: string[];
}>> {
  const url = `https://www.googleapis.com/civicinfo/v2/representatives?address=${encodeURIComponent(address)}&key=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) return [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = await res.json() as any;

  const results: Array<{ name: string; party: string; office: string; level: string; photoUrl: string | null; urls: string[] }> = [];
  for (const office of data.offices || []) {
    for (const idx of office.officialIndices || []) {
      const official = data.officials?.[idx];
      if (!official) continue;
      results.push({
        name: official.name,
        party: official.party || "Unknown",
        office: office.name,
        level: office.levels?.[0] || "unknown",
        photoUrl: official.photoUrl || null,
        urls: official.urls || [],
      });
    }
  }
  return results;
}
