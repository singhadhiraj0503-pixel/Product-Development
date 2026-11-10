import { pgTable, uuid, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { providers } from "./provider.schema";

export const providerCorrections = pgTable("animal_provider_corrections", {
  id: uuid("id").defaultRandom().primaryKey(),
  providerId: uuid("provider_id").references(() => providers.id, { onDelete: "set null" }),
  submitterName: varchar("submitter_name", { length: 140 }).notNull(),
  submitterEmail: varchar("submitter_email", { length: 255 }),
  relationship: varchar("relationship", { length: 60 }),
  fieldToCorrect: varchar("field_to_correct", { length: 100 }).notNull(),
  currentValue: text("current_value"),
  suggestedValue: text("suggested_value").notNull(),
  reason: text("reason"),
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
