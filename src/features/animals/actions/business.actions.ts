"use server";
import { db } from "@/lib/db";
import { businessApplications } from "@/lib/db/schema/animals";
import { businessApplicationSchema } from "../schemas/business.schema";

export async function submitBusinessApplication(input: unknown) {
  const parsed = businessApplicationSchema.safeParse(input);
  if (!parsed.success) return { success: false as const, error: parsed.error.flatten() };
  const [application] = await db.insert(businessApplications).values(parsed.data).returning({ id: businessApplications.id, status: businessApplications.status, createdAt: businessApplications.createdAt });
  return { success: true as const, data: application };
}
