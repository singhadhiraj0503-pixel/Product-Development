import { NextRequest, NextResponse } from "next/server";
import { searchProviders } from "@/features/animals/actions/provider.actions";
import { db } from "@/lib/db";
import { providers } from "@/lib/db/schema/animals";
import { providerCreateSchema } from "@/features/animals/schemas/provider.schema";

export async function GET(request: NextRequest) {
  try {
    const result = await searchProviders(Object.fromEntries(request.nextUrl.searchParams));
    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (error) {
    console.error("GET /animals/providers", error);
    return NextResponse.json({ success: false, message: "Unable to fetch providers" }, { status: 500 });
  }
}

// Keep provider creation restricted to trusted/admin users before production use.
export async function POST(request: NextRequest) {
  try {
    const parsed = providerCreateSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ success: false, errors: parsed.error.flatten() }, { status: 400 });
    const [provider] = await db.insert(providers).values({ ...parsed.data, status: "pending", verificationStatus: "pending" }).returning();
    return NextResponse.json({ success: true, data: provider }, { status: 201 });
  } catch (error) {
    console.error("POST /animals/providers", error);
    return NextResponse.json({ success: false, message: "Unable to create provider" }, { status: 500 });
  }
}
