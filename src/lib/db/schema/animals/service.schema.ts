import { pgTable, uuid, varchar, text, numeric, boolean } from "drizzle-orm/pg-core";
import { providers } from "./provider.schema";

export const animalServices = pgTable("animal_services", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 120 }).notNull().unique(),
  slug: varchar("slug", { length: 140 }).notNull().unique(),
  description: text("description"),
  isActive: boolean("is_active").notNull().default(true),
});

export const providerServices = pgTable("animal_provider_services", {
  id: uuid("id").defaultRandom().primaryKey(),
  providerId: uuid("provider_id").notNull().references(() => providers.id, { onDelete: "cascade" }),
  serviceId: uuid("service_id").notNull().references(() => animalServices.id, { onDelete: "cascade" }),
  fee: numeric("fee", { precision: 10, scale: 2 }),
  isAvailable: boolean("is_available").notNull().default(true),
});
