import { pgTable, uuid, varchar, text, integer, boolean, numeric, timestamp, jsonb } from "drizzle-orm/pg-core";
import { providers } from "./provider.schema";

export const emergencyResources = pgTable("animal_emergency_resources", {
  id: uuid("id").defaultRandom().primaryKey(),
  providerId: uuid("provider_id").references(() => providers.id, { onDelete: "cascade" }),
  city: varchar("city", { length: 100 }).notNull(),
  resourceType: varchar("resource_type", { length: 50 }).notNull(), // ambulance | oxygen_incubator | trauma_theatre | blood_unit | icu_bed
  label: varchar("label", { length: 140 }).notNull(),
  total: integer("total").notNull().default(0),
  available: integer("available").notNull().default(0),
  bloodGroup: varchar("blood_group", { length: 8 }),
  isDemoData: boolean("is_demo_data").notNull().default(true),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const emergencyRequests = pgTable("animal_emergency_requests", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id"),
  providerId: uuid("provider_id").references(() => providers.id),
  ownerName: varchar("owner_name", { length: 140 }).notNull(),
  phone: varchar("phone", { length: 30 }).notNull(),
  petName: varchar("pet_name", { length: 100 }),
  species: varchar("species", { length: 60 }).notNull(),
  symptoms: jsonb("symptoms").$type<string[]>().notNull().default([]),
  description: text("description"),
  address: text("address").notNull(),
  latitude: numeric("latitude", { precision: 10, scale: 7 }),
  longitude: numeric("longitude", { precision: 10, scale: 7 }),
  status: varchar("status", { length: 30 }).notNull().default("received"),
  isDemoRequest: boolean("is_demo_request").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
