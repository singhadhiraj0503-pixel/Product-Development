"use server";
import { db } from "@/lib/db";
import { emergencyRequests, emergencyResources } from "@/lib/db/schema/animals";
import { emergencySchema } from "../schemas/emergency.schema";
import { and, eq } from "drizzle-orm";

export async function createEmergencyRequest(input: unknown) {
  const parsed = emergencySchema.safeParse(input);
  if (!parsed.success)
    return { success: false as const, error: parsed.error.flatten() };
  const [created] = await db
    .insert(emergencyRequests)
    .values({ ...parsed.data, isDemoRequest: true })
    .returning();
  return {
    success: true as const,
    data: created,
    message: "Request recorded. This demo does not dispatch a real ambulance.",
  };
}

export async function getEmergencyResources(city: string) {
  const data = await db
    .select()
    .from(emergencyResources)
    .where(eq(emergencyResources.city, city));
  return {
    success: true as const,
    data,
    demoData: data.some((r) => r.isDemoData),
  };
}
