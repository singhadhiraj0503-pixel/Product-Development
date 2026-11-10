import { randomUUID } from "crypto";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { ceDecks, ceIdeas, ceIntegrations, ceRunEvents, ceRuns, ceSlides, ceWorkflows } from "@/lib/db/schema/content-engine.schema";
import type { GeneratedDeck, RunEventInput } from "../types/content-engine.types";

export async function createWorkflow(ownerId: string, input: any) {
  const id = randomUUID();
  const [row] = await db.insert(ceWorkflows).values({ id, ownerId, ...input }).returning();
  return row;
}
export async function listWorkflows(ownerId: string) {
  return db.select().from(ceWorkflows).where(eq(ceWorkflows.ownerId, ownerId)).orderBy(desc(ceWorkflows.updatedAt));
}
export async function getWorkflow(ownerId: string, id: string) {
  const [row] = await db.select().from(ceWorkflows).where(and(eq(ceWorkflows.ownerId, ownerId), eq(ceWorkflows.id, id))).limit(1);
  if (!row) throw new Error("NOT_FOUND");
  return row;
}
export async function patchWorkflow(ownerId: string, id: string, patch: any) {
  await getWorkflow(ownerId, id);
  const [row] = await db.update(ceWorkflows).set({ ...patch, updatedAt: new Date() }).where(and(eq(ceWorkflows.ownerId, ownerId), eq(ceWorkflows.id, id))).returning();
  return row;
}
export async function deleteWorkflow(ownerId: string, id: string) {
  await getWorkflow(ownerId, id);
  await db.delete(ceWorkflows).where(and(eq(ceWorkflows.ownerId, ownerId), eq(ceWorkflows.id, id)));
  return { id };
}
export async function createDeck(ownerId: string, input: any) {
  const id = randomUUID();
  const [row] = await db.insert(ceDecks).values({ id, ownerId, ...input }).returning();
  return row;
}
export async function listDecks(ownerId: string) {
  return db.select().from(ceDecks).where(eq(ceDecks.ownerId, ownerId)).orderBy(desc(ceDecks.updatedAt));
}
export async function getDeck(ownerId: string, id: string) {
  const [deck] = await db.select().from(ceDecks).where(and(eq(ceDecks.ownerId, ownerId), eq(ceDecks.id, id))).limit(1);
  if (!deck) throw new Error("NOT_FOUND");
  const slides = await db.select().from(ceSlides).where(eq(ceSlides.deckId, id)).orderBy(ceSlides.position);
  return { ...deck, slides };
}
export async function updateDeck(ownerId: string, id: string, patch: any) {
  await getDeck(ownerId, id);
  const { slides, ...deckPatch } = patch;
  const [deck] = await db.update(ceDecks).set({ ...deckPatch, updatedAt: new Date() }).where(and(eq(ceDecks.ownerId, ownerId), eq(ceDecks.id, id))).returning();
  if (slides) {
    await db.delete(ceSlides).where(eq(ceSlides.deckId, id));
    if (slides.length) await db.insert(ceSlides).values(slides.map((s: any) => ({ id: s.id || randomUUID(), deckId: id, ...s })));
  }
  return getDeck(ownerId, id);
}
export async function deleteDeck(ownerId: string, id: string) {
  await getDeck(ownerId, id);
  await db.delete(ceDecks).where(and(eq(ceDecks.ownerId, ownerId), eq(ceDecks.id, id)));
  return { id };
}
export async function createIdea(ownerId: string, input: any) {
  const id = randomUUID();
  const [row] = await db.insert(ceIdeas).values({ id, ownerId, ...input }).returning();
  return row;
}
export async function createRun(ownerId: string, input: any) {
  const id = randomUUID();
  const [row] = await db.insert(ceRuns).values({ id, ownerId, ...input, input }).returning();
  return row;
}
export async function updateRun(id: string, patch: any) {
  const [row] = await db.update(ceRuns).set(patch).where(eq(ceRuns.id, id)).returning();
  return row;
}
export async function addRunEvent(runId: string, event: RunEventInput) {
  const [row] = await db.insert(ceRunEvents).values({ id: randomUUID(), runId, ...event }).returning();
  return row;
}
export async function getRun(ownerId: string, id: string) {
  const [run] = await db.select().from(ceRuns).where(and(eq(ceRuns.ownerId, ownerId), eq(ceRuns.id, id))).limit(1);
  if (!run) throw new Error("NOT_FOUND");
  const events = await db.select().from(ceRunEvents).where(eq(ceRunEvents.runId, id)).orderBy(ceRunEvents.createdAt);
  return { ...run, events };
}
export async function saveGeneratedSlides(deckId: string, generated: GeneratedDeck) {
  await db.delete(ceSlides).where(eq(ceSlides.deckId, deckId));
  if (generated.slides.length) {
    await db.insert(ceSlides).values(generated.slides.map(s => ({ id: randomUUID(), deckId, ...s })));
  }
  const [deck] = await db.update(ceDecks).set({ title: generated.title, topic: generated.topic, status: "ready", updatedAt: new Date() }).where(eq(ceDecks.id, deckId)).returning();
  return deck;
}
export async function setDeckStatus(ownerId: string, deckId: string, status: "approved" | "rejected" | "awaiting_approval" | "published") {
  await getDeck(ownerId, deckId);
  const [deck] = await db.update(ceDecks).set({ status, ...(status === "approved" ? { approvedAt: new Date() } : {}), ...(status === "published" ? { publishedAt: new Date() } : {}), updatedAt: new Date() }).where(eq(ceDecks.id, deckId)).returning();
  return deck;
}
export async function saveIntegration(ownerId: string, provider: string, config: Record<string, unknown>, externalAccountId?: string) {
  const [row] = await db.insert(ceIntegrations).values({ id: randomUUID(), ownerId, provider, config, externalAccountId }).returning();
  return row;
}
