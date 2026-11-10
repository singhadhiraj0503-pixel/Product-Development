import { NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { ceWorkflows } from "@/lib/db/schema/content-engine.schema";
import { fail, ok } from "@/features/content-engine/lib/content-engine-response";
import { createRun } from "@/features/content-engine/services/content-engine.service";
import { executeContentPipeline } from "@/features/content-engine/services/pipeline.service";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const secret = process.env.N8N_WEBHOOK_SECRET;
    if (!secret || req.headers.get("x-content-engine-secret") !== secret) {
      return Response.json({ success: false, message: "Unauthorized webhook." }, { status: 401 });
    }
    const body = await req.json();
    if (!body.workflowId || !body.rawText) throw new Error("workflowId and rawText are required.");
    const [workflow] = await db.select().from(ceWorkflows).where(eq(ceWorkflows.id, String(body.workflowId))).limit(1);
    if (!workflow || workflow.status !== "active") throw new Error("Workflow not found or inactive.");
    const input = {
      workflowId: workflow.id,
      source: "telegram" as const,
      rawText: String(body.rawText),
      title: body.title ? String(body.title) : undefined,
      platformTargets: Array.isArray(body.platformTargets) ? body.platformTargets : ["linkedin", "instagram"],
      visualTheme: String(body.visualTheme || "obsidian-minimal"),
      aspectRatio: String(body.aspectRatio || "4:5"),
    };
    const run = await createRun(workflow.ownerId, { workflowId: workflow.id, triggerSource: "n8n", input });
    // A durable queue should replace this lifecycle hook in production.
    const { after } = await import("next/server");
    after(async () => { try { await executeContentPipeline(workflow.ownerId, run.id, input); } catch (error) { console.error("n8n-triggered ContentEngine run failed", run.id, error); } });
    return ok({ runId: run.id, status: run.status }, 202);
  } catch (error) { return fail(error); }
}
