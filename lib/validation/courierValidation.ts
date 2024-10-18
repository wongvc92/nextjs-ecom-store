import { z } from "zod";

export const courierRequestSchema = z.object({
  toPostcode: z.coerce.number().positive(),
  totalWeightInKg: z.coerce.number().positive(),
  courierChoice: z.string(),
  totalHeight: z.coerce.number().positive().optional(),
  totalLength: z.coerce.number().positive().optional(),
  totalWidth: z.coerce.number().positive().optional(),
});

export type CourierRequest = z.infer<typeof courierRequestSchema>;
