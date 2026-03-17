// ============================================================================
// Frank — Chat route (onboarding chat, streaming)
// POST /api/chat
// ============================================================================

import { Router } from "express";
import { getModel } from "../gemini.js";

const router = Router();

// In-memory chat history per session (keyed by sessionId or "default")
const chatHistories = new Map<string, Array<{ role: "user" | "model"; parts: Array<{ text: string }> }>>();

const SYSTEM_PROMPT = `You are Frank, an AI assistant for civic field research. Your role is to help researchers — politicians, community organizers, NGOs, journalists — understand local areas and the people who live there.

You are warm, intelligent, and serious. You ask precise questions. You are not a consumer chatbot — you are a research tool.

Your onboarding flow:
1. Warmly greet the researcher and ask who they are and what brings them to Frank.
2. After they respond, ask what area they want to investigate. Accept any scale — neighbourhood, ward, borough, city, postcode.
3. Handle ambiguity carefully:
   - If the place name is shared by multiple well-known locations (e.g. "Shadwell" is both in London and Leeds; "Richmond" is in London, Yorkshire, and Virginia), ask "Which [name] do you mean — [option A] or [option B]?" Never ask for a postcode.
   - If the area is clear and unambiguous, you may briefly ask "Would you like me to research the whole of [area], or a more specific part?" — but only if it's genuinely useful. Don't over-ask.
4. Once the area is confirmed and unambiguous, output ONLY this JSON (nothing else, no text before or after):
   {"action": "research_ready", "area": "<specific confirmed area, e.g. Shadwell, London>", "entityType": "<role: politician/organizer/journalist/researcher/other>"}

Keep responses to 1-2 sentences. Do not over-explain. Never ask for postcodes.`;

router.post("/", async (req, res) => {
  const { message, sessionId = "default" } = req.body as {
    message: string;
    sessionId?: string;
  };

  if (!message) {
    return res.status(400).json({ error: "message is required" });
  }

  // Get or create history for this session
  if (!chatHistories.has(sessionId)) {
    chatHistories.set(sessionId, []);
  }
  const history = chatHistories.get(sessionId)!;

  try {
    const model = getModel();
    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
        { role: "model", parts: [{ text: "Understood. I am Frank, ready to assist with civic field research." }] },
        ...history,
      ],
    });

    // Set up SSE streaming
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const result = await chat.sendMessageStream(message);
    let fullText = "";

    for await (const chunk of result.stream) {
      const text = chunk.text();
      if (text) {
        fullText += text;
        res.write(`data: ${JSON.stringify({ text })}\n\n`);
      }
    }

    // Save to history
    history.push({ role: "user", parts: [{ text: message }] });
    history.push({ role: "model", parts: [{ text: fullText }] });

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (err) {
    console.error("[Chat] Error:", err);
    if (!res.headersSent) {
      res.status(500).json({ error: err instanceof Error ? err.message : "Chat failed" });
    } else {
      res.write(`data: ${JSON.stringify({ error: "Chat error" })}\n\n`);
      res.end();
    }
  }
});

// Clear history for a session
router.delete("/:sessionId", (req, res) => {
  chatHistories.delete(req.params.sessionId);
  res.json({ success: true });
});

export default router;
