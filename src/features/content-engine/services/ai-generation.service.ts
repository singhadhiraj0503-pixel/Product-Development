import OpenAI from "openai";
import { z } from "zod";
import type { GeneratedDeck } from "../types/content-engine.types";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const deckSchema = z.object({
  title: z.string(),
  topic: z.string(),
  rationale: z.string().optional(),
  slides: z.array(z.object({
    position: z.number().int().min(0),
    role: z.enum(["hook", "problem", "principle", "example", "summary", "cta", "custom"]),
    title: z.string().min(1).max(120),
    body: z.string().max(500).optional(),
    subtitle: z.string().max(220).optional(),
    kicker: z.string().max(80).optional(),
    visualPrompt: z.string().max(500).optional(),
    designTokens: z.record(z.string(), z.unknown()).optional(),
  })).min(3).max(12),
});

export async function transcribeAudio(audioUrl: string) {
  if (!process.env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is not configured.");
  const response = await fetch(audioUrl);
  if (!response.ok) throw new Error("Could not retrieve audio for transcription.");
  const blob = await response.blob();
  const file = new File([blob], "voice-memo.webm", { type: blob.type || "audio/webm" });
  const result = await openai.audio.transcriptions.create({
    file,
    model: process.env.OPENAI_TRANSCRIPTION_MODEL || "whisper-1",
  });
  return result.text;
}

export async function generateCarousel(input: { sourceText: string; title?: string; visualTheme?: string; platformTargets: string[]; slideCount?: number }): Promise<GeneratedDeck> {
  if (!process.env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is not configured.");
  const completion = await openai.chat.completions.create({
    model: process.env.OPENAI_TEXT_MODEL || "gpt-4.1-mini",
    temperature: 0.4,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: `You are ContentEngine AI, a precise editorial strategist. Turn the source into a useful social carousel. Return only JSON matching: {title,topic,rationale?,slides:[{position,role,title,body?,subtitle?,kicker?,visualPrompt?,designTokens?}]}. Create ${input.slideCount || 5} slides. First slide must be a strong hook; final slide a useful summary or CTA. Avoid fabricated statistics, citations, or claims. Preserve uncertainty. Each slide should be concise and self-contained. Use platform targets ${input.platformTargets.join(", ")} and visual theme ${input.visualTheme || "obsidian-minimal"}.` },
      { role: "user", content: `Requested title: ${input.title || "derive a concise title"}\nSOURCE:\n${input.sourceText}` },
    ],
  });
  const raw = completion.choices[0]?.message?.content;
  if (!raw) throw new Error("AI returned an empty response.");
  const parsed = deckSchema.parse(JSON.parse(raw));
  parsed.slides.sort((a, b) => a.position - b.position);
  return parsed;
}
