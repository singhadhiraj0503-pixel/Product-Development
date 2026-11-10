import { NextRequest } from "next/server";
import { requireContentEngineUser } from "@/features/content-engine/lib/content-engine-auth";
import { fail, ok } from "@/features/content-engine/lib/content-engine-response";
import { createWorkflowSchema } from "@/features/content-engine/schemas/content-engine.schemas";
import * as service from "@/features/content-engine/services/content-engine.service";

export async function GET() {
  try { const user = await requireContentEngineUser(); return ok(await service.listWorkflows(user.id)); }
  catch (e) { return fail(e); }
}
export async function POST(req: NextRequest) {
  try { const user = await requireContentEngineUser(); const body = createWorkflowSchema.parse(await req.json()); return ok(await service.createWorkflow(user.id, body), 201); }
  catch (e) { return fail(e); }
}
