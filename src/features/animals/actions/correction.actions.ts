"use server";
import { db } from "@/lib/db";
import { providerCorrections } from "@/lib/db/schema/animals";
import { correctionSchema } from "../schemas/correction.schema";

export async function submitProviderCorrection(input: unknown) {
  const parsed = correctionSchema.safeParse(input);
  if (!parsed.success) return { success: false as const, error: parsed.error.flatten() };
  const [correction] = await db.insert(providerCorrections).values(parsed.data).returning({ id: providerCorrections.id, status: providerCorrections.status });
  return { success: true as const, data: correction };
}
