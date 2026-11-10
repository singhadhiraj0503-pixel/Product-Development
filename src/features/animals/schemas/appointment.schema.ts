import { z } from "zod";
export const appointmentSchema = z.object({
  providerId: z.string().uuid(), petName: z.string().min(1).max(100), species: z.string().min(1),
  ownerName: z.string().min(2).max(140), ownerPhone: z.string().min(7).max(30), ownerEmail: z.string().email().optional(),
  appointmentAt: z.coerce.date().refine((d) => d.getTime() > Date.now(), "Appointment must be in the future"),
  reason: z.string().max(2000).optional(),
});
