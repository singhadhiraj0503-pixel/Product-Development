import {
  pgTable, uuid, varchar, text, integer, boolean, timestamp, jsonb,
  date, numeric, index, uniqueIndex,
} from "drizzle-orm/pg-core";

export const educationCohorts = pgTable("education_cohorts", {
  id: uuid("id").defaultRandom().primaryKey(),
  code: varchar("code", { length: 40 }).notNull().unique(),
  name: varchar("name", { length: 180 }).notNull(),
  status: varchar("status", { length: 24 }).notNull().default("upcoming"),
  startDate: date("start_date"),
  applicationDeadline: timestamp("application_deadline", { withTimezone: true }),
  totalSeats: integer("total_seats").notNull().default(0),
  filledSeats: integer("filled_seats").notNull().default(0),
  timezone: varchar("timezone", { length: 80 }).notNull().default("Asia/Kolkata"),
  summary: text("summary"),
  isPublished: boolean("is_published").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [index("education_cohorts_status_idx").on(t.status)]);

export const educationTracks = pgTable("education_tracks", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: varchar("slug", { length: 80 }).notNull().unique(),
  name: varchar("name", { length: 160 }).notNull(),
  audience: varchar("audience", { length: 160 }),
  description: text("description"),
  priceCents: integer("price_cents").notNull(),
  currency: varchar("currency", { length: 3 }).notNull().default("USD"),
  billingLabel: varchar("billing_label", { length: 160 }),
  features: jsonb("features").$type<string[]>().notNull().default([]),
  badge: varchar("badge", { length: 100 }),
  isRecommended: boolean("is_recommended").notNull().default(false),
  isActive: boolean("is_active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const educationWeeks = pgTable("education_weeks", {
  id: uuid("id").defaultRandom().primaryKey(),
  weekNumber: integer("week_number").notNull(),
  title: varchar("title", { length: 180 }).notNull(),
  focus: varchar("focus", { length: 100 }),
  summary: text("summary").notNull(),
  outcomes: jsonb("outcomes").$type<string[]>().notNull().default([]),
  milestone: varchar("milestone", { length: 200 }),
  sortOrder: integer("sort_order").notNull().default(0),
  isPublished: boolean("is_published").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [uniqueIndex("education_weeks_number_uq").on(t.weekNumber)]);

export const educationModules = pgTable("education_modules", {
  id: uuid("id").defaultRandom().primaryKey(),
  weekId: uuid("week_id").notNull().references(() => educationWeeks.id, { onDelete: "cascade" }),
  slug: varchar("slug", { length: 180 }).notNull().unique(),
  title: varchar("title", { length: 220 }).notNull(),
  category: varchar("category", { length: 100 }),
  summary: text("summary").notNull(),
  description: text("description"),
  durationHours: numeric("duration_hours", { precision: 5, scale: 1 }),
  moduleCountLabel: varchar("module_count_label", { length: 100 }),
  codeSampleTitle: varchar("code_sample_title", { length: 180 }),
  codeSampleLanguage: varchar("code_sample_language", { length: 40 }),
  codeSample: text("code_sample"),
  outcomes: jsonb("outcomes").$type<string[]>().notNull().default([]),
  tools: jsonb("tools").$type<string[]>().notNull().default([]),
  sortOrder: integer("sort_order").notNull().default(0),
  isPublished: boolean("is_published").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [index("education_modules_week_idx").on(t.weekId)]);

export const educationLessons = pgTable("education_lessons", {
  id: uuid("id").defaultRandom().primaryKey(),
  moduleId: uuid("module_id").notNull().references(() => educationModules.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 220 }).notNull(),
  summary: text("summary"),
  lessonType: varchar("lesson_type", { length: 40 }).notNull().default("lesson"),
  durationMinutes: integer("duration_minutes"),
  content: text("content"),
  resourceUrl: text("resource_url"),
  githubUrl: text("github_url"),
  sortOrder: integer("sort_order").notNull().default(0),
  isPreview: boolean("is_preview").notNull().default(false),
  isPublished: boolean("is_published").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [index("education_lessons_module_idx").on(t.moduleId)]);

export const educationProjects = pgTable("education_projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: varchar("slug", { length: 160 }).notNull().unique(),
  projectCode: varchar("project_code", { length: 40 }),
  title: varchar("title", { length: 220 }).notNull(),
  category: varchar("category", { length: 100 }),
  summary: text("summary").notNull(),
  description: text("description"),
  problemStatement: text("problem_statement"),
  imageUrl: text("image_url"),
  repositoryUrl: text("repository_url"),
  demoUrl: text("demo_url"),
  version: varchar("version", { length: 40 }),
  technologies: jsonb("technologies").$type<string[]>().notNull().default([]),
  learningOutcomes: jsonb("learning_outcomes").$type<string[]>().notNull().default([]),
  sortOrder: integer("sort_order").notNull().default(0),
  isPublished: boolean("is_published").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const educationTechStack = pgTable("education_tech_stack", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  category: varchar("category", { length: 100 }),
  description: text("description"),
  websiteUrl: text("website_url"),
  iconKey: varchar("icon_key", { length: 80 }),
  sortOrder: integer("sort_order").notNull().default(0),
  isPublished: boolean("is_published").notNull().default(true),
});

export const educationSyllabusLeads = pgTable("education_syllabus_leads", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id"),
  fullName: varchar("full_name", { length: 180 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  background: varchar("background", { length: 160 }),
  cohortCode: varchar("cohort_code", { length: 40 }),
  consentToContact: boolean("consent_to_contact").notNull().default(true),
  source: varchar("source", { length: 100 }).default("education_landing_page"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [index("education_syllabus_leads_email_idx").on(t.email)]);

export const educationApplications = pgTable("education_applications", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id"),
  cohortId: uuid("cohort_id").references(() => educationCohorts.id, { onDelete: "set null" }),
  trackId: uuid("track_id").references(() => educationTracks.id, { onDelete: "set null" }),
  fullName: varchar("full_name", { length: 180 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 40 }),
  background: varchar("background", { length: 180 }),
  experienceLevel: varchar("experience_level", { length: 80 }),
  motivation: text("motivation"),
  portfolioUrl: text("portfolio_url"),
  status: varchar("status", { length: 30 }).notNull().default("submitted"),
  adminNotes: text("admin_notes"),
  reviewedBy: text("reviewed_by"),
  reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  index("education_applications_user_idx").on(t.userId),
  index("education_applications_status_idx").on(t.status),
  index("education_applications_email_idx").on(t.email),
]);

export const educationEnrollments = pgTable("education_enrollments", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id"),
  applicationId: uuid("application_id").references(() => educationApplications.id, { onDelete: "set null" }),
  cohortId: uuid("cohort_id").notNull().references(() => educationCohorts.id),
  trackId: uuid("track_id").notNull().references(() => educationTracks.id),
  fullName: varchar("full_name", { length: 180 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  status: varchar("status", { length: 30 }).notNull().default("pending_payment"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  index("education_enrollments_user_idx").on(t.userId),
  index("education_enrollments_cohort_idx").on(t.cohortId),
]);

export const educationPayments = pgTable("education_payments", {
  id: uuid("id").defaultRandom().primaryKey(),
  enrollmentId: uuid("enrollment_id").notNull().references(() => educationEnrollments.id, { onDelete: "cascade" }),
  provider: varchar("provider", { length: 40 }).notNull(),
  providerPaymentId: varchar("provider_payment_id", { length: 220 }),
  amountCents: integer("amount_cents").notNull(),
  currency: varchar("currency", { length: 3 }).notNull(),
  status: varchar("status", { length: 30 }).notNull().default("created"),
  paidAt: timestamp("paid_at", { withTimezone: true }),
  rawMetadata: jsonb("raw_metadata"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [index("education_payments_enrollment_idx").on(t.enrollmentId)]);

export const educationTestimonials = pgTable("education_testimonials", {
  id: uuid("id").defaultRandom().primaryKey(),
  displayName: varchar("display_name", { length: 140 }).notNull(),
  roleLabel: varchar("role_label", { length: 160 }),
  cohortLabel: varchar("cohort_label", { length: 80 }),
  quote: text("quote").notNull(),
  rating: integer("rating").notNull().default(5),
  avatarUrl: text("avatar_url"),
  outcomeLabel: varchar("outcome_label", { length: 180 }),
  sortOrder: integer("sort_order").notNull().default(0),
  isPublished: boolean("is_published").notNull().default(false),
});

export const educationFaqs = pgTable("education_faqs", {
  id: uuid("id").defaultRandom().primaryKey(),
  question: varchar("question", { length: 400 }).notNull(),
  answer: text("answer").notNull(),
  category: varchar("category", { length: 100 }),
  sortOrder: integer("sort_order").notNull().default(0),
  isPublished: boolean("is_published").notNull().default(true),
});
