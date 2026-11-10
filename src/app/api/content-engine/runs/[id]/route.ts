import { NextRequest } from "next/server";
import { requireContentEngineUser } from "@/features/content-engine/lib/content-engine-auth";
import { fail, ok } from "@/features/content-engine/lib/content-engine-response";
import { getRun } from "@/features/content-engine/services/content-engine.service";

export async function GET(_: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try { const user = await requireContentEngineUser(); const { id } = await ctx.params; return ok(await getRun(user.id, id)); } catch (e) { return fail(e); }
}
