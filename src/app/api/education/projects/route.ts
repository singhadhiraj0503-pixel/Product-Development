import { NextResponse } from "next/server";
import { getProjects, getTechStack } from "@/features/education/services/education.service";
import { handleRouteError } from "@/features/education/lib/http";

export async function GET() {
  try {
    const [projects, technologyStack] = await Promise.all([getProjects(), getTechStack()]);
    return NextResponse.json({ success: true, data: { projects, technologyStack } });
  } catch (error) { return handleRouteError(error); }
}
