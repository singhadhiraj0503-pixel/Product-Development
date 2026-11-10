import { NextRequest } from "next/server";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { educationApplications, educationCohorts, educationTracks } from "@/lib/db/schema/education.schema";
import { applicationSchema } from "@/features/education/schemas/education.schema";
import { getCurrentEducationUser } from "@/features/education/lib/auth";
import { fail, handleRouteError, ok } from "@/features/education/lib/http";

export async function POST(request: NextRequest) {
  try {
    const parsed = applicationSchema.safeParse(await request.json());
    if (!parsed.success) return fail("Validation failed", 422, parsed.error.flatten());
    const user = await getCurrentEducationUser();
    const [cohort] = await db.select().from(educationCohorts)
      .where(and(eq(educationCohorts.code, parsed.data.cohortCode), eq(educationCohorts.isPublished, true))).limit(1);
    if (!cohort) return fail("Cohort not found or not published", 404);
    if (cohort.applicationDeadline && cohort.applicationDeadline < new Date()) return fail("Application deadline has passed", 409);
    const [track] = await db.select().from(educationTracks)
      .where(and(eq(educationTracks.slug, parsed.data.trackSlug), eq(educationTracks.isActive, true))).limit(1);
    if (!track) return fail("Tuition track not found", 404);

    const [application] = await db.insert(educationApplications).values({
      ...parsed.data, cohortId: cohort.id, trackId: track.id, userId: user?.id,
    }).returning({ id: educationApplications.id, status: educationApplications.status, createdAt: educationApplications.createdAt });
    return ok(application, 201);
  } catch (error) { return handleRouteError(error); }
}

export async function GET() {
  try {
    const user = await getCurrentEducationUser();
    if (!user) return fail("Authentication required", 401);
    const applications = await db.select().from(educationApplications)
      .where(eq(educationApplications.userId, user.id))
      .orderBy(desc(educationApplications.createdAt));
    return ok(applications);
  } catch (error) { return handleRouteError(error); }
}
