import { NextRequest, NextResponse } from "next/server";
import { createEmergencyRequest } from "@/features/animals/actions/emergency.actions";
import { db } from "@/lib/db";
import { emergencyRequests } from "@/lib/db/schema/animals";
import { desc, eq } from "drizzle-orm";
export async function POST(request: NextRequest) {
  try { const result = await createEmergencyRequest(await request.json()); return NextResponse.json(result, { status: result.success ? 201 : 400 }); }
  catch (error) { console.error(error); return NextResponse.json({ success: false, message: "Unable to record emergency request" }, { status: 500 }); }
}
// Demo/admin dashboard endpoint. Add authorization before exposing request records publicly.
export async function GET() {
  try { const data = await db.select().from(emergencyRequests).orderBy(desc(emergencyRequests.createdAt)).limit(50); return NextResponse.json({ success: true, data }); }
  catch (error) { console.error(error); return NextResponse.json({ success: false, message: "Unable to fetch emergency requests" }, { status: 500 }); }
}
