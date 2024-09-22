import { z } from "zod";

const variationTypeEnum = z.string(z.enum(["NONE", "VARIATION", "NESTED_VARIATION"]));
export const favouriteSchema = z.object({
  productId: z.string().uuid(),
  variationType: variationTypeEnum,
});

export type FavouriteSchema = z.infer<typeof favouriteSchema>;
