// ============================================================================
// Frank — Document routes
// POST /api/document/generate         — generate Mom Test interview guide
// POST /api/document/process-comments — AI rewrite incorporating comments
// ============================================================================

import { Router } from "express";
import { generateText } from "../gemini.js";

const router = Router();

// POST /api/document/generate
router.post("/generate", async (req, res) => {
  const { area, briefing, questions } = req.body as {
    area: string;
    briefing?: Record<string, unknown>;
    questions?: Record<string, string[]>;
  };

  if (!area) {
    return res.status(400).json({ error: "area is required" });
  }

  const briefingSummary = briefing
    ? `\n\nArea context: ${JSON.stringify(briefing, null, 2)}`
    : "";

  const questionsSummary = questions
    ? `\n\nSuggested questions to include: ${JSON.stringify(questions, null, 2)}`
    : "";

  const prompt = `Write a practical field interview guide for someone using Frank (frank.community) to investigate "${area}".

Frank is a civic listening app. The interviewer opens frank.community on their phone, goes to the Record page, turns on GPS, and records conversations with residents. The app transcribes on-device, anonymises data, and synthesises everything into ranked civic issues and policy proposals.

IMPORTANT CONTEXT FOR THE GUIDE:
- The interviewer uses the Frank app on their phone. They do NOT need a separate recorder or notebook.
- On the Record page, they tap the mic button to start recording. Live transcription appears on screen.
- GPS is optional but recommended — it helps map where conversations happened (randomised to ~100m for privacy).
- The app handles consent with three toggles: record, use quotes, retain data. Walk the participant through these.
- Demographics (age range, gender) should ideally come up naturally in conversation ("do you mind if I ask roughly how old you are?"). The app can also pick these up from the audio. Manual input is a fallback.
- After recording, the app synthesises all interviews into issues, scores, and policy proposals at frank.community/${area.toLowerCase().replace(/\s+/g, "-")}.

${briefingSummary}${questionsSummary}

The guide should cover:
1. What Frank does and why you're here (2-3 sentences — you're listening, not surveying)
2. Before you go out: open Frank, check your area page, read the known issues, understand who governs
3. How to approach people: don't lead with questions, lead with curiosity. Ask about burdens, not opinions. The Mom Test principle: ask about their life, not your idea.
4. Starting a conversation: "Hi, I'm [name]. I'm trying to understand what life is like here — what's good, what's hard. Do you have a couple of minutes? I'd like to record so your voice can be part of a public report on this area."
5. Key question angles specific to ${area} (based on known issues if available)
6. What to listen for: stories > opinions, specifics > generalities, "I" statements > "they should" statements
7. Handling difficult moments: someone gets emotional, someone is hostile, someone wants to rant about politics
8. Wrapping up: thank them, tell them they can find the results at frank.community, invite them to add their own voice
9. After the session: review on Frank, add any notes, check the issues tab

Keep it conversational. 600-900 words. Markdown format. No jargon. This person might be a student, a volunteer, or a councillor — write for all of them.`;

  try {
    const document = await generateText(prompt);
    res.json({ document, area });
  } catch (err) {
    console.error("[Document/Generate] Error:", err);
    res.status(500).json({ error: err instanceof Error ? err.message : "Failed to generate document" });
  }
});

// POST /api/document/process-comments
router.post("/process-comments", async (req, res) => {
  const { document, comments } = req.body as {
    document: string;
    comments: Array<{
      id: string;
      anchor: string;
      text: string;
      paragraphIndex: number;
    }>;
  };

  if (!document) return res.status(400).json({ error: "document is required" });
  if (!comments?.length) return res.status(400).json({ error: "comments array is required" });

  const commentsText = comments
    .map(
      (c) =>
        `[Paragraph ${c.paragraphIndex}] Comment on "${c.anchor.slice(0, 80)}...": ${c.text}`
    )
    .join("\n");

  const prompt = `You are editing a field interview guide. Below is the original document, followed by researcher comments. Rewrite the document incorporating ALL the comments. Keep the overall structure and length similar. Improve the specific sections the comments address.

ORIGINAL DOCUMENT:
${document}

COMMENTS TO INCORPORATE:
${commentsText}

Return JSON (no markdown wrapping):
{
  "revisedDocument": "the full rewritten document in markdown",
  "changes": [
    {
      "paragraphIndex": 0,
      "summary": "brief description of what changed"
    }
  ]
}`;

  try {
    const text = await generateText(prompt);
    let jsonText = text.trim();
    const jsonMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch) jsonText = jsonMatch[1];
    const result = JSON.parse(jsonText);
    res.json(result);
  } catch (err) {
    console.error("[Document/ProcessComments] Error:", err);
    res.status(500).json({ error: err instanceof Error ? err.message : "Failed to process comments" });
  }
});

export default router;
