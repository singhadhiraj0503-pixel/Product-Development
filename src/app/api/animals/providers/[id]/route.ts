import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { providers, veterinarians, providerServices } from "@/lib/db/schema/animals";
import { eq, and } from "drizzle-orm";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const provider = await db.query.providers.findFirst({ where: and(eq(providers.id, id), eq(providers.status, "active")) });
    if (!provider) return NextResponse.json({ success: false, message: "Provider not found" }, { status: 404 });
    const [doctors, services] = await Promise.all([
      db.select().from(veterinarians).where(eq(veterinarians.providerId, id)),
      db.select().from(providerServices).where(eq(providerServices.providerId, id)),
    ]);
    return NextResponse.json({ success: true, data: { ...provider, veterinarians: doctors, services } });
  } catch (error) {
    console.error("GET /animals/providers/[id]", error);
    return NextResponse.json({ success: false, message: "Unable to fetch provider" }, { status: 500 });
  }
}
