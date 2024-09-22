import { IProduct } from "../types";

export const findOrderItemdVariationName = (variationId: string, product: IProduct): string => {
  if (!product || !variationId) return "";
  if (product.variationType === "NESTED_VARIATION" || product.variationType === "VARIATION") {
    return product.variations?.find((v) => v.id === variationId)?.name as string;
  } else {
    return "";
  }
};

export const findOrderItemdProductImage = (variationId: string, product: IProduct): string => {
  if (!product) return "";
  if (product.variationType === "NESTED_VARIATION" || product.variationType === "VARIATION") {
    return product.variations?.find((v) => v.id === variationId)?.image || "";
  } else if (product.variationType === "NONE") {
    return product.productImages[0].url;
  }
  return "";
};

export const findOrderItemdNestedVariationName = (variationId: string, nestedVariationId: string, product: IProduct): string => {
  if (!product || !variationId || !nestedVariationId) return "";
  if (product.variationType === "NESTED_VARIATION") {
    return product.variations?.find((v) => v.id === variationId)?.nestedVariations?.find((nv) => nv.id === nestedVariationId)?.name as string;
  } else {
    return "";
  }
};

export const findOrderItemSubTotal = (quantity: number, Price: number): number => {
  if (!quantity || !Price) return 0;
  return quantity * Price;
};
