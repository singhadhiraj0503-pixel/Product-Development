import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { emergencyResources } from "@/lib/db/schema/animals";
import { and, eq } from "drizzle-orm";
export async function GET(request: NextRequest) {
  try { const city = request.nextUrl.searchParams.get("city") ?? "Bengaluru"; const data = await db.select().from(emergencyResources).where(and(eq(emergencyResources.city, city))); return NextResponse.json({ success: true, data, notice: "Availability is demo data unless verified through a live provider integration." }); }
  catch (error) { console.error(error); return NextResponse.json({ success: false, message: "Unable to fetch resources" }, { status: 500 }); }
}
