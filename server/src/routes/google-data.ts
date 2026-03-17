// ============================================================================
// Frank — Google APIs routes
// GET /api/google/places?lat=&lng=            — interview-relevant places
// GET /api/google/air-quality?lat=&lng=       — live AQI
// GET /api/google/streetview?lat=&lng=        — street view image URL
// GET /api/google/geocode?q=                  — resolve area name
// GET /api/google/civic?address=              — US representatives
// ============================================================================

import { Router } from "express";
import { findInterviewLocations, getAirQuality, getStreetViewUrl, geocode, getUSCivicReps } from "../google-apis.js";

const router = Router();

router.get("/places", async (req, res) => {
  const lat = parseFloat(req.query.lat as string);
  const lng = parseFloat(req.query.lng as string);
  if (isNaN(lat) || isNaN(lng)) return res.status(400).json({ error: "lat and lng required" });

  try {
    const places = await findInterviewLocations(lat, lng);
    res.json({ source: "Google Places API (New)", ...places });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

router.get("/air-quality", async (req, res) => {
  const lat = parseFloat(req.query.lat as string);
  const lng = parseFloat(req.query.lng as string);
  if (isNaN(lat) || isNaN(lng)) return res.status(400).json({ error: "lat and lng required" });

  try {
    const aq = await getAirQuality(lat, lng);
    res.json(aq || { error: "No data available" });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

router.get("/streetview", async (req, res) => {
  const lat = parseFloat(req.query.lat as string);
  const lng = parseFloat(req.query.lng as string);
  const w = parseInt(req.query.w as string) || 600;
  const h = parseInt(req.query.h as string) || 300;
  if (isNaN(lat) || isNaN(lng)) return res.status(400).json({ error: "lat and lng required" });

  res.json({ url: getStreetViewUrl(lat, lng, w, h), source: "Google Street View Static API" });
});

router.get("/geocode", async (req, res) => {
  const q = req.query.q as string;
  if (!q) return res.status(400).json({ error: "q (query) required" });

  try {
    const results = await geocode(q);
    res.json({ results, source: "Google Geocoding API" });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

router.get("/civic", async (req, res) => {
  const address = req.query.address as string;
  if (!address) return res.status(400).json({ error: "address required" });

  try {
    const reps = await getUSCivicReps(address);
    res.json({ representatives: reps, source: "Google Civic Information API" });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

export default router;
