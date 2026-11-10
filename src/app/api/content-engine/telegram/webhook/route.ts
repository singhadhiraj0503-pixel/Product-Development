import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { ceDecks } from "@/lib/db/schema/content-engine.schema";
import { answerTelegramCallback } from "@/features/content-engine/services/telegram.service";

export async function POST(req: NextRequest) {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (secret && req.headers.get("x-telegram-bot-api-secret-token") !== secret) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const update = await req.json();
  const callback = update.callback_query;
  if (!callback?.data || !callback?.id) return NextResponse.json({ ok: true });
  const [prefix, decision, deckId] = String(callback.data).split(":");
  if (prefix !== "ce" || !["approve", "reject"].includes(decision) || !deckId) return NextResponse.json({ ok: true });
  const [deck] = await db.select().from(ceDecks).where(eq(ceDecks.id, deckId)).limit(1);
  if (deck) {
    // Telegram callback is a configured owner-controlled bot action. The webhook secret authenticates Telegram.
    await db.update(ceDecks).set({
      status: decision === "approve" ? "approved" : "rejected",
      ...(decision === "approve" ? { approvedAt: new Date() } : {}),
      updatedAt: new Date(),
    }).where(and(eq(ceDecks.id, deckId), eq(ceDecks.ownerId, deck.ownerId)));
    await answerTelegramCallback(callback.id, decision === "approve" ? "Deck approved" : "Deck rejected");
  }
  return NextResponse.json({ ok: true });
}
