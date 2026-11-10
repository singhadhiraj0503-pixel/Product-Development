import { z } from "zod";
export const emergencySchema = z.object({
  providerId: z.string().uuid().optional(), ownerName: z.string().min(2).max(140), phone: z.string().min(7).max(30),
  petName: z.string().max(100).optional(), species: z.string().min(1), symptoms: z.array(z.string().min(1)).min(1).max(12),
  description: z.string().max(2000).optional(), address: z.string().min(5), latitude: z.number().optional(), longitude: z.number().optional(),
});
