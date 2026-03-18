// ============================================================================
// Frank — Deep Research API (iterative loop)
// POST /api/deep-research — run iterative research loop with SSE progress
// GET  /api/deep-research/:slug — get cached research result
// ============================================================================

import { Router } from "express";
import { deepResearch, synthesizeBriefing } from "../research-loop.js";
import { getCachedResearch, setCachedResearch } from "../db.js";

const router = Router();

// POST /api/deep-research — run research with streaming progress
router.post("/", async (req, res) => {
  const { area } = req.body as { area: string };
  if (!area) return res.status(400).json({ error: "area required" });

  const slug = area.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");

  // Check cache first
  const cached = getCachedResearch(slug);
  if (cached?.researchData) {
    return res.json({ cached: true, ...cached.researchData, slug });
  }

  // Set up SSE for progress updates
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    // Run the research loop with progress callbacks
    const research = await deepResearch(area, (step) => {
      res.write(`data: ${JSON.stringify({ type: "progress", step })}\n\n`);
    });

    res.write(`data: ${JSON.stringify({ type: "progress", step: "Synthesizing findings..." })}\n\n`);

    // Synthesize into structured briefing
    const briefingText = await synthesizeBriefing(area, research);

    let briefing;
    try {
      let jsonText = briefingText.trim();
      const jsonMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (jsonMatch) jsonText = jsonMatch[1];
      briefing = JSON.parse(jsonText);
    } catch {
      briefing = { area, summary: research.findings, governingBodies: [], contestedIssues: [], demographics: { highlights: [] }, suggestedLocations: [], interviewThemes: [] };
    }

    // Cache the result
    setCachedResearch(slug, {
      areaName: area,
      researchData: briefing,
      ttlSeconds: 86400, // 24 hours
    });

    res.write(`data: ${JSON.stringify({ type: "complete", briefing, slug, iterations: research.iterations, searchCount: research.searches.length })}\n\n`);
    res.end();
  } catch (err) {
    res.write(`data: ${JSON.stringify({ type: "error", message: err instanceof Error ? err.message : "Research failed" })}\n\n`);
    res.end();
  }
});

// GET /api/deep-research/:slug — get cached result
router.get("/:slug", (req, res) => {
  const cached = getCachedResearch(req.params.slug);
  if (!cached) return res.status(404).json({ error: "No cached research for this area" });
  res.json(cached);
});

export default router;
