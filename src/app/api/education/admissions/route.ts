import { NextResponse } from "next/server";
import { getAdmissionsData } from "@/features/education/services/education.service";
import { handleRouteError } from "@/features/education/lib/http";

export async function GET() {
  try { return NextResponse.json({ success: true, data: await getAdmissionsData() }); }
  catch (error) { return handleRouteError(error); }
}
