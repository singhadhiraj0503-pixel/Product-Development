import { NextRequest } from "next/server";
import { requireContentEngineUser } from "@/features/content-engine/lib/content-engine-auth";
import { fail, ok } from "@/features/content-engine/lib/content-engine-response";
import { getDeck } from "@/features/content-engine/services/content-engine.service";
import { renderDeck } from "@/features/content-engine/services/render.service";

export const maxDuration = 60;
export async function POST(_: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireContentEngineUser();
    const { id } = await ctx.params;
    const deck = await getDeck(user.id, id);
    if (!deck.slides.length) throw new Error("Deck has no slides to export.");
    const exports = await renderDeck(id, deck.slides, { width: deck.width, height: deck.height, theme: deck.visualTheme, watermark: deck.watermark || undefined });
    return ok(exports);
  } catch (e) { return fail(e); }
}
