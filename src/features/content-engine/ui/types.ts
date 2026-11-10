export type Workflow = {
  id: string; name: string; description?: string | null;
  status: "draft" | "active" | "paused" | "archived";
  triggerType: string; createdAt: string; updatedAt: string;
};
export type Slide = {
  id: string; position: number;
  role: "hook" | "problem" | "principle" | "example" | "summary" | "cta" | "custom";
  title: string; body?: string | null; subtitle?: string | null;
  kicker?: string | null; visualPrompt?: string | null;
  designTokens?: Record<string, unknown>;
  renderedImageUrl?: string | null;
};
export type Deck = {
  id: string; title: string; topic?: string | null;
  status: string; platformTargets: string[]; aspectRatio: string;
  width: number; height: number; visualTheme: string;
  fontPair: string; watermark?: string | null;
  slides: Slide[];
  exportFiles?: { pdf?: string; zip?: string; pngs?: string[] };
};
export type RunEvent = { id: string; stage: string; message: string; level: string; elapsedMs?: number | null; createdAt: string };
export type Run = {
  id: string; status: string; durationMs?: number | null;
  errorMessage?: string | null; createdAt: string;
  events?: RunEvent[];
};
