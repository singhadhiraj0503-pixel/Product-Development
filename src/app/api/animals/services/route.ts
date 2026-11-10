import { NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { animalServices } from "@/lib/db/schema/animals";
export async function GET() {
  try { const data = await db.select().from(animalServices).where(eq(animalServices.isActive, true)).orderBy(asc(animalServices.name)); return NextResponse.json({ success: true, data }); }
  catch (error) { console.error(error); return NextResponse.json({ success: false, message: "Unable to fetch services" }, { status: 500 }); }
}
