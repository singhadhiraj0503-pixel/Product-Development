"use server";

import { revalidatePath } from "next/cache";
import { requireContentEngineUser } from "../lib/content-engine-auth";
import { actionError } from "../lib/content-engine-response";
import { createWorkflowSchema, createDeckSchema, updateDeckSchema, updateWorkflowSchema } from "../schemas/content-engine.schemas";
import * as service from "../services/content-engine.service";

export async function createWorkflowAction(input: unknown) {
  try { const user = await requireContentEngineUser(); const data = createWorkflowSchema.parse(input); const result = await service.createWorkflow(user.id, data); revalidatePath("/content-engine/workflow"); return { success: true, data: result }; }
  catch (e) { return actionError(e); }
}
export async function updateWorkflowAction(id: string, input: unknown) {
  try { const user = await requireContentEngineUser(); const data = updateWorkflowSchema.parse(input); const result = await service.patchWorkflow(user.id, id, data); revalidatePath("/content-engine/workflow"); return { success: true, data: result }; }
  catch (e) { return actionError(e); }
}
export async function createDeckAction(input: unknown) {
  try { const user = await requireContentEngineUser(); const data = createDeckSchema.parse(input); const result = await service.createDeck(user.id, data); revalidatePath("/content-engine/carousel"); return { success: true, data: result }; }
  catch (e) { return actionError(e); }
}
export async function updateDeckAction(id: string, input: unknown) {
  try { const user = await requireContentEngineUser(); const data = updateDeckSchema.parse(input); const result = await service.updateDeck(user.id, id, data); revalidatePath(`/content-engine/carousel/${id}`); return { success: true, data: result }; }
  catch (e) { return actionError(e); }
}
