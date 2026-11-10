import { z } from "zod";

const optionalUrl = z.string().url().optional().or(z.literal(""));

export const syllabusLeadSchema = z.object({
  fullName: z.string().trim().min(2).max(180),
  email: z.string().trim().email().max(255),
  background: z.string().trim().max(160).optional(),
  cohortCode: z.string().trim().max(40).optional(),
  consentToContact: z.boolean().default(true),
  source: z.string().trim().max(100).optional(),
});

export const applicationSchema = z.object({
  cohortCode: z.string().trim().min(1).max(40),
  trackSlug: z.string().trim().min(1).max(80),
  fullName: z.string().trim().min(2).max(180),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(40).optional(),
  background: z.string().trim().max(180).optional(),
  experienceLevel: z.string().trim().max(80).optional(),
  motivation: z.string().trim().max(5000).optional(),
  portfolioUrl: optionalUrl,
});

export const enrollmentSchema = z.object({
  applicationId: z.string().uuid().optional(),
  cohortCode: z.string().trim().min(1).max(40),
  trackSlug: z.string().trim().min(1).max(80),
  fullName: z.string().trim().min(2).max(180),
  email: z.string().trim().email().max(255),
});

export const reviewApplicationSchema = z.object({
  status: z.enum(["under_review", "shortlisted", "accepted", "rejected", "waitlisted"]),
  adminNotes: z.string().trim().max(5000).optional(),
});

export type SyllabusLeadInput = z.infer<typeof syllabusLeadSchema>;
export type ApplicationInput = z.infer<typeof applicationSchema>;
export type EnrollmentInput = z.infer<typeof enrollmentSchema>;
