// ============================================================================
// Frank — Gemini client setup
// Uses gemini-flash-latest
// ============================================================================

import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) throw new Error("GEMINI_API_KEY is required");

export const genAI = new GoogleGenerativeAI(apiKey);

// Standard model for chat/document tasks
export function getModel() {
  return genAI.getGenerativeModel({
    model: "gemini-flash-latest",
  });
}

// Model with Google Search grounding for area research
export function getSearchModel() {
  return genAI.getGenerativeModel({
    model: "gemini-flash-latest",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tools: [{ googleSearchRetrieval: {} } as any],
  });
}

// Stream helper: collects all chunks and calls onChunk for each text piece
export async function streamText(
  prompt: string,
  onChunk: (text: string) => void,
  useSearch = false
): Promise<string> {
  const model = useSearch ? getSearchModel() : getModel();
  const result = await model.generateContentStream(prompt);

  let fullText = "";
  for await (const chunk of result.stream) {
    const text = chunk.text();
    if (text) {
      fullText += text;
      onChunk(text);
    }
  }
  return fullText;
}

// Generate full text (non-streaming)
export async function generateText(prompt: string, useSearch = false): Promise<string> {
  const model = useSearch ? getSearchModel() : getModel();
  const result = await model.generateContent(prompt);
  return result.response.text();
}

// Chat session helper
export function createChatSession(history: Array<{ role: "user" | "model"; parts: Array<{ text: string }> }> = []) {
  const model = getModel();
  return model.startChat({ history });
}
