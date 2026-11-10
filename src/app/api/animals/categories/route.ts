import { NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { animalCategories } from "@/lib/db/schema/animals";
export async function GET() {
  try { const data = await db.select().from(animalCategories).where(eq(animalCategories.isActive, true)).orderBy(asc(animalCategories.name)); return NextResponse.json({ success: true, data }); }
  catch (error) { console.error(error); return NextResponse.json({ success: false, message: "Unable to fetch categories" }, { status: 500 }); }
}
