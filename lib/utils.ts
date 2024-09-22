import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { INestedVariation, IOrderItem, IProduct, IVariation } from "./types";
import { CartItemWithProduct } from "./db/queries/carts";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalizeFirstChar(letter: string): string {
  if (!letter) return "";
  return letter.charAt(0).toUpperCase() + letter.slice(1).toLowerCase();
}

export function capitalizeSentenceFirstChar(sentence: string): string {
  if (!sentence) return "";
  return sentence
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export const convertCentsToTwoDecimal = (priceInCents: number): string => {
  return (priceInCents / 100).toFixed(2);
};

export const currencyFormatter = (priceInCents: number): string => {
  return `RM ${convertCentsToTwoDecimal(priceInCents)}`;
};

export const getMinMaxPrices = (product: IProduct): string => {
  let minPrice = Infinity;
  let maxPrice = -Infinity;
  if (product?.variationType === "NESTED_VARIATION") {
    product?.variations.forEach((variationItem) => {
      variationItem.nestedVariations.forEach((nested) => {
        const price = nested.priceInCents!;
        if (price < minPrice) minPrice = price;
        if (price > maxPrice) maxPrice = price;
      });
    });
    return `${currencyFormatter(minPrice)} -${currencyFormatter(maxPrice)}`;
  } else if (product?.variationType === "VARIATION") {
    product?.variations.forEach((variationItem) => {
      const price = variationItem.priceInCents!;
      if (price < minPrice) minPrice = price;
      if (price > maxPrice) maxPrice = price;
    });
    return `${currencyFormatter(minPrice)} -${currencyFormatter(maxPrice)}`;
  } else if (product?.variationType === "NONE") {
    return `${currencyFormatter(product?.priceInCents)}`;
  }
  return "0";
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

export const findSubShippingFeeCartItems = (cartItems: CartItemWithProduct[]): number => {
  return cartItems.reduce((acc, item) => {
    const shippingFeeCartItem = item.quantity * (item.product?.shippingFeeInCents ?? 0);
    return acc + shippingFeeCartItem;
  }, 0);
};

export const findTotalShippingFeePerItem = (cartItem: CartItemWithProduct) => {
  return cartItem.quantity * (cartItem.product?.shippingFeeInCents ?? 0);
};

export const findSubtotalCartItems = (cartItems: CartItemWithProduct[]): number => {
  return cartItems.reduce((acc, cartItem) => {
    const productPrice = findSelectedProductPrice(cartItem.variationId as string, cartItem.nestedVariationId as string, cartItem.product as IProduct);
    const subtotalCartItem = cartItem.quantity * productPrice;
    return acc + subtotalCartItem;
  }, 0);
};

export const findCartItemsQuantity = (cartItems: CartItemWithProduct[]): number => {
  return cartItems.reduce((acc, item) => {
    return acc + item.quantity;
  }, 0);
};

export const findSelectedProductImage = (variationId: string, product: IProduct): string => {
  if (!product) return "";
  let productImage = "";
  if (product.variationType === "NESTED_VARIATION" || product.variationType === "VARIATION") {
    productImage = product?.variations.find((v) => v.id === variationId)?.image ?? "";
  } else if (product.variationType === "NONE") {
    productImage = product?.productImages[0].url ?? "";
  }
  return productImage;
};

export const findTotalPricePerCartItem = (cartItem: CartItemWithProduct): number => {
  if (!cartItem) return 0;
  return (
    cartItem.quantity * findSelectedProductPrice(cartItem.variationId as string, cartItem.nestedVariationId as string, cartItem.product as IProduct)
  );
};

export const findSelectedVariation = (variationId: string, product: IProduct): IVariation | null => {
  if (!variationId || !product) return null;
  let foundVariation: IVariation | null = null;
  if (product.variationType === "NESTED_VARIATION" || product.variationType === "VARIATION") {
    foundVariation = product.variations.find((item) => item.name === variationId) as IVariation;
  }
  if (!foundVariation) return null;
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

export const addSearchParams = (url: URL, searchParams: Record<string, any>) => {
  Object.entries(searchParams).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => url.searchParams.append(key, String(item)));
    } else if (value !== null && value !== undefined && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });
};

export const convertCentsToTwoDecimalNumber = (priceInCents: number): number => {
  return priceInCents / 100;
};

export const convertCentsToTwoDecimalString = (priceInCents: number): string => {
  if (!priceInCents) return "0";
  return (priceInCents / 100).toFixed(2);
};

export const findOrderItemsSubTotal = (orderItems: IOrderItem[]) => {
  if (!orderItems) return 0;
  return orderItems.reduce((acc, item) => {
    const itemSubTotalPriceInCents = item.priceInCents * item.quantity;
    return acc + itemSubTotalPriceInCents;
  }, 0);
};

export const findOrderItemsShippingSubTotal = (orderItems: IOrderItem[]) => {
  if (!orderItems) return 0;
  return orderItems.reduce((acc, item) => {
    const itemTotalPriceInCents = item.shippingFeeInCents * item.quantity;
    return acc + itemTotalPriceInCents;
  }, 0);
};
