import { INestedVariation, IProduct, IVariation } from "../types";
import { capitalizeSentenceFirstChar } from "../utils";

export const findSelectedVariation = (variationId: string, product: IProduct): IVariation | null => {
  if (!variationId || !product) return null;
  let foundVariation: IVariation | null = null;
  if (product.variationType === "NESTED_VARIATION" || product.variationType === "VARIATION") {
    foundVariation = product.variations.find((item) => item.id === variationId) as IVariation;
  }

  return foundVariation;
};

export const findSelectedNestedVariation = (variationId: string, nestedVariationId: string, product: IProduct) => {
  let foundNestedVariation: INestedVariation | null = null;
  if (product?.variationType === "NESTED_VARIATION") {
    foundNestedVariation = product.variations
      .find((v) => v.id === variationId)
      ?.nestedVariations.find((nv) => nv.id === nestedVariationId) as INestedVariation;
  }
  if (!foundNestedVariation) return null;
  return foundNestedVariation;
};

export const isVariationNotSelected = (variationId: string, nestedVariationId: string, product: IProduct) => {
  if (!product) return false;
  if (product.variationType === "NESTED_VARIATION") {
    if (!variationId || !nestedVariationId) {
      return true;
    } else {
      return false;
    }
  } else if (product.variationType === "VARIATION") {
    if (!variationId) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

export const areAllNoStock = (product: IProduct) => {
  if (!product) return true;
  if (product.variationType === "NESTED_VARIATION") {
    for (const variationItem of product.variations) {
      //return true if all condition met
      return variationItem.nestedVariations.every((nestedVariationItem) => nestedVariationItem.stock === 0);
    }
  } else if (product.variationType === "VARIATION") {
    //return true if all condition met
    return product.variations.every((variationItem) => variationItem.stock === 0);
  } else if (product.variationType === "NONE") {
    return product.stock === 0;
  }
  return true;
};

export const findDefaultProductStock = (product?: IProduct): number => {
  if (!product) return 0;
  let defaultStock = 0;
  if (product && product?.variationType === "NESTED_VARIATION") {
    defaultStock = product.variations[0].nestedVariations[0].stock ?? 0;
  } else if (product && product?.variationType === "VARIATION") {
    defaultStock = product.variations[0].stock ?? 0;
  } else if (product?.variationType === "NONE") {
    defaultStock = product.stock ?? 0;
  }
  return defaultStock;
};

export const findSelectedProductStock = (variationId: string, nestedVariationId: string, product?: IProduct): number => {
  if (!product) return 0;
  let productStock = 0;
  if (product.variationType === "NESTED_VARIATION") {
    productStock = findSelectedNestedVariation(variationId, nestedVariationId, product)?.stock ?? findDefaultProductStock(product);
  } else if (product.variationType === "VARIATION") {
    productStock = findSelectedVariation(variationId, product)?.stock ?? findDefaultProductStock(product);
  } else if (product.variationType === "NONE") {
    productStock = product.stock;
  }
  return productStock;
};

export const findSelectedProductImage = (variationId: string, product: IProduct): string => {
  if (product.variationType === "NESTED_VARIATION" || product.variationType === "VARIATION") {
    return product?.variations.find((v) => v.id === variationId)?.image ?? product?.productImages[0].url;
  } else if (product.variationType === "NONE") {
    return product?.productImages[0].url;
  }
  return product?.productImages[0].url;
};

export const shortenedProductName = (name: string): string => {
  if (!name) return "";
  return capitalizeSentenceFirstChar(name.length > 30 ? name.slice(0, 25) + "..." : name);
};

export const shortenedProductDescription = (description: string): string => {
  return description?.slice(0, 400) + "...";
};

export const findDefaultProductPrice = (product?: IProduct): number => {
  if (!product) return 0;
  let defaultPrice = 0;
  if (product.variationType === "NESTED_VARIATION") {
    defaultPrice = product.variations[0]?.nestedVariations[0]?.priceInCents ?? product.priceInCents;
  } else if (product.variationType === "VARIATION") {
    defaultPrice = product.variations[0].priceInCents ?? product.priceInCents;
  } else if (product.variationType === "NONE") {
    defaultPrice = product.priceInCents;
  }
  return defaultPrice;
};

export const findSelectedProductPrice = (variationId?: string, nestedVariationId?: string, product?: IProduct): number => {
  if (!product) return 0;
  let productPrice = 0;
  if (product.variationType === "NESTED_VARIATION") {
    productPrice =
      product.variations.find((v) => v.id === variationId)?.nestedVariations.find((nv) => nv.id === nestedVariationId)?.priceInCents ??
      findDefaultProductPrice(product) ??
      0;
  } else if (product.variationType === "VARIATION") {
    productPrice = product?.variations.find((v) => v.id === variationId)?.priceInCents ?? findDefaultProductPrice(product) ?? 0;
  } else if (product.variationType === "NONE") {
    productPrice = (product?.priceInCents as number) ?? 0;
  }
  return productPrice;
};
