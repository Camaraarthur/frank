// ============================================================================
// Frank — Server Entry Point
// Express + TypeScript. Civic field intelligence platform.
// Port: 4740
// ============================================================================

import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs/promises";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

import chatRouter from "./routes/chat.js";
import researchRouter from "./routes/research.js";
import documentRouter from "./routes/document.js";
import sessionsRouter from "./routes/sessions.js";
import analyzeRouter from "./routes/analyze.js";
import policyRouter from "./routes/policy.js";
import exportRouter from "./routes/export.js";
import areaDataRouter from "./routes/area-data.js";
import googleDataRouter from "./routes/google-data.js";
import commentsRouter from "./routes/comments.js";
import { getDb } from "./db.js";

// ---------------------------------------------------------------------------
// App setup
// ---------------------------------------------------------------------------

const app = express();
const PORT = parseInt(process.env.PORT || "4740", 10);

app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "10mb" }));

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "beat-server",
    uptime: process.uptime(),
    port: PORT,
  });
});

app.use("/api/chat", chatRouter);
app.use("/api/research", researchRouter);
app.use("/api/document", documentRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/analyze", analyzeRouter);
app.use("/api/policy", policyRouter);
app.use("/api/export", exportRouter);
app.use("/api/area-data", areaDataRouter);
app.use("/api/google", googleDataRouter);
app.use("/api/comments", commentsRouter);

// GIS proxy — forward /api/gis/* to the GIS backend on port 4742
app.use("/api/gis", async (req, res) => {
  try {
    const gisUrl = `http://localhost:4742/api${req.url}`;
    const response = await fetch(gisUrl);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(502).json({ error: "GIS service unavailable" });
  }
});

// ---------------------------------------------------------------------------
// Startup
// ---------------------------------------------------------------------------

async function startup(): Promise<void> {
  // Ensure data directory exists
  const dataDir = process.env.DATA_DIR || path.join(__dirname, "..", "data");
  await fs.mkdir(path.join(dataDir, "sessions"), { recursive: true });

  // Initialize database
  getDb();

  console.log("=".repeat(50));
  console.log("  Frank — Civic Field Intelligence");
  console.log("=".repeat(50));
  console.log(`[Server] Gemini API key: ${process.env.GEMINI_API_KEY ? "configured" : "MISSING"}`);

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server] HTTP: http://0.0.0.0:${PORT}`);
    console.log(`[Server] Health: http://localhost:${PORT}/health`);
    console.log("=".repeat(50));
  });
}

process.on("uncaughtException", (err) => console.error("[Server] Uncaught:", err));
process.on("unhandledRejection", (reason) => console.error("[Server] Unhandled rejection:", reason));

startup().catch((err) => {
  console.error("[Server] Fatal:", err);
  process.exit(1);
});
