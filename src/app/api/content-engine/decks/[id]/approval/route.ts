import { NextRequest } from "next/server";
import { requireContentEngineUser } from "@/features/content-engine/lib/content-engine-auth";
import { fail, ok } from "@/features/content-engine/lib/content-engine-response";
import { approvalSchema } from "@/features/content-engine/schemas/content-engine.schemas";
import { setDeckStatus, getDeck } from "@/features/content-engine/services/content-engine.service";

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireContentEngineUser();
    const { id } = await ctx.params;
    const body = approvalSchema.parse(await req.json());
    await getDeck(user.id, id);
    const deck = await setDeckStatus(user.id, id, body.decision === "approve" ? "approved" : "rejected");
    return ok({ deck, note: body.note || null });
  } catch (e) { return fail(e); }
}
