// ============================================================================
// Frank — Comments & Reactions API
// POST /api/comments          — add a comment to an area
// GET  /api/comments/:area    — get comments for an area
// POST /api/reactions          — upvote an issue or proposal
// GET  /api/reactions/:area   — get reaction counts for an area
// ============================================================================

import { Router } from "express";
import crypto from "node:crypto";
import { addComment, getCommentsByArea, getCommentsByIssue, addReaction, getReactionCount } from "../db.js";

const router = Router();

// Verify Cloudflare Turnstile token
async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET;
  if (!secret) return true; // Skip verification if no secret configured (dev mode)

  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${secret}&response=${token}&remoteip=${ip}`,
    });
    const data = await res.json() as { success: boolean };
    return data.success;
  } catch {
    return false;
  }
}

// POST /api/comments — add a comment
router.post("/", async (req, res) => {
  const { areaSlug, content, gpsLat, gpsLng, turnstileToken, issueId, parentId } = req.body as {
    areaSlug: string;
    content: string;
    gpsLat?: number;
    gpsLng?: number;
    turnstileToken?: string;
    issueId?: string;
    parentId?: string;
  };

  if (!areaSlug || !content) {
    return res.status(400).json({ error: "areaSlug and content are required" });
  }
  if (content.length > 2000) {
    return res.status(400).json({ error: "Comment too long (max 2000 characters)" });
  }

  // Verify Turnstile
  const ip = (req.headers["x-forwarded-for"] as string || req.socket.remoteAddress || "").split(",")[0].trim();
  const turnstileOk = turnstileToken ? await verifyTurnstile(turnstileToken, ip) : !process.env.TURNSTILE_SECRET;

  if (!turnstileOk) {
    return res.status(403).json({ error: "Human verification failed" });
  }

  const id = crypto.randomUUID();
  const gpsVerified = gpsLat != null && gpsLng != null;

  addComment({
    id,
    areaSlug,
    content,
    gpsLat,
    gpsLng,
    gpsVerified,
    turnstileVerified: !!turnstileToken,
    issueId,
    parentId,
  });

  res.json({ id, success: true });
});

// GET /api/comments/:area — get comments for an area
router.get("/:area", (req, res) => {
  const { area } = req.params;
  const { issueId } = req.query;

  const comments = issueId
    ? getCommentsByIssue(area, issueId as string)
    : getCommentsByArea(area);

  res.json({ comments, count: comments.length });
});

// POST /api/reactions — upvote (requires Turnstile)
router.post("/react", async (req, res) => {
  const { areaSlug, targetType, targetId, turnstileToken, fingerprint } = req.body as {
    areaSlug: string;
    targetType: string;
    targetId: string;
    turnstileToken?: string;
    fingerprint?: string;
  };

  if (!areaSlug || !targetType || !targetId) {
    return res.status(400).json({ error: "areaSlug, targetType, targetId required" });
  }

  // Turnstile required for reactions
  const ip = (req.headers["x-forwarded-for"] as string || req.socket.remoteAddress || "").split(",")[0].trim();
  const turnstileOk = turnstileToken ? await verifyTurnstile(turnstileToken, ip) : !process.env.TURNSTILE_SECRET;
  if (!turnstileOk) {
    return res.status(403).json({ error: "Human verification required to vote" });
  }

  // Dedup: combine IP hash + browser fingerprint for a more unique identifier
  // Not perfect but stops casual re-voting without requiring accounts
  const rawId = fingerprint ? `${ip}-${fingerprint}` : ip;
  const voterHash = crypto.createHash("sha256").update(rawId).digest("hex").slice(0, 20);

  const added = addReaction(areaSlug, targetType, targetId, voterHash);
  const count = getReactionCount(areaSlug, targetType, targetId);

  if (!added) {
    return res.json({ added: false, count, message: "Already voted" });
  }

  res.json({ added: true, count });
});

// GET /api/reactions/:area — get all reaction counts for an area
router.get("/react/:area", (req, res) => {
  const { area } = req.params;
  // This is a simple endpoint — in production you'd batch these
  res.json({ area, message: "Use POST /api/reactions to add, counts returned inline" });
});

export default router;
