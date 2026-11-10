"use server";
import { and, asc, desc, eq, ilike, gte, or, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { providers, providerServices, animalServices } from "@/lib/db/schema/animals";
import { providerSearchSchema } from "../schemas/provider.schema";

export async function searchProviders(input: unknown) {
  const parsed = providerSearchSchema.safeParse(input);
  if (!parsed.success) return { success: false as const, error: parsed.error.flatten() };
  const p = parsed.data;
  const filters = [eq(providers.status, "active")];
  if (p.q) filters.push(or(ilike(providers.name, `%${p.q}%`), ilike(providers.description, `%${p.q}%`), ilike(providers.locality, `%${p.q}%`))!);
  if (p.city) filters.push(ilike(providers.city, `%${p.city}%`));
  if (p.locality) filters.push(ilike(providers.locality, `%${p.locality}%`));
  if (p.providerType) filters.push(eq(providers.providerType, p.providerType));
  if (p.species) filters.push(sql`${providers.species}::jsonb ? ${p.species}`);
  if (p.service) filters.push(sql`exists (
    select 1 from ${providerServices}
    inner join ${animalServices} on ${providerServices.serviceId} = ${animalServices.id}
    where ${providerServices.providerId} = ${providers.id}
      and ${providerServices.isAvailable} = true
      and (${animalServices.name} ilike ${`%${p.service}%`} or ${animalServices.slug} = ${p.service})
  )`);
  if (p.verified) filters.push(eq(providers.isVerified, p.verified === "true"));
  if (p.emergency) filters.push(eq(providers.isEmergency, p.emergency === "true"));
  if (p.open24Hours) filters.push(eq(providers.open24Hours, p.open24Hours === "true"));
  if (p.minRating !== undefined) filters.push(gte(providers.averageRating, String(p.minRating)));
  const distance = p.latitude !== undefined && p.longitude !== undefined
    ? sql`(6371 * acos(least(1, greatest(-1,
        cos(radians(${p.latitude})) * cos(radians(${providers.latitude}::double precision)) *
        cos(radians(${providers.longitude}::double precision) - radians(${p.longitude})) +
        sin(radians(${p.latitude})) * sin(radians(${providers.latitude}::double precision))
      ))))`
    : null;
  const orderBy = p.sort === "rating" ? desc(providers.averageRating)
    : p.sort === "fee-low" ? asc(providers.consultationFee)
    : p.sort === "fee-high" ? desc(providers.consultationFee)
    : p.sort === "name" ? asc(providers.name)
    : distance ? asc(distance) : desc(providers.isVerified);
  const [items, count] = await Promise.all([
    db.select().from(providers).where(and(...filters)).orderBy(orderBy).limit(p.limit).offset((p.page - 1) * p.limit),
    db.select({ count: sql<number>`count(*)::int` }).from(providers).where(and(...filters)),
  ]);
  return { success: true as const, data: items, pagination: { page: p.page, limit: p.limit, total: count[0]?.count ?? 0, totalPages: Math.ceil((count[0]?.count ?? 0) / p.limit) } };
}
