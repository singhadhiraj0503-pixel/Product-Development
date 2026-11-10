import {
  pgTable, pgEnum, text, varchar, integer, boolean, jsonb, timestamp,
  numeric, index, uniqueIndex,
} from "drizzle-orm/pg-core";

export const ceWorkflowStatus = pgEnum("ce_workflow_status", ["draft", "active", "paused", "archived"]);
export const ceRunStatus = pgEnum("ce_run_status", ["queued", "ingesting", "transcribing", "parsing", "generating", "rendering", "awaiting_approval", "dispatched", "failed", "cancelled"]);
export const ceDeckStatus = pgEnum("ce_deck_status", ["draft", "generating", "ready", "awaiting_approval", "approved", "rejected", "published", "failed"]);
export const ceSlideRole = pgEnum("ce_slide_role", ["hook", "problem", "principle", "example", "summary", "cta", "custom"]);

export const ceWorkflows = pgTable("ce_workflows", {
  id: text("id").primaryKey(),
  ownerId: text("owner_id").notNull(),
  name: varchar("name", { length: 160 }).notNull(),
  description: text("description"),
  status: ceWorkflowStatus("status").notNull().default("draft"),
  triggerType: varchar("trigger_type", { length: 40 }).notNull().default("manual"),
  config: jsonb("config").$type<Record<string, unknown>>().notNull().default({}),
  n8nWorkflowId: varchar("n8n_workflow_id", { length: 160 }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [index("ce_workflows_owner_idx").on(t.ownerId), index("ce_workflows_status_idx").on(t.status)]);

export const ceIdeas = pgTable("ce_ideas", {
  id: text("id").primaryKey(),
  ownerId: text("owner_id").notNull(),
  workflowId: text("workflow_id").references(() => ceWorkflows.id, { onDelete: "set null" }),
  source: varchar("source", { length: 32 }).notNull().default("text"),
  rawText: text("raw_text"),
  audioUrl: text("audio_url"),
  transcript: text("transcript"),
  sourceMetadata: jsonb("source_metadata").$type<Record<string, unknown>>().notNull().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [index("ce_ideas_owner_idx").on(t.ownerId)]);

export const ceDecks = pgTable("ce_decks", {
  id: text("id").primaryKey(),
  ownerId: text("owner_id").notNull(),
  ideaId: text("idea_id").references(() => ceIdeas.id, { onDelete: "set null" }),
  workflowId: text("workflow_id").references(() => ceWorkflows.id, { onDelete: "set null" }),
  title: varchar("title", { length: 240 }).notNull(),
  topic: text("topic"),
  platformTargets: jsonb("platform_targets").$type<string[]>().notNull().default(["linkedin", "instagram"]),
  aspectRatio: varchar("aspect_ratio", { length: 20 }).notNull().default("4:5"),
  width: integer("width").notNull().default(1080),
  height: integer("height").notNull().default(1350),
  visualTheme: varchar("visual_theme", { length: 80 }).notNull().default("obsidian-minimal"),
  fontPair: varchar("font_pair", { length: 120 }).notNull().default("Space Grotesk + Plus Jakarta Sans"),
  watermark: varchar("watermark", { length: 120 }),
  status: ceDeckStatus("status").notNull().default("draft"),
  schemaVersion: varchar("schema_version", { length: 32 }).notNull().default("2.0"),
  generationConfig: jsonb("generation_config").$type<Record<string, unknown>>().notNull().default({}),
  exportFiles: jsonb("export_files").$type<{ pdf?: string; zip?: string; pngs?: string[] }>().notNull().default({}),
  approvedAt: timestamp("approved_at", { withTimezone: true }),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [index("ce_decks_owner_idx").on(t.ownerId), index("ce_decks_status_idx").on(t.status)]);

export const ceSlides = pgTable("ce_slides", {
  id: text("id").primaryKey(),
  deckId: text("deck_id").notNull().references(() => ceDecks.id, { onDelete: "cascade" }),
  position: integer("position").notNull(),
  role: ceSlideRole("role").notNull().default("custom"),
  title: varchar("title", { length: 240 }).notNull(),
  body: text("body"),
  subtitle: text("subtitle"),
  kicker: varchar("kicker", { length: 160 }),
  visualPrompt: text("visual_prompt"),
  designTokens: jsonb("design_tokens").$type<Record<string, unknown>>().notNull().default({}),
  renderedImageUrl: text("rendered_image_url"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().notNull().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [uniqueIndex("ce_slides_deck_position_uq").on(t.deckId, t.position), index("ce_slides_deck_idx").on(t.deckId)]);

export const ceRuns = pgTable("ce_runs", {
  id: text("id").primaryKey(),
  ownerId: text("owner_id").notNull(),
  workflowId: text("workflow_id").references(() => ceWorkflows.id, { onDelete: "set null" }),
  ideaId: text("idea_id").references(() => ceIdeas.id, { onDelete: "set null" }),
  deckId: text("deck_id").references(() => ceDecks.id, { onDelete: "set null" }),
  status: ceRunStatus("status").notNull().default("queued"),
  triggerSource: varchar("trigger_source", { length: 40 }).notNull().default("dashboard"),
  input: jsonb("input").$type<Record<string, unknown>>().notNull().default({}),
  output: jsonb("output").$type<Record<string, unknown>>().notNull().default({}),
  errorMessage: text("error_message"),
  startedAt: timestamp("started_at", { withTimezone: true }),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  durationMs: integer("duration_ms"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [index("ce_runs_owner_idx").on(t.ownerId), index("ce_runs_status_idx").on(t.status)]);

export const ceRunEvents = pgTable("ce_run_events", {
  id: text("id").primaryKey(),
  runId: text("run_id").notNull().references(() => ceRuns.id, { onDelete: "cascade" }),
  stage: varchar("stage", { length: 60 }).notNull(),
  message: text("message").notNull(),
  level: varchar("level", { length: 16 }).notNull().default("info"),
  elapsedMs: integer("elapsed_ms"),
  payload: jsonb("payload").$type<Record<string, unknown>>().notNull().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [index("ce_run_events_run_idx").on(t.runId)]);

export const ceIntegrations = pgTable("ce_integrations", {
  id: text("id").primaryKey(),
  ownerId: text("owner_id").notNull(),
  provider: varchar("provider", { length: 40 }).notNull(),
  externalAccountId: varchar("external_account_id", { length: 180 }),
  config: jsonb("config").$type<Record<string, unknown>>().notNull().default({}),
  enabled: boolean("enabled").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [index("ce_integrations_owner_idx").on(t.ownerId)]);
