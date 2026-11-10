import { z } from "zod";
export const businessApplicationSchema = z.object({
  facilityName: z.string().min(2).max(180), entityType: z.enum(["clinic", "hospital", "specialty_hospital", "ngo", "rescue", "sanctuary", "diagnostic", "ambulance"]),
  headVeterinarian: z.string().min(2).max(160), councilRegistrationNo: z.string().max(100).optional(),
  phone: z.string().min(7).max(30), email: z.string().email(), addressLine: z.string().min(3), locality: z.string().min(2),
  city: z.string().min(2), state: z.string().min(2), postalCode: z.string().optional(), capabilities: z.array(z.string()).default([]), documents: z.array(z.string().url()).default([]),
});
