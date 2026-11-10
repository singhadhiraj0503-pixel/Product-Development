import { pgTable, uuid, varchar, text, timestamp, index } from "drizzle-orm/pg-core";
import { providers } from "./provider.schema";

export const appointments = pgTable("animal_appointments", {
  id: uuid("id").defaultRandom().primaryKey(),
  providerId: uuid("provider_id").notNull().references(() => providers.id),
  userId: text("user_id"),
  petName: varchar("pet_name", { length: 100 }).notNull(),
  species: varchar("species", { length: 60 }).notNull(),
  ownerName: varchar("owner_name", { length: 140 }).notNull(),
  ownerPhone: varchar("owner_phone", { length: 30 }).notNull(),
  ownerEmail: varchar("owner_email", { length: 255 }),
  appointmentAt: timestamp("appointment_at", { withTimezone: true }).notNull(),
  reason: text("reason"),
  status: varchar("status", { length: 30 }).notNull().default("requested"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({ providerDateIdx: index("animal_appointments_provider_date_idx").on(t.providerId, t.appointmentAt) }));
