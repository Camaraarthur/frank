// ============================================================================
// Frank — Area Data routes (structured civic data from official APIs)
// GET /api/area-data?lat={lat}&lng={lng}
// GET /api/area-data?postcode={postcode}
//
// Every data point includes source and sourceUrl for citation.
// ============================================================================

import { Router } from "express";
import { getAllCivicData } from "../civic-data.js";
import { getAllWorldwideData } from "../worldwide-civic.js";

const router = Router();

// GET /api/area-data
router.get("/", async (req, res) => {
  const { lat, lng, postcode } = req.query as {
    lat?: string;
    lng?: string;
    postcode?: string;
  };

  // Validate inputs
  if (!postcode && (!lat || !lng)) {
    return res.status(400).json({
      error: "Either 'postcode' or both 'lat' and 'lng' query parameters are required",
      examples: [
        "/api/area-data?postcode=E6+5XT",
        "/api/area-data?lat=51.5160&lng=0.0594",
      ],
    });
  }

  const parsedLat = lat ? parseFloat(lat) : undefined;
  const parsedLng = lng ? parseFloat(lng) : undefined;

  if (lat && (isNaN(parsedLat!) || parsedLat! < -90 || parsedLat! > 90)) {
    return res.status(400).json({ error: "Invalid latitude — must be between -90 and 90" });
  }
  if (lng && (isNaN(parsedLng!) || parsedLng! < -180 || parsedLng! > 180)) {
    return res.status(400).json({ error: "Invalid longitude — must be between -180 and 180" });
  }

  try {
    console.log(
      `[AreaData] Request: ${postcode ? `postcode=${postcode}` : `lat=${parsedLat}, lng=${parsedLng}`}`
    );

    const data = await getAllCivicData({
      lat: parsedLat,
      lng: parsedLng,
      postcode: postcode ?? undefined,
    });

    // Summary stats for logging
    const stats = {
      geography: data.geography ? "yes" : "no",
      representatives: data.representatives.length,
      censusTopics: data.census.length,
      deprivation: data.deprivation?.imdDecile?.value != null ? "yes" : "pending",
      errors: data.errors.length,
    };
    console.log(`[AreaData] Response:`, stats);

    res.json(data);
  } catch (err) {
    console.error("[AreaData] Error:", err);
    res.status(500).json({
      error: err instanceof Error ? err.message : "Failed to fetch area data",
    });
  }
});

// GET /api/area-data/worldwide — worldwide civic data for any lat/lng on Earth
router.get("/worldwide", async (req, res) => {
  const { lat, lng } = req.query as { lat?: string; lng?: string };

  if (!lat || !lng) {
    return res.status(400).json({
      error: "Both 'lat' and 'lng' query parameters are required",
      examples: [
        "/api/area-data/worldwide?lat=51.516&lng=0.060",
        "/api/area-data/worldwide?lat=37.7749&lng=-122.4194",
        "/api/area-data/worldwide?lat=52.5200&lng=13.4050",
      ],
    });
  }

  const parsedLat = parseFloat(lat);
  const parsedLng = parseFloat(lng);

  if (isNaN(parsedLat) || parsedLat < -90 || parsedLat > 90) {
    return res.status(400).json({ error: "Invalid latitude — must be between -90 and 90" });
  }
  if (isNaN(parsedLng) || parsedLng < -180 || parsedLng > 180) {
    return res.status(400).json({ error: "Invalid longitude — must be between -180 and 180" });
  }

  try {
    console.log(`[AreaData] Worldwide request: lat=${parsedLat}, lng=${parsedLng}`);

    const data = await getAllWorldwideData(parsedLat, parsedLng);

    const stats = {
      country: data.country?.code || "unknown",
      representatives: data.representatives.length,
      demographics: data.demographics.length,
      hasNativeCivicData: !!data.nativeCivicData,
      hasPlaces: !!data.places,
      hasAirQuality: !!data.airQuality,
      errors: data.errors.length,
      dataSources: data.dataSources.length,
    };
    console.log(`[AreaData] Worldwide response:`, stats);

    res.json(data);
  } catch (err) {
    console.error("[AreaData] Worldwide error:", err);
    res.status(500).json({
      error: err instanceof Error ? err.message : "Failed to fetch worldwide area data",
    });
  }
});

export default router;
