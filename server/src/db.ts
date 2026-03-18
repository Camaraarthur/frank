// ============================================================================
// Frank — SQLite database
// Persistent storage for sessions, comments, area research cache, and users
// ============================================================================

import Database from "better-sqlite3";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, "..", "data");
const DB_PATH = path.join(DATA_DIR, "frank.db");

let db: Database.Database;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
    initSchema();
  }
  return db;
}

function initSchema() {
  const d = getDb();

  // Sessions (interviews)
  d.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      area TEXT NOT NULL,
      area_slug TEXT NOT NULL,
      created_at INTEGER NOT NULL DEFAULT (unixepoch()),
      duration_seconds INTEGER DEFAULT 0,
      gps_lat REAL,
      gps_lng REAL,
      participant_age TEXT,
      participant_gender TEXT,
      consent_record INTEGER DEFAULT 0,
      consent_quotes INTEGER DEFAULT 0,
      consent_retain INTEGER DEFAULT 0,
      transcript TEXT DEFAULT '[]',
      audio_path TEXT,
      published INTEGER DEFAULT 0,
      user_id TEXT
    )
  `);

  // Comments (public, anonymous or logged in)
  d.exec(`
    CREATE TABLE IF NOT EXISTS comments (
      id TEXT PRIMARY KEY,
      area_slug TEXT NOT NULL,
      created_at INTEGER NOT NULL DEFAULT (unixepoch()),
      content TEXT NOT NULL,
      gps_lat REAL,
      gps_lng REAL,
      gps_verified INTEGER DEFAULT 0,
      user_id TEXT,
      turnstile_verified INTEGER DEFAULT 0,
      upvotes INTEGER DEFAULT 0,
      issue_id TEXT,
      parent_id TEXT,
      FOREIGN KEY (parent_id) REFERENCES comments(id)
    )
  `);

  // Area research cache
  d.exec(`
    CREATE TABLE IF NOT EXISTS area_cache (
      slug TEXT PRIMARY KEY,
      area_name TEXT NOT NULL,
      country TEXT,
      lat REAL,
      lng REAL,
      research_data TEXT,
      civic_data TEXT,
      last_updated INTEGER NOT NULL DEFAULT (unixepoch()),
      ttl_seconds INTEGER DEFAULT 86400
    )
  `);

  // Users (optional login)
  d.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE,
      name TEXT,
      created_at INTEGER NOT NULL DEFAULT (unixepoch()),
      last_login INTEGER,
      magic_token TEXT,
      magic_token_expires INTEGER
    )
  `);

  // Upvotes on issues/proposals
  d.exec(`
    CREATE TABLE IF NOT EXISTS reactions (
      id TEXT PRIMARY KEY,
      area_slug TEXT NOT NULL,
      target_type TEXT NOT NULL,
      target_id TEXT NOT NULL,
      reaction TEXT NOT NULL DEFAULT 'upvote',
      created_at INTEGER NOT NULL DEFAULT (unixepoch()),
      user_id TEXT,
      ip_hash TEXT
    )
  `);

  // Create indexes
  d.exec(`
    CREATE INDEX IF NOT EXISTS idx_sessions_area ON sessions(area_slug);
    CREATE INDEX IF NOT EXISTS idx_comments_area ON comments(area_slug);
    CREATE INDEX IF NOT EXISTS idx_comments_issue ON comments(issue_id);
    CREATE INDEX IF NOT EXISTS idx_reactions_target ON reactions(area_slug, target_type, target_id);
    CREATE INDEX IF NOT EXISTS idx_area_cache_slug ON area_cache(slug);
  `);

  console.log("[DB] SQLite schema initialized at", DB_PATH);
}

// === Session helpers ===

export function saveSession(session: {
  id: string;
  area: string;
  areaSlug: string;
  durationSeconds?: number;
  gpsLat?: number;
  gpsLng?: number;
  participantAge?: string;
  participantGender?: string;
  consentRecord?: boolean;
  consentQuotes?: boolean;
  consentRetain?: boolean;
  transcript?: string;
  audioPath?: string;
  published?: boolean;
  userId?: string;
}) {
  const d = getDb();
  const stmt = d.prepare(`
    INSERT OR REPLACE INTO sessions (id, area, area_slug, duration_seconds, gps_lat, gps_lng,
      participant_age, participant_gender, consent_record, consent_quotes, consent_retain,
      transcript, audio_path, published, user_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(
    session.id, session.area, session.areaSlug,
    session.durationSeconds || 0, session.gpsLat || null, session.gpsLng || null,
    session.participantAge || null, session.participantGender || null,
    session.consentRecord ? 1 : 0, session.consentQuotes ? 1 : 0, session.consentRetain ? 1 : 0,
    session.transcript || "[]", session.audioPath || null,
    session.published ? 1 : 0, session.userId || null,
  );
}

export function getSessionsByArea(areaSlug: string) {
  const d = getDb();
  return d.prepare("SELECT * FROM sessions WHERE area_slug = ? ORDER BY created_at DESC").all(areaSlug);
}

// === Comment helpers ===

export function addComment(comment: {
  id: string;
  areaSlug: string;
  content: string;
  gpsLat?: number;
  gpsLng?: number;
  gpsVerified?: boolean;
  userId?: string;
  turnstileVerified?: boolean;
  issueId?: string;
  parentId?: string;
}) {
  const d = getDb();
  const stmt = d.prepare(`
    INSERT INTO comments (id, area_slug, content, gps_lat, gps_lng, gps_verified,
      user_id, turnstile_verified, issue_id, parent_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(
    comment.id, comment.areaSlug, comment.content,
    comment.gpsLat || null, comment.gpsLng || null, comment.gpsVerified ? 1 : 0,
    comment.userId || null, comment.turnstileVerified ? 1 : 0,
    comment.issueId || null, comment.parentId || null,
  );
}

export function getCommentsByArea(areaSlug: string) {
  const d = getDb();
  return d.prepare("SELECT * FROM comments WHERE area_slug = ? ORDER BY created_at DESC").all(areaSlug);
}

export function getCommentsByIssue(areaSlug: string, issueId: string) {
  const d = getDb();
  return d.prepare("SELECT * FROM comments WHERE area_slug = ? AND issue_id = ? ORDER BY created_at DESC").all(areaSlug, issueId);
}

// === Cache helpers ===

export function getCachedResearch(slug: string) {
  const d = getDb();
  const row = d.prepare("SELECT * FROM area_cache WHERE slug = ?").get(slug) as Record<string, unknown> | undefined;
  if (!row) return null;
  const lastUpdated = row.last_updated as number;
  const ttl = row.ttl_seconds as number;
  const now = Math.floor(Date.now() / 1000);
  if (now - lastUpdated > ttl) return null; // expired
  return {
    areaName: row.area_name as string,
    country: row.country as string,
    lat: row.lat as number,
    lng: row.lng as number,
    researchData: row.research_data ? JSON.parse(row.research_data as string) : null,
    civicData: row.civic_data ? JSON.parse(row.civic_data as string) : null,
  };
}

export function setCachedResearch(slug: string, data: {
  areaName: string;
  country?: string;
  lat?: number;
  lng?: number;
  researchData?: unknown;
  civicData?: unknown;
  ttlSeconds?: number;
}) {
  const d = getDb();
  const stmt = d.prepare(`
    INSERT OR REPLACE INTO area_cache (slug, area_name, country, lat, lng, research_data, civic_data, last_updated, ttl_seconds)
    VALUES (?, ?, ?, ?, ?, ?, ?, unixepoch(), ?)
  `);
  stmt.run(
    slug, data.areaName, data.country || null, data.lat || null, data.lng || null,
    data.researchData ? JSON.stringify(data.researchData) : null,
    data.civicData ? JSON.stringify(data.civicData) : null,
    data.ttlSeconds || 86400,
  );
}

// === Reaction helpers ===

export function addReaction(areaSlug: string, targetType: string, targetId: string, ipHash?: string, userId?: string) {
  const d = getDb();
  const id = `${areaSlug}-${targetType}-${targetId}-${ipHash || userId || Date.now()}`;
  // Check if already reacted
  const existing = d.prepare("SELECT id FROM reactions WHERE id = ?").get(id);
  if (existing) return false;
  d.prepare("INSERT INTO reactions (id, area_slug, target_type, target_id, user_id, ip_hash) VALUES (?, ?, ?, ?, ?, ?)").run(
    id, areaSlug, targetType, targetId, userId || null, ipHash || null,
  );
  return true;
}

export function getReactionCount(areaSlug: string, targetType: string, targetId: string): number {
  const d = getDb();
  const row = d.prepare("SELECT COUNT(*) as count FROM reactions WHERE area_slug = ? AND target_type = ? AND target_id = ?").get(areaSlug, targetType, targetId) as { count: number };
  return row.count;
}
