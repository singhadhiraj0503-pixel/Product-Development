CREATE TYPE "public"."ce_deck_status" AS ENUM('draft', 'generating', 'ready', 'awaiting_approval', 'approved', 'rejected', 'published', 'failed');--> statement-breakpoint
CREATE TYPE "public"."ce_run_status" AS ENUM('queued', 'ingesting', 'transcribing', 'parsing', 'generating', 'rendering', 'awaiting_approval', 'dispatched', 'failed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."ce_slide_role" AS ENUM('hook', 'problem', 'principle', 'example', 'summary', 'cta', 'custom');--> statement-breakpoint
CREATE TYPE "public"."ce_workflow_status" AS ENUM('draft', 'active', 'paused', 'archived');--> statement-breakpoint
CREATE TABLE "ce_decks" (
	"id" text PRIMARY KEY NOT NULL,
	"owner_id" text NOT NULL,
	"idea_id" text,
	"workflow_id" text,
	"title" varchar(240) NOT NULL,
	"topic" text,
	"platform_targets" jsonb DEFAULT '["linkedin","instagram"]'::jsonb NOT NULL,
	"aspect_ratio" varchar(20) DEFAULT '4:5' NOT NULL,
	"width" integer DEFAULT 1080 NOT NULL,
	"height" integer DEFAULT 1350 NOT NULL,
	"visual_theme" varchar(80) DEFAULT 'obsidian-minimal' NOT NULL,
	"font_pair" varchar(120) DEFAULT 'Space Grotesk + Plus Jakarta Sans' NOT NULL,
	"watermark" varchar(120),
	"status" "ce_deck_status" DEFAULT 'draft' NOT NULL,
	"schema_version" varchar(32) DEFAULT '2.0' NOT NULL,
	"generation_config" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"export_files" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"approved_at" timestamp with time zone,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ce_ideas" (
	"id" text PRIMARY KEY NOT NULL,
	"owner_id" text NOT NULL,
	"workflow_id" text,
	"source" varchar(32) DEFAULT 'text' NOT NULL,
	"raw_text" text,
	"audio_url" text,
	"transcript" text,
	"source_metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ce_integrations" (
	"id" text PRIMARY KEY NOT NULL,
	"owner_id" text NOT NULL,
	"provider" varchar(40) NOT NULL,
	"external_account_id" varchar(180),
	"config" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ce_run_events" (
	"id" text PRIMARY KEY NOT NULL,
	"run_id" text NOT NULL,
	"stage" varchar(60) NOT NULL,
	"message" text NOT NULL,
	"level" varchar(16) DEFAULT 'info' NOT NULL,
	"elapsed_ms" integer,
	"payload" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ce_runs" (
	"id" text PRIMARY KEY NOT NULL,
	"owner_id" text NOT NULL,
	"workflow_id" text,
	"idea_id" text,
	"deck_id" text,
	"status" "ce_run_status" DEFAULT 'queued' NOT NULL,
	"trigger_source" varchar(40) DEFAULT 'dashboard' NOT NULL,
	"input" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"output" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"error_message" text,
	"started_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"duration_ms" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ce_slides" (
	"id" text PRIMARY KEY NOT NULL,
	"deck_id" text NOT NULL,
	"position" integer NOT NULL,
	"role" "ce_slide_role" DEFAULT 'custom' NOT NULL,
	"title" varchar(240) NOT NULL,
	"body" text,
	"subtitle" text,
	"kicker" varchar(160),
	"visual_prompt" text,
	"design_tokens" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"rendered_image_url" text,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ce_workflows" (
	"id" text PRIMARY KEY NOT NULL,
	"owner_id" text NOT NULL,
	"name" varchar(160) NOT NULL,
	"description" text,
	"status" "ce_workflow_status" DEFAULT 'draft' NOT NULL,
	"trigger_type" varchar(40) DEFAULT 'manual' NOT NULL,
	"config" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"n8n_workflow_id" varchar(160),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ce_decks" ADD CONSTRAINT "ce_decks_idea_id_ce_ideas_id_fk" FOREIGN KEY ("idea_id") REFERENCES "public"."ce_ideas"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ce_decks" ADD CONSTRAINT "ce_decks_workflow_id_ce_workflows_id_fk" FOREIGN KEY ("workflow_id") REFERENCES "public"."ce_workflows"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ce_ideas" ADD CONSTRAINT "ce_ideas_workflow_id_ce_workflows_id_fk" FOREIGN KEY ("workflow_id") REFERENCES "public"."ce_workflows"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ce_run_events" ADD CONSTRAINT "ce_run_events_run_id_ce_runs_id_fk" FOREIGN KEY ("run_id") REFERENCES "public"."ce_runs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ce_runs" ADD CONSTRAINT "ce_runs_workflow_id_ce_workflows_id_fk" FOREIGN KEY ("workflow_id") REFERENCES "public"."ce_workflows"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ce_runs" ADD CONSTRAINT "ce_runs_idea_id_ce_ideas_id_fk" FOREIGN KEY ("idea_id") REFERENCES "public"."ce_ideas"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ce_runs" ADD CONSTRAINT "ce_runs_deck_id_ce_decks_id_fk" FOREIGN KEY ("deck_id") REFERENCES "public"."ce_decks"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ce_slides" ADD CONSTRAINT "ce_slides_deck_id_ce_decks_id_fk" FOREIGN KEY ("deck_id") REFERENCES "public"."ce_decks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "ce_decks_owner_idx" ON "ce_decks" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "ce_decks_status_idx" ON "ce_decks" USING btree ("status");--> statement-breakpoint
CREATE INDEX "ce_ideas_owner_idx" ON "ce_ideas" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "ce_integrations_owner_idx" ON "ce_integrations" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "ce_run_events_run_idx" ON "ce_run_events" USING btree ("run_id");--> statement-breakpoint
CREATE INDEX "ce_runs_owner_idx" ON "ce_runs" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "ce_runs_status_idx" ON "ce_runs" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "ce_slides_deck_position_uq" ON "ce_slides" USING btree ("deck_id","position");--> statement-breakpoint
CREATE INDEX "ce_slides_deck_idx" ON "ce_slides" USING btree ("deck_id");--> statement-breakpoint
CREATE INDEX "ce_workflows_owner_idx" ON "ce_workflows" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "ce_workflows_status_idx" ON "ce_workflows" USING btree ("status");