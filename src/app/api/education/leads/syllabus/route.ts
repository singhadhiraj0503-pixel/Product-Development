import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { educationSyllabusLeads } from "@/lib/db/schema/education.schema";
import { syllabusLeadSchema } from "@/features/education/schemas/education.schema";
import { getCurrentEducationUser } from "@/features/education/lib/auth";
import { fail, handleRouteError, ok } from "@/features/education/lib/http";

export async function POST(request: NextRequest) {
  try {
    const parsed = syllabusLeadSchema.safeParse(await request.json());
    if (!parsed.success) return fail("Validation failed", 422, parsed.error.flatten());
    const user = await getCurrentEducationUser();
    const [lead] = await db.insert(educationSyllabusLeads).values({
      ...parsed.data,
      userId: user?.id,
    }).returning({ id: educationSyllabusLeads.id, createdAt: educationSyllabusLeads.createdAt });
    return ok(lead, 201);
  } catch (error) { return handleRouteError(error); }
}
