// ============================================================================
// Frank — Sessions routes
// POST /api/sessions                — create session
// GET  /api/sessions                — list sessions
// GET  /api/sessions/:id            — get session
// POST /api/sessions/:id/transcript — add transcript entry
// ============================================================================

import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import { saveSession, getSession, listSessions, updateSessionTranscript } from "../store.js";
import type { Session } from "../store.js";

const router = Router();

// POST /api/sessions
router.post("/", async (req, res) => {
  const body = req.body as Partial<Session>;

  const session: Session = {
    id: uuidv4(),
    createdAt: Date.now(),
    area: body.area || "unknown",
    participant: body.participant || {},
    transcript: body.transcript || [],
    gpsLat: body.gpsLat ?? 0,
    gpsLng: body.gpsLng ?? 0,
    consentGiven: body.consentGiven ?? false,
    durationSeconds: body.durationSeconds ?? 0,
    audioPath: body.audioPath,
  };

  await saveSession(session);
  res.status(201).json(session);
});

// GET /api/sessions
router.get("/", async (req, res) => {
  const area = req.query.area as string | undefined;
  const sessions = await listSessions(area);
  res.json({ sessions, count: sessions.length });
});

// GET /api/sessions/:id
router.get("/:id", async (req, res) => {
  const session = await getSession(req.params.id);
  if (!session) return res.status(404).json({ error: "Session not found" });
  res.json(session);
});

// POST /api/sessions/:id/transcript
router.post("/:id/transcript", async (req, res) => {
  const { timestamp, offsetMs, text } = req.body as {
    timestamp?: number;
    offsetMs?: number;
    text: string;
  };

  if (!text) return res.status(400).json({ error: "text is required" });

  const updated = await updateSessionTranscript(req.params.id, {
    timestamp: timestamp ?? Date.now(),
    offsetMs: offsetMs ?? 0,
    text,
  });

  if (!updated) return res.status(404).json({ error: "Session not found" });
  res.json(updated);
});

// PATCH /api/sessions/:id — update session fields
router.patch("/:id", async (req, res) => {
  const session = await getSession(req.params.id);
  if (!session) return res.status(404).json({ error: "Session not found" });

  const updates = req.body as Partial<Session>;
  const updated: Session = { ...session, ...updates, id: session.id, createdAt: session.createdAt };
  await saveSession(updated);
  res.json(updated);
});

export default router;
