export type WorkflowStage = "ingest" | "transcribe" | "parse" | "generate" | "render" | "approval" | "dispatch";
export type PlatformTarget = "linkedin" | "instagram";
export type DeckSlide = {
  position: number;
  role: "hook" | "problem" | "principle" | "example" | "summary" | "cta" | "custom";
  title: string;
  body?: string;
  subtitle?: string;
  kicker?: string;
  visualPrompt?: string;
  designTokens?: Record<string, unknown>;
};
export type GeneratedDeck = {
  title: string;
  topic: string;
  slides: DeckSlide[];
  rationale?: string;
};
export type RunEventInput = { stage: string; message: string; level?: "info" | "warn" | "error" | "success"; elapsedMs?: number; payload?: Record<string, unknown> };
