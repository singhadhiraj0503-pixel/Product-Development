import { NextRequest } from "next/server";
import { getModuleBySlug } from "@/features/education/services/education.service";
import { fail, handleRouteError, ok } from "@/features/education/lib/http";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ moduleSlug: string }> }) {
  try {
    const { moduleSlug } = await params;
    const module = await getModuleBySlug(moduleSlug);
    if (!module) return fail("Curriculum module not found", 404);
    return ok(module);
  } catch (error) { return handleRouteError(error); }
}
