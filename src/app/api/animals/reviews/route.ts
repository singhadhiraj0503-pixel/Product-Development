import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { providerReviews, providers } from "@/lib/db/schema/animals";
import { z } from "zod";
import { eq, sql } from "drizzle-orm";
const schema = z.object({ providerId: z.string().uuid(), reviewerName: z.string().min(2), rating: z.number().int().min(1).max(5), comment: z.string().max(2000).optional() });
export async function POST(request: NextRequest) {
  try {
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ success: false, errors: parsed.error.flatten() }, { status: 400 });
    const [review] = await db.insert(providerReviews).values(parsed.data).returning();
    await db.update(providers).set({ averageRating: sql`(select coalesce(round(avg(${providerReviews.rating})::numeric, 1), 0) from ${providerReviews} where ${providerReviews.providerId} = ${parsed.data.providerId} and ${providerReviews.status} = 'published')`, reviewCount: sql`(select count(*)::int from ${providerReviews} where ${providerReviews.providerId} = ${parsed.data.providerId} and ${providerReviews.status} = 'published')`, updatedAt: new Date() }).where(eq(providers.id, parsed.data.providerId));
    return NextResponse.json({ success: true, data: review }, { status: 201 });
  } catch (error) { console.error(error); return NextResponse.json({ success: false, message: "Unable to submit review" }, { status: 500 }); }
}
