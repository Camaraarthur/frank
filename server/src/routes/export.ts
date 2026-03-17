// ============================================================================
// Frank — Export route
// POST /api/export/pdf — generate a print-ready HTML report
// ============================================================================

import { Router } from "express";

const router = Router();

// POST /api/export/pdf
// Body: { area, briefing, analysis, proposals }
// Returns: HTML document styled as an LGA officer report
router.post("/pdf", (req, res) => {
  const { area, briefing, analysis, proposals } = req.body;

  if (!area) {
    res.status(400).json({ error: "area is required" });
    return;
  }

  const html = generateReportHTML(area, briefing, analysis, proposals);

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="beat-report-${String(area).replace(/\s+/g, "-").toLowerCase()}.html"`
  );
  res.send(html);
});

function esc(str: unknown): string {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function generateReportHTML(
  area: string,
  briefing: Record<string, unknown> | undefined,
  analysis: Record<string, unknown> | undefined,
  proposals: Array<Record<string, unknown>> | undefined
): string {
  const today = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const issues: any[] = (analysis as any)?.issues ?? [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const voices: any[] = (analysis as any)?.voices ?? [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const summary: string = (analysis as any)?.summary ?? "";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const propList: any[] = proposals ?? [];

  const issuesHTML = issues
    .map(
      (issue, i) => `
      <div class="issue-card">
        <div class="issue-header">
          <span class="issue-rank">${i + 1}</span>
          <h3 class="issue-title">${esc(issue.title)}</h3>
          <span class="issue-score">Severity ${esc(issue.score?.severity ?? issue.severity ?? "—")}/5 &middot; ${esc(issue.score?.frequency ?? issue.frequency ?? "—")} mentions</span>
        </div>
        ${issue.description ? `<p class="issue-desc">${esc(issue.description)}</p>` : ""}
        ${
          issue.quotes?.length
            ? `<div class="quotes">
                ${issue.quotes
                  .slice(0, 2)
                  .map(
                    (q: { text?: string; speaker?: string }) =>
                      `<blockquote>"${esc(q.text)}"${q.speaker ? `<cite>— ${esc(q.speaker)}</cite>` : ""}</blockquote>`
                  )
                  .join("")}
              </div>`
            : ""
        }
      </div>`
    )
    .join("");

  const proposalsHTML = propList
    .map(
      (p) => `
      <div class="proposal-card">
        <h3 class="proposal-title">${esc(p.title)}</h3>
        ${p.summary ? `<p><strong>Summary:</strong> ${esc(p.summary)}</p>` : ""}
        ${p.councilAction ? `<p><strong>Recommended action:</strong> ${esc(p.councilAction)}</p>` : ""}
        ${p.responsibleDepartment ? `<p><strong>Lead department:</strong> ${esc(p.responsibleDepartment)}</p>` : ""}
        ${p.estimatedCost ? `<p><strong>Estimated cost:</strong> ${esc(p.estimatedCost)}</p>` : ""}
        ${p.timeline ? `<p><strong>Timeline:</strong> ${esc(p.timeline)}</p>` : ""}
        ${
          p.issuesAddressed?.length
            ? `<p><strong>Issues addressed:</strong> ${p.issuesAddressed.map((x: { title?: string }) => esc(x.title)).join(", ")}</p>`
            : ""
        }
      </div>`
    )
    .join("");

  const voicesHTML = voices
    .slice(0, 6)
    .map(
      (v) => `
      <div class="voice-entry">
        <span class="voice-name">${esc(v.name ?? "Anonymous")}</span>
        ${v.quote ? `<blockquote>"${esc(v.quote)}"</blockquote>` : ""}
      </div>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Beat Report — ${esc(area)} — ${esc(today)}</title>
  <style>
    /* ── Screen styles ── */
    :root {
      --navy: #0D1B2A;
      --amber: #D4840A;
      --amber-light: #FFC857;
      --slate: #6B7F8E;
      --paper: #F7F5F0;
      --ink: #1A1A1A;
    }

    *, *::before, *::after { box-sizing: border-box; }

    body {
      font-family: "Georgia", serif;
      font-size: 15px;
      line-height: 1.65;
      color: var(--ink);
      background: var(--paper);
      margin: 0;
      padding: 0;
    }

    .page {
      max-width: 820px;
      margin: 0 auto;
      padding: 48px 40px;
    }

    /* ── Cover ── */
    .cover {
      border-bottom: 3px solid var(--navy);
      padding-bottom: 32px;
      margin-bottom: 40px;
    }

    .cover-wordmark {
      font-size: 11px;
      font-family: "Arial", sans-serif;
      font-weight: 700;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--amber);
      margin-bottom: 24px;
    }

    .cover-title {
      font-size: 32px;
      font-weight: 700;
      color: var(--navy);
      margin: 0 0 8px;
      line-height: 1.2;
    }

    .cover-meta {
      font-size: 13px;
      color: var(--slate);
    }

    .cover-rule {
      margin-top: 24px;
      border: none;
      border-top: 1px solid #C8BFB0;
    }

    /* ── Section headings ── */
    h2 {
      font-size: 13px;
      font-family: "Arial", sans-serif;
      font-weight: 700;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--slate);
      margin: 40px 0 16px;
      padding-bottom: 6px;
      border-bottom: 1px solid #C8BFB0;
    }

    /* ── Executive summary ── */
    .summary-box {
      background: #EDE9E0;
      border-left: 4px solid var(--amber);
      padding: 16px 20px;
      margin: 0 0 32px;
    }

    .summary-box p { margin: 0; }

    /* ── Issues ── */
    .issue-card {
      margin-bottom: 28px;
      padding-bottom: 28px;
      border-bottom: 1px solid #C8BFB0;
    }

    .issue-header {
      display: flex;
      align-items: baseline;
      gap: 12px;
      margin-bottom: 6px;
    }

    .issue-rank {
      font-size: 11px;
      font-weight: 700;
      font-family: "Arial", sans-serif;
      color: var(--amber);
      min-width: 20px;
    }

    .issue-title {
      font-size: 17px;
      font-weight: 700;
      color: var(--navy);
      margin: 0;
      flex: 1;
    }

    .issue-score {
      font-size: 11px;
      font-family: "Arial", sans-serif;
      color: var(--slate);
      white-space: nowrap;
    }

    .issue-desc {
      color: #333;
      margin: 4px 0 10px;
    }

    .quotes { margin-top: 10px; }

    blockquote {
      margin: 8px 0;
      padding: 10px 14px;
      background: #EDE9E0;
      border-left: 2px solid #C8BFB0;
      font-style: italic;
      font-size: 13.5px;
      color: #444;
    }

    blockquote cite {
      display: block;
      font-size: 11px;
      font-style: normal;
      color: var(--slate);
      margin-top: 4px;
    }

    /* ── Proposals ── */
    .proposal-card {
      margin-bottom: 28px;
      padding: 20px 24px;
      background: white;
      border: 1px solid #C8BFB0;
    }

    .proposal-title {
      font-size: 17px;
      font-weight: 700;
      color: var(--navy);
      margin: 0 0 12px;
    }

    .proposal-card p {
      margin: 6px 0;
      font-size: 14px;
    }

    /* ── Voices ── */
    .voice-entry {
      margin-bottom: 16px;
    }

    .voice-name {
      font-size: 11px;
      font-weight: 700;
      font-family: "Arial", sans-serif;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--slate);
    }

    /* ── Footer ── */
    .report-footer {
      margin-top: 60px;
      padding-top: 16px;
      border-top: 1px solid #C8BFB0;
      font-size: 11px;
      font-family: "Arial", sans-serif;
      color: var(--slate);
      text-align: center;
    }

    /* ── Print styles ── */
    @media print {
      body {
        background: white;
        font-size: 11pt;
      }

      .page {
        padding: 0;
        max-width: 100%;
      }

      h2 { break-after: avoid; }

      .issue-card,
      .proposal-card {
        break-inside: avoid;
      }

      .cover {
        break-after: page;
      }

      blockquote {
        background: #f5f5f5;
        border-left-color: #999;
      }

      .summary-box {
        background: #f5f5f5;
        border-left-color: #333;
      }
    }
  </style>
</head>
<body>
  <div class="page">

    <!-- Cover -->
    <div class="cover">
      <div class="cover-wordmark">&#9646; Frank — Civic Field Intelligence</div>
      <h1 class="cover-title">Field Intelligence Report<br/>${esc(area)}</h1>
      <p class="cover-meta">Generated ${esc(today)} &middot; RESTRICTED — OFFICER USE</p>
      <hr class="cover-rule" />
    </div>

    <!-- Executive Summary -->
    <h2>Executive Summary</h2>
    ${
      summary
        ? `<div class="summary-box"><p>${esc(summary)}</p></div>`
        : briefing
        ? `<div class="summary-box"><p>${esc((briefing as Record<string, unknown>).overview ?? "")}</p></div>`
        : ""
    }
    ${issues.length ? `<p>${esc(issues.length)} issues identified across ${esc(voices.length)} recorded conversations.</p>` : ""}

    <!-- Issues -->
    ${
      issues.length
        ? `<h2>Evidence Base — Issues Ranked by Severity</h2>
           ${issuesHTML}`
        : ""
    }

    <!-- Proposals -->
    ${
      propList.length
        ? `<h2>Policy Proposals</h2>
           ${proposalsHTML}`
        : ""
    }

    <!-- Voices -->
    ${
      voices.length
        ? `<h2>Community Voices</h2>
           ${voicesHTML}`
        : ""
    }

    <!-- Footer -->
    <div class="report-footer">
      Beat Civic Field Intelligence &middot; ${esc(area)} &middot; ${esc(today)}<br/>
      This document is generated from field interviews and AI-assisted analysis.
      Verify findings before use in formal proceedings.
    </div>

  </div>
</body>
</html>`;
}

export default router;
