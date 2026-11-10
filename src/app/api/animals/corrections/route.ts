import { NextRequest, NextResponse } from "next/server";
import { submitProviderCorrection } from "@/features/animals/actions/correction.actions";
export async function POST(request: NextRequest) {
  try { const result = await submitProviderCorrection(await request.json()); return NextResponse.json(result, { status: result.success ? 201 : 400 }); }
  catch (error) { console.error(error); return NextResponse.json({ success: false, message: "Unable to submit correction" }, { status: 500 }); }
}
