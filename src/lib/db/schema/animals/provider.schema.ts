import { pgTable, uuid, varchar, text, boolean, integer, numeric, jsonb, timestamp, index } from "drizzle-orm/pg-core";

export const providers = pgTable("animal_providers", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 180 }).notNull(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  providerType: varchar("provider_type", { length: 40 }).notNull(), // clinic | hospital | boarding | diagnostic | ambulance | ngo | sanctuary
  description: text("description"),
  phone: varchar("phone", { length: 30 }).notNull(),
  email: varchar("email", { length: 255 }),
  website: text("website"),
  addressLine: text("address_line").notNull(),
  locality: varchar("locality", { length: 120 }).notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  state: varchar("state", { length: 100 }).notNull(),
  postalCode: varchar("postal_code", { length: 12 }),
  country: varchar("country", { length: 80 }).notNull().default("India"),
  latitude: numeric("latitude", { precision: 10, scale: 7 }),
  longitude: numeric("longitude", { precision: 10, scale: 7 }),
  species: jsonb("species").$type<string[]>().notNull().default([]),
  specialties: jsonb("specialties").$type<string[]>().notNull().default([]),
  capabilities: jsonb("capabilities").$type<string[]>().notNull().default([]),
  operatingHours: jsonb("operating_hours").$type<Record<string, { open: string; close: string; closed?: boolean }>>().notNull().default({}),
  open24Hours: boolean("open_24_hours").notNull().default(false),
  isEmergency: boolean("is_emergency").notNull().default(false),
  isVerified: boolean("is_verified").notNull().default(false),
  verificationStatus: varchar("verification_status", { length: 30 }).notNull().default("pending"),
  consultationFee: numeric("consultation_fee", { precision: 10, scale: 2 }),
  averageRating: numeric("average_rating", { precision: 2, scale: 1 }).notNull().default("0"),
  reviewCount: integer("review_count").notNull().default(0),
  coverImageUrl: text("cover_image_url"),
  status: varchar("status", { length: 30 }).notNull().default("pending"), // pending | active | rejected | suspended
  createdBy: text("created_by"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({ cityIdx: index("animal_providers_city_idx").on(t.city), statusIdx: index("animal_providers_status_idx").on(t.status), typeIdx: index("animal_providers_type_idx").on(t.providerType) }));

export const veterinarians = pgTable("animal_veterinarians", {
  id: uuid("id").defaultRandom().primaryKey(),
  providerId: uuid("provider_id").notNull().references(() => providers.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 160 }).notNull(),
  qualification: varchar("qualification", { length: 180 }),
  specialty: varchar("specialty", { length: 120 }),
  councilRegistrationNo: varchar("council_registration_no", { length: 100 }),
  isOnDuty: boolean("is_on_duty").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
