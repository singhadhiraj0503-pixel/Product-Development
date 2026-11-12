"use server";
import { db } from "@/lib/db";
import { appointments, providers } from "@/lib/db/schema/animals";
import { appointmentSchema } from "../schemas/appointment.schema";
import { eq } from "drizzle-orm";

export async function createAppointment(input: unknown) {
  const parsed = appointmentSchema.safeParse(input);
  if (!parsed.success)
    return { success: false as const, error: parsed.error.flatten() };
  const provider = await db.query.providers.findFirst({
    where: eq(providers.id, parsed.data.providerId),
  });
  if (!provider || provider.status !== "active")
    return { success: false as const, error: "Provider is unavailable" };
  const [created] = await db
    .insert(appointments)
    .values(parsed.data)
    .returning();
  return { success: true as const, data: created };
}
