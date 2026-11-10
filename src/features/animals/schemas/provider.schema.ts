import { z } from "zod";

export const providerSearchSchema = z.object({
  q: z.string().trim().optional(), city: z.string().trim().optional(), locality: z.string().trim().optional(),
  providerType: z.string().optional(), service: z.string().optional(), species: z.string().optional(),
  verified: z.enum(["true", "false"]).optional(), emergency: z.enum(["true", "false"]).optional(),
  open24Hours: z.enum(["true", "false"]).optional(), minRating: z.coerce.number().min(0).max(5).optional(),
  sort: z.enum(["proximity", "rating", "fee-low", "fee-high", "name"]).default("proximity"),
  latitude: z.coerce.number().optional(), longitude: z.coerce.number().optional(),
  page: z.coerce.number().int().min(1).default(1), limit: z.coerce.number().int().min(1).max(50).default(8),
});

export const providerCreateSchema = z.object({
  name: z.string().min(2).max(180), slug: z.string().min(2).max(200).regex(/^[a-z0-9-]+$/),
  providerType: z.enum(["clinic", "hospital", "boarding", "diagnostic", "ambulance", "ngo", "sanctuary"]),
  description: z.string().max(3000).optional(), phone: z.string().min(7).max(30), email: z.string().email().optional(), website: z.string().url().optional(),
  addressLine: z.string().min(3), locality: z.string().min(2), city: z.string().min(2), state: z.string().min(2), postalCode: z.string().optional(),
  latitude: z.number().optional(), longitude: z.number().optional(), species: z.array(z.string()).default([]), specialties: z.array(z.string()).default([]),
  capabilities: z.array(z.string()).default([]), operatingHours: z.record(z.string(), z.object({ open: z.string(), close: z.string(), closed: z.boolean().optional() })).default({}),
  open24Hours: z.boolean().default(false), isEmergency: z.boolean().default(false), consultationFee: z.number().nonnegative().optional(),
});
