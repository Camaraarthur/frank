// ============================================================================
// Frank — Policy route
// POST /api/policy — generate rich policy proposals from issues + Brave research
// ============================================================================

import { Router } from "express";
import { generateText, streamText } from "../gemini.js";
import { researchPolicy } from "../brave.js";
import type { Issue } from "./analyze.js";

const router = Router();

export interface PolicyProposal {
  id: string;
  title: string;
  issuesAddressed: Array<{ id: string; title: string }>;     // multiple issues can link to one proposal
  summary: string;
  councilAction: string;                                       // concrete action the governing body can take
  responsibleDepartment: string;                               // which dept within the council
  contactPath: string;                                         // who to contact / how to escalate
  residentQuotes: string[];
  publicSupport?: string;                                      // any data on public support for this approach
  drawbacks: Array<{ title: string; description: string }>;   // honest downsides
  estimatedCost: {
    range: string;                                             // e.g. "£50k–£200k"
    basis: string;                                             // how that estimate was derived
    category: "low" | "medium" | "high" | "transformative";
  };
  timeToImplement: {
    range: string;                                             // e.g. "6–18 months"
    phasing?: string;                                          // if multi-phase, explain phases
  };
  feasibility: "High" | "Medium" | "Low";
  feasibilityReason: string;
  alignedWithStatedPolicy: boolean;
  alignmentNote?: string;
  pathToImplementation: string[];                              // ordered steps
  isSystemicFix: boolean;                                      // does this address root cause or symptom?
  systemicNote?: string;                                       // if symptom-level, what root cause remains
  sources: string[];
}

// POST /api/policy
router.post("/", async (req, res) => {
  const { area, issues, briefing } = req.body as {
    area: string;
    issues: Issue[];
    briefing?: {
      governingBodies?: Array<{
        level: string;
        name: string;
        representative: string;
        party?: string;
        keyPolicies: string[];
      }>;
    };
  };

  if (!area) return res.status(400).json({ error: "area is required" });
  if (!issues?.length) return res.status(400).json({ error: "issues array is required" });

  const topIssues = issues.slice(0, 5);

  // Brave research for each top issue
  console.log(`[Policy] Researching ${topIssues.length} issues for ${area}`);
  const policyResearch = await Promise.all(
    topIssues.map((issue) => researchPolicy(area, issue.title))
  );

  const issueContexts = topIssues.map((issue, i) => ({
    issue,
    research: policyResearch[i],
  }));

  const governingContext = briefing?.governingBodies
    ? `Governing bodies for ${area}:\n${JSON.stringify(briefing.governingBodies, null, 2)}`
    : "";

  const prompt = `You are a senior civic policy analyst with deep knowledge of UK local government. Generate detailed, honest, actionable policy proposals for "${area}".

${governingContext}

Issues identified through field research (with web research context):
${issueContexts
  .map(
    (ctx, i) => `
--- Issue ${i + 1}: ${ctx.issue.title} ---
Severity: ${ctx.issue.score.severity}/5, Frequency: ${ctx.issue.score.frequency} conversations
Complexity: ${ctx.issue.score.complexity}/5, Systemic: ${ctx.issue.score.isSystemic}
${ctx.issue.score.systemicNote ? `Systemic note: ${ctx.issue.score.systemicNote}` : ""}
Description: ${ctx.issue.description}
Key quotes: ${ctx.issue.quotes
  .slice(0, 2)
  .map((q) => `"${q.text}"`)
  .join(", ")}

Web research findings:
${ctx.research.slice(0, 1500)}
`
  )
  .join("\n")}

Return ONLY a JSON object (no markdown):
{
  "proposals": [
    {
      "id": "proposal-1",
      "title": "Short action-oriented proposal title",
      "issuesAddressed": [{"id": "issue-1", "title": "Issue title"}],
      "summary": "2-3 sentence plain-English explanation of what this proposes and why",
      "councilAction": "Specific, concrete action the relevant governing body can take — reference actual statutory powers (Section 106, CPO, Article 4, HMO licensing, etc.) where relevant",
      "responsibleDepartment": "e.g. Planning & Regeneration, Housing, Highways & Transport, Parks & Open Spaces",
      "contactPath": "Who to contact to advance this — named role (e.g. Director of Housing, Ward Councillor → Housing Committee → Full Council) + the process",
      "residentQuotes": ["quote from research that supports this proposal"],
      "publicSupport": "Any evidence of public support: petitions, party manifestos, YouGov data, council consultation results — or null if none found",
      "drawbacks": [
        {
          "title": "Short drawback name",
          "description": "Honest explanation of this risk or downside"
        }
      ],
      "estimatedCost": {
        "range": "£X–£Y",
        "basis": "Based on comparable schemes in [similar authority / national average]",
        "category": "low|medium|high|transformative"
      },
      "timeToImplement": {
        "range": "X–Y months/years",
        "phasing": "Phase 1: X (months 1-6). Phase 2: Y (months 7-18). — or null if single phase"
      },
      "feasibility": "High|Medium|Low",
      "feasibilityReason": "Specific explanation — reference council's statutory powers, budget constraints, political context",
      "alignedWithStatedPolicy": true,
      "alignmentNote": "The council's Local Plan 2023 identifies this area as a priority for... — or null",
      "pathToImplementation": [
        "Step 1: Initial engagement with responsible department",
        "Step 2: ...",
        "Step 3: ..."
      ],
      "isSystemicFix": false,
      "systemicNote": "This addresses the symptom. Root cause requires national housing policy reform. Council can mitigate but not eliminate the underlying issue.",
      "sources": ["source from web research"]
    }
  ]
}

Critical requirements:
- Be HONEST about drawbacks — every policy has them, don't hide them
- Be HONEST about what is systemic vs. what the council can actually fix
- Cost estimates should be grounded in comparable real-world examples
- pathToImplementation should be genuinely actionable — specific people, processes, timelines
- If an issue is systemic and the council can only duck-tape it, say that clearly in systemicNote
- responsibleDepartment should be the ACTUAL UK local government department structure`;

  try {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    let fullText = "";
    await streamText(prompt, (chunk) => {
      fullText += chunk;
      res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
    });

    let jsonText = fullText.trim();
    const jsonMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch) jsonText = jsonMatch[1];

    try {
      const result = JSON.parse(jsonText);
      res.write(`data: ${JSON.stringify({ done: true, result })}\n\n`);
    } catch {
      res.write(`data: ${JSON.stringify({ done: true, raw: fullText })}\n\n`);
    }
    res.end();
  } catch (err) {
    console.error("[Policy] Error:", err);
    if (!res.headersSent) {
      res.status(500).json({ error: err instanceof Error ? err.message : "Policy generation failed" });
    } else {
      res.write(`data: ${JSON.stringify({ error: "Policy generation error" })}\n\n`);
      res.end();
    }
  }
});

export default router;
