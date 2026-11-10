import { z } from "zod";

export const createWorkflowSchema = z.object({
  name: z.string().min(2).max(160),
  description: z.string().max(2000).optional(),
  triggerType: z.enum(["manual", "telegram", "webhook", "schedule"]).default("manual"),
  config: z.record(z.string(), z.unknown()).optional(),
});
export const updateWorkflowSchema = createWorkflowSchema.partial().extend({
  status: z.enum(["draft", "active", "paused", "archived"]).optional(),
});
export const createDeckSchema = z.object({
  title: z.string().min(2).max(240),
  topic: z.string().max(5000).optional(),
  platformTargets: z.array(z.enum(["linkedin", "instagram"])).min(1).default(["linkedin", "instagram"]),
  aspectRatio: z.enum(["4:5", "1:1", "9:16"]).default("4:5"),
  visualTheme: z.string().max(80).default("obsidian-minimal"),
  fontPair: z.string().max(120).default("Space Grotesk + Plus Jakarta Sans"),
  watermark: z.string().max(120).optional(),
  workflowId: z.string().optional(),
});
export const updateDeckSchema = createDeckSchema.partial().extend({
  status: z.enum(["draft", "ready", "awaiting_approval", "approved", "rejected", "published"]).optional(),
  generationConfig: z.record(z.string(), z.unknown()).optional(),
  slides: z.array(z.object({
    id: z.string().optional(),
    position: z.number().int().min(0),
    role: z.enum(["hook", "problem", "principle", "example", "summary", "cta", "custom"]),
    title: z.string().min(1).max(240),
    body: z.string().optional(),
    subtitle: z.string().optional(),
    kicker: z.string().optional(),
    visualPrompt: z.string().optional(),
    designTokens: z.record(z.string(), z.unknown()).optional(),
  })).optional(),
});
export const createRunSchema = z.object({
  workflowId: z.string().optional(),
  deckId: z.string().optional(),
  source: z.enum(["text", "audio", "telegram"]).default("text"),
  rawText: z.string().max(30000).optional(),
  audioUrl: z.string().url().optional(),
  title: z.string().max(240).optional(),
  platformTargets: z.array(z.enum(["linkedin", "instagram"])).min(1).default(["linkedin", "instagram"]),
  visualTheme: z.string().max(80).default("obsidian-minimal"),
  aspectRatio: z.enum(["4:5", "1:1", "9:16"]).default("4:5"),
}).refine(v => Boolean(v.rawText?.trim() || v.audioUrl), { message: "Provide rawText or audioUrl." });
export const approvalSchema = z.object({
  decision: z.enum(["approve", "reject"]),
  note: z.string().max(1000).optional(),
});
