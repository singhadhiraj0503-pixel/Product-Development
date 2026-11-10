import { NextRequest } from "next/server";
import { requireContentEngineUser } from "@/features/content-engine/lib/content-engine-auth";
import { fail, ok } from "@/features/content-engine/lib/content-engine-response";
import { updateWorkflowSchema } from "@/features/content-engine/schemas/content-engine.schemas";
import * as service from "@/features/content-engine/services/content-engine.service";

type Ctx = { params: Promise<{ id: string }> };
export async function GET(_: NextRequest, ctx: Ctx) {
  try { const user = await requireContentEngineUser(); const { id } = await ctx.params; return ok(await service.getWorkflow(user.id, id)); } catch (e) { return fail(e); }
}
export async function PATCH(req: NextRequest, ctx: Ctx) {
  try { const user = await requireContentEngineUser(); const { id } = await ctx.params; const body = updateWorkflowSchema.parse(await req.json()); return ok(await service.patchWorkflow(user.id, id, body)); } catch (e) { return fail(e); }
}
export async function DELETE(_: NextRequest, ctx: Ctx) {
  try { const user = await requireContentEngineUser(); const { id } = await ctx.params; return ok(await service.deleteWorkflow(user.id, id)); } catch (e) { return fail(e); }
}
