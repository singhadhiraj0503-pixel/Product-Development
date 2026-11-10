import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { emergencyRequests } from "@/lib/db/schema/animals";
import { eq } from "drizzle-orm";
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { const { id } = await params; const [item] = await db.select().from(emergencyRequests).where(eq(emergencyRequests.id, id)).limit(1); if (!item) return NextResponse.json({ success: false, message: "Request not found" }, { status: 404 }); return NextResponse.json({ success: true, data: item }); }
  catch (error) { console.error(error); return NextResponse.json({ success: false, message: "Unable to fetch request" }, { status: 500 }); }
}
