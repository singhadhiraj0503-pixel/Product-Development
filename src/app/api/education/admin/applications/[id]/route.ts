import { NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { educationApplications } from "@/lib/db/schema/education.schema";
import { reviewApplicationSchema } from "@/features/education/schemas/education.schema";
import { requireEducationAdmin } from "@/features/education/lib/auth";
import { fail, handleRouteError, ok } from "@/features/education/lib/http";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await requireEducationAdmin();
    const { id } = await params;
    const parsed = reviewApplicationSchema.safeParse(await request.json());
    if (!parsed.success) return fail("Validation failed", 422, parsed.error.flatten());
    const [updated] = await db.update(educationApplications).set({
      status: parsed.data.status,
      adminNotes: parsed.data.adminNotes,
      reviewedBy: admin.id,
      reviewedAt: new Date(),
      updatedAt: new Date(),
    }).where(eq(educationApplications.id, id))
      .returning({ id: educationApplications.id, status: educationApplications.status, reviewedAt: educationApplications.reviewedAt });
    if (!updated) return fail("Application not found", 404);
    return ok(updated);
  } catch (error) { return handleRouteError(error); }
}
