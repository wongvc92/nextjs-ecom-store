import { z } from "zod";

export const productsQuerySchema = z.object({
  query: z.string().max(100).optional().default(""),
  category: z.string().max(50).optional().default(""),
  color: z
    .union([z.string().max(20), z.array(z.string().max(20))])
    .optional()
    .default([]),
  size: z
    .union([z.string().max(20), z.array(z.string().max(20))])
    .optional()
    .default([]),
  tags: z
    .union([z.string().max(20), z.array(z.string().max(20))])
    .optional()
    .default([]),
  page: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (val === undefined || val === "") return true;
        const num = Number(val);
        return !isNaN(num) && num >= 0;
      },
      { message: "page must be a non-negative number" }
    )
    .default("1"),
  minPrice: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (val === undefined || val === "") return true;
        const num = Number(val);
        return !isNaN(num) && num >= 0;
      },
      { message: "minPrice must be a non-negative number" }
    )
    .default("0"),
  maxPrice: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (val === undefined || val === "") return true;
        const num = Number(val);
        return !isNaN(num) && num >= 0;
      },
      { message: "maxPrice must be a non-negative number" }
    )
    .default("10000000"),
  sort: z.string().max(20).optional().default(""),
});

export type IProductsQuery = z.infer<typeof productsQuerySchema>;
