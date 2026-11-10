import { NextRequest } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { educationCohorts, educationTracks, educationEnrollments, educationApplications } from "@/lib/db/schema/education.schema";
import { enrollmentSchema } from "@/features/education/schemas/education.schema";
import { requireEducationUser } from "@/features/education/lib/auth";
import { fail, handleRouteError, ok } from "@/features/education/lib/http";

export async function POST(request: NextRequest) {
  try {
    const user = await requireEducationUser();
    const parsed = enrollmentSchema.safeParse(await request.json());
    if (!parsed.success) return fail("Validation failed", 422, parsed.error.flatten());
    const [cohort] = await db.select().from(educationCohorts)
      .where(and(eq(educationCohorts.code, parsed.data.cohortCode), eq(educationCohorts.isPublished, true))).limit(1);
    const [track] = await db.select().from(educationTracks)
      .where(and(eq(educationTracks.slug, parsed.data.trackSlug), eq(educationTracks.isActive, true))).limit(1);
    if (!cohort || !track) return fail("Cohort or track not found", 404);
    if (cohort.filledSeats >= cohort.totalSeats) return fail("This cohort is full", 409);

    if (parsed.data.applicationId) {
      const [application] = await db.select().from(educationApplications)
        .where(and(eq(educationApplications.id, parsed.data.applicationId), eq(educationApplications.userId, user.id))).limit(1);
      if (!application || !["accepted", "shortlisted"].includes(application.status)) {
        return fail("An accepted or shortlisted application is required for this enrollment", 403);
      }
    }

    const [enrollment] = await db.insert(educationEnrollments).values({
      userId: user.id, applicationId: parsed.data.applicationId, cohortId: cohort.id, trackId: track.id,
      fullName: parsed.data.fullName, email: parsed.data.email, status: "pending_payment",
    }).returning({ id: educationEnrollments.id, status: educationEnrollments.status });
    return ok({ ...enrollment, paymentRequired: true }, 201);
  } catch (error) { return handleRouteError(error); }
}
