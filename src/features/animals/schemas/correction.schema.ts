import { z } from "zod";
export const correctionSchema = z.object({
  providerId: z.string().uuid().optional(), submitterName: z.string().min(2).max(140), submitterEmail: z.string().email().optional(),
  relationship: z.string().max(60).optional(), fieldToCorrect: z.string().min(2).max(100), currentValue: z.string().max(1000).optional(),
  suggestedValue: z.string().min(2).max(2000), reason: z.string().max(2000).optional(),
});
