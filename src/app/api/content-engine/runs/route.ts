import { NextRequest, after } from "next/server";
import { requireContentEngineUser } from "@/features/content-engine/lib/content-engine-auth";
import { fail, ok } from "@/features/content-engine/lib/content-engine-response";
import { createRunSchema } from "@/features/content-engine/schemas/content-engine.schemas";
import { createRun } from "@/features/content-engine/services/content-engine.service";
import { executeContentPipeline } from "@/features/content-engine/services/pipeline.service";

export const maxDuration = 60;
export async function POST(req: NextRequest) {
  try {
    const user = await requireContentEngineUser();
    const body = createRunSchema.parse(await req.json());
    const run = await createRun(user.id, { workflowId: body.workflowId, deckId: body.deckId, triggerSource: body.source, input: body });
    // For production queue-backed execution, enqueue run.id here and return immediately.
    after(async () => { try { await executeContentPipeline(user.id, run.id, body); } catch (error) { console.error("ContentEngine run failed", run.id, error); } });
    return ok({ runId: run.id, status: run.status }, 202);
  } catch (e) { return fail(e); }
}
