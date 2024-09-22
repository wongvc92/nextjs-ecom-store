import { z } from "zod";

const variationTypeEnum = z.string(z.enum(["NONE", "VARIATION", "NESTED_VARIATION"]));
const allowedImageDomains = ["nextjs-dashboard-website.s3.ap-southeast-1.amazonaws.com"];

export const increaseCartSchema = z.object({
  id: z.string().uuid(),
});

export const decreaseCartSchema = z.object({
  id: z.string().uuid(),
});

export const updateCartQuantitySchema = z.object({
  id: z.string().uuid(),
  newQuantity: z.coerce.number().int().positive(),
});

export const updatecartItemsByVariationSchema = z.object({
  id: z.string().uuid(),
  productId: z.string().uuid(),
  quantity: z.coerce.number().int().positive(),
  newVariationId: z.string().uuid(),
});

export const addToCartSchema = z.object({
  productId: z.string().uuid(),
  selectedVariationId: z.string().nullable(),
  selectedNestedVariationId: z.string().nullable(),
  variationType: variationTypeEnum,
});

export const removeCartSchema = z.object({
  id: z.string().uuid(),
});

export const updatecartItemsByNestedVariationSchema = z.object({
  id: z.string().uuid(),
  quantity: z.coerce.number().int().positive(),
  ProductId: z.string().uuid(),
  newNestedVariationId: z.string().uuid(),
});

export const UpdateCartSchema = z
  .object({
    userId: z.string().uuid(),
    productId: z.string({ message: "productId needed" }).uuid(),
    variationType: variationTypeEnum,
    productName: z.string(),
    category: z.string(),
    quantity: z.coerce.number({ message: "quantity needed" }).int().positive(),
    image: z
      .string()
      .url()
      .refine(
        (url) => {
          try {
            const parsedUrl = new URL(url);
            return allowedImageDomains.includes(parsedUrl.hostname);
          } catch {
            return false;
          }
        },
        { message: "Image URL must be from an allowed domain" }
      ),
    priceInCents: z.string({ message: "price needed" }),
    selectedVariationId: z.string().uuid().nullable(),
    selectedVariationName: z.string().nullable(),
    selectedVariationLabel: z.string().nullable(),
    selectedNestedVariationId: z.string().uuid().nullable(),
    selectedNestedVariationName: z.string().nullable(),
    selectedNestedVariationLabel: z.string().nullable(),
  })
  .refine(
    (data) => {
      if (data.variationType === "NESTED_VARIATION") {
        return (
          data.selectedVariationId !== undefined &&
          data.selectedVariationId !== null &&
          data.selectedNestedVariationId !== undefined &&
          data.selectedNestedVariationId !== null
        );
      } else if (data.variationType === "VARIATION") {
        return data.selectedVariationId !== undefined && data.selectedVariationId !== null;
      }
      return true;
    },
    {
      message: "make sure selectedVariationId or selectedNestedVariationId is available based on product variation type",
    }
  );

export type UpdateCartSchema = z.infer<typeof UpdateCartSchema>;
