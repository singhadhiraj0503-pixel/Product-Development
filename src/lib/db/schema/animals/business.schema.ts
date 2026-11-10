import { pgTable, uuid, varchar, text, jsonb, timestamp } from "drizzle-orm/pg-core";

export const businessApplications = pgTable("animal_business_applications", {
  id: uuid("id").defaultRandom().primaryKey(),
  applicantUserId: text("applicant_user_id"),
  facilityName: varchar("facility_name", { length: 180 }).notNull(),
  entityType: varchar("entity_type", { length: 50 }).notNull(),
  headVeterinarian: varchar("head_veterinarian", { length: 160 }).notNull(),
  councilRegistrationNo: varchar("council_registration_no", { length: 100 }),
  phone: varchar("phone", { length: 30 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  addressLine: text("address_line").notNull(),
  locality: varchar("locality", { length: 120 }).notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  state: varchar("state", { length: 100 }).notNull(),
  postalCode: varchar("postal_code", { length: 12 }),
  capabilities: jsonb("capabilities").$type<string[]>().notNull().default([]),
  documents: jsonb("documents").$type<string[]>().notNull().default([]),
  status: varchar("status", { length: 30 }).notNull().default("submitted"),
  adminNotes: text("admin_notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
