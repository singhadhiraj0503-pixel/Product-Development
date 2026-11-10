import { NextRequest, after } from "next/server";
import { requireContentEngineUser } from "@/features/content-engine/lib/content-engine-auth";
import { fail, ok } from "@/features/content-engine/lib/content-engine-response";
import { createRun } from "@/features/content-engine/services/content-engine.service";
import { executeContentPipeline } from "@/features/content-engine/services/pipeline.service";

export const maxDuration = 60;
export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireContentEngineUser();
    const { id } = await ctx.params;
    const body = await req.json();
    if (!body.rawText && !body.audioUrl) throw new Error("rawText or audioUrl is required.");
    const input = { ...body, deckId: id, source: body.source || "text", platformTargets: body.platformTargets || ["linkedin", "instagram"], visualTheme: body.visualTheme || "obsidian-minimal", aspectRatio: body.aspectRatio || "4:5" };
    const run = await createRun(user.id, { deckId: id, triggerSource: "dashboard", input });
    after(async () => { try { await executeContentPipeline(user.id, run.id, input); } catch (error) { console.error("Deck generation failed", run.id, error); } });
    return ok({ runId: run.id, status: run.status }, 202);
  } catch (e) { return fail(e); }
}
