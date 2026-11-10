import { NextRequest, NextResponse } from "next/server";
import { createAppointment } from "@/features/animals/actions/appointment.actions";
export async function POST(request: NextRequest) {
  try { const result = await createAppointment(await request.json()); return NextResponse.json(result, { status: result.success ? 201 : 400 }); }
  catch (error) { console.error(error); return NextResponse.json({ success: false, message: "Unable to request appointment" }, { status: 500 }); }
}
