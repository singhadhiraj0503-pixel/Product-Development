"use server";

import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  educationApplications, educationCohorts, educationTracks,
  educationSyllabusLeads, educationEnrollments,
} from "@/lib/db/schema/education.schema";
import {
  syllabusLeadSchema, applicationSchema, enrollmentSchema,
} from "../schemas/education.schema";
import { getCurrentEducationUser, requireEducationUser } from "../lib/auth";

export async function requestSyllabusAction(input: unknown) {
  const parsed = syllabusLeadSchema.safeParse(input);
  if (!parsed.success) return { success: false as const, message: "Please check the form fields", errors: parsed.error.flatten() };
  const user = await getCurrentEducationUser();
  const [lead] = await db.insert(educationSyllabusLeads).values({
    ...parsed.data,
    userId: user?.id,
  }).returning({ id: educationSyllabusLeads.id });
  return { success: true as const, data: lead };
}

export async function submitEducationApplicationAction(input: unknown) {
  const parsed = applicationSchema.safeParse(input);
  if (!parsed.success) return { success: false as const, message: "Please check the form fields", errors: parsed.error.flatten() };
  const user = await getCurrentEducationUser();
  const [cohort] = await db.select().from(educationCohorts)
    .where(and(eq(educationCohorts.code, parsed.data.cohortCode), eq(educationCohorts.isPublished, true))).limit(1);
  if (!cohort) return { success: false as const, message: "The selected cohort is not accepting applications." };
  if (cohort.applicationDeadline && cohort.applicationDeadline < new Date()) {
    return { success: false as const, message: "The application deadline has passed." };
  }
  const [track] = await db.select().from(educationTracks)
    .where(and(eq(educationTracks.slug, parsed.data.trackSlug), eq(educationTracks.isActive, true))).limit(1);
  if (!track) return { success: false as const, message: "The selected tuition track is unavailable." };

  const [application] = await db.insert(educationApplications).values({
    ...parsed.data,
    cohortId: cohort.id,
    trackId: track.id,
    userId: user?.id,
  }).returning({ id: educationApplications.id, status: educationApplications.status });
  return { success: true as const, data: application };
}

export async function createEducationEnrollmentAction(input: unknown) {
  const parsed = enrollmentSchema.safeParse(input);
  if (!parsed.success) return { success: false as const, message: "Please check the form fields", errors: parsed.error.flatten() };
  const user = await requireEducationUser();
  const [cohort] = await db.select().from(educationCohorts)
    .where(and(eq(educationCohorts.code, parsed.data.cohortCode), eq(educationCohorts.isPublished, true))).limit(1);
  const [track] = await db.select().from(educationTracks)
    .where(and(eq(educationTracks.slug, parsed.data.trackSlug), eq(educationTracks.isActive, true))).limit(1);
  if (!cohort || !track) return { success: false as const, message: "Cohort or tuition track not found." };
  if (cohort.filledSeats >= cohort.totalSeats) return { success: false as const, message: "This cohort is currently full." };

  const [enrollment] = await db.insert(educationEnrollments).values({
    userId: user.id,
    applicationId: parsed.data.applicationId,
    cohortId: cohort.id,
    trackId: track.id,
    fullName: parsed.data.fullName,
    email: parsed.data.email,
    status: "pending_payment",
  }).returning({ id: educationEnrollments.id, status: educationEnrollments.status });
  // Payment is intentionally not marked paid here. Create a payment-provider order server-side.
  return { success: true as const, data: enrollment, message: "Enrollment created. Complete payment through the configured payment provider." };
}
