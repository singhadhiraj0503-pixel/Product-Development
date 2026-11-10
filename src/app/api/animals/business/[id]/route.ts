import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { businessApplications } from "@/lib/db/schema/animals";
import { eq } from "drizzle-orm";
// Intended for an authenticated applicant/admin view. Add ownership/role checks before production use.
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { const { id } = await params; const [application] = await db.select().from(businessApplications).where(eq(businessApplications.id, id)).limit(1); if (!application) return NextResponse.json({ success: false, message: "Application not found" }, { status: 404 }); return NextResponse.json({ success: true, data: application }); }
  catch (error) { console.error(error); return NextResponse.json({ success: false, message: "Unable to fetch application" }, { status: 500 }); }
}
