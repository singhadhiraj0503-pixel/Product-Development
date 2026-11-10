import { randomUUID } from "crypto";
import { createDeck, createIdea, updateRun, addRunEvent, saveGeneratedSlides, getDeck, setDeckStatus } from "./content-engine.service";
import { generateCarousel, transcribeAudio } from "./ai-generation.service";
import { renderDeck } from "./render.service";
import { sendTelegramApproval } from "./telegram.service";

export async function executeContentPipeline(ownerId: string, runId: string, input: {
  source: "text" | "audio" | "telegram"; rawText?: string; audioUrl?: string; title?: string;
  workflowId?: string; deckId?: string; platformTargets: string[]; visualTheme: string; aspectRatio: string;
}) {
  const started = Date.now();
  const event = (stage: string, message: string, level: "info" | "success" | "error" = "info") =>
    addRunEvent(runId, { stage, message, level, elapsedMs: Date.now() - started });
  try {
    if (input.deckId) await getDeck(ownerId, input.deckId);
    await updateRun(runId, { status: "ingesting", startedAt: new Date() });
    await event("ingest", "Input received and queued for processing.");
    let sourceText = input.rawText || "";
    if (input.audioUrl) {
      await updateRun(runId, { status: "transcribing" });
      await event("transcribe", "Transcribing audio input.");
      sourceText = await transcribeAudio(input.audioUrl);
      await event("transcribe", "Audio transcription completed.", "success");
    }
    if (!sourceText.trim()) throw new Error("No usable source text was provided.");
    const idea = await createIdea(ownerId, { id: randomUUID(), workflowId: input.workflowId, source: input.source, rawText: input.rawText, audioUrl: input.audioUrl, transcript: sourceText });
    await updateRun(runId, { status: "parsing", ideaId: idea.id });
    await event("parse", "Source normalized and prepared for semantic decomposition.", "success");

    let deckId = input.deckId;
    if (!deckId) {
      const deck = await createDeck(ownerId, { title: input.title || "Untitled AI Carousel", topic: sourceText.slice(0, 500), workflowId: input.workflowId, ideaId: idea.id, platformTargets: input.platformTargets, visualTheme: input.visualTheme, aspectRatio: input.aspectRatio, width: input.aspectRatio === "1:1" ? 1080 : 1080, height: input.aspectRatio === "1:1" ? 1080 : input.aspectRatio === "9:16" ? 1920 : 1350, status: "generating" });
      deckId = deck.id;
    }
    await updateRun(runId, { status: "generating", deckId });
    await event("generate", "Generating structured carousel content with schema-constrained output.");
    const generated = await generateCarousel({ sourceText, title: input.title, visualTheme: input.visualTheme, platformTargets: input.platformTargets });
    await saveGeneratedSlides(deckId, generated);
    await event("generate", `${generated.slides.length} slides generated and validated.`, "success");

    await updateRun(runId, { status: "rendering" });
    await event("render", "Rendering slide previews and PDF.");
    const deck = await getDeck(ownerId, deckId);
    const exports = await renderDeck(deckId, deck.slides, { width: deck.width, height: deck.height, theme: deck.visualTheme, watermark: deck.watermark || undefined });
    await event("render", "PNG previews and PDF export rendered.", "success");

    await setDeckStatus(ownerId, deckId, "awaiting_approval");
    await updateRun(runId, { status: "awaiting_approval", output: { deckId, exports } });
    await addRunEvent(runId, { stage: "approval", message: "Deck is awaiting human approval.", level: "success", elapsedMs: Date.now() - started });
    const chatId = process.env.TELEGRAM_DEFAULT_CHAT_ID;
    if (chatId) {
      await sendTelegramApproval({ chatId, deckId, title: generated.title, slideCount: generated.slides.length });
      await event("dispatch", "Telegram approval card dispatched.", "success");
    }
    await updateRun(runId, { status: "awaiting_approval", completedAt: new Date(), durationMs: Date.now() - started });
    return { runId, deckId, exports, durationMs: Date.now() - started };
  } catch (error) {
    await updateRun(runId, { status: "failed", errorMessage: error instanceof Error ? error.message : "Pipeline failed", completedAt: new Date(), durationMs: Date.now() - started });
    await event("pipeline", error instanceof Error ? error.message : "Pipeline failed", "error");
    throw error;
  }
}
