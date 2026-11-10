import { NextRequest } from "next/server";
import { requireContentEngineUser } from "@/features/content-engine/lib/content-engine-auth";
import { fail, ok } from "@/features/content-engine/lib/content-engine-response";
import { updateDeckSchema } from "@/features/content-engine/schemas/content-engine.schemas";
import * as service from "@/features/content-engine/services/content-engine.service";

type Ctx = { params: Promise<{ id: string }> };
export async function GET(_: NextRequest, ctx: Ctx) {
  try { const user = await requireContentEngineUser(); const { id } = await ctx.params; return ok(await service.getDeck(user.id, id)); } catch (e) { return fail(e); }
}
export async function PATCH(req: NextRequest, ctx: Ctx) {
  try { const user = await requireContentEngineUser(); const { id } = await ctx.params; const body = updateDeckSchema.parse(await req.json()); return ok(await service.updateDeck(user.id, id, body)); } catch (e) { return fail(e); }
}
export async function DELETE(_: NextRequest, ctx: Ctx) {
  try { const user = await requireContentEngineUser(); const { id } = await ctx.params; return ok(await service.deleteDeck(user.id, id)); } catch (e) { return fail(e); }
}
