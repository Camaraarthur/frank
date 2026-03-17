// ============================================================================
// Frank — Area Data routes (structured civic data from official APIs)
// GET /api/area-data?lat={lat}&lng={lng}
// GET /api/area-data?postcode={postcode}
//
// Every data point includes source and sourceUrl for citation.
// ============================================================================

import { Router } from "express";
import { getAllCivicData } from "../civic-data.js";

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

export default router;
