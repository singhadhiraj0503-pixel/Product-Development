import { pgTable, uuid, integer, text, timestamp, varchar, uniqueIndex } from "drizzle-orm/pg-core";
import { providers } from "./provider.schema";

export const providerReviews = pgTable("animal_provider_reviews", {
  id: uuid("id").defaultRandom().primaryKey(),
  providerId: uuid("provider_id").notNull().references(() => providers.id, { onDelete: "cascade" }),
  userId: text("user_id"),
  reviewerName: varchar("reviewer_name", { length: 140 }).notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  status: varchar("status", { length: 20 }).notNull().default("published"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({ userProviderUnique: uniqueIndex("animal_review_user_provider_unique").on(t.userId, t.providerId) }));
