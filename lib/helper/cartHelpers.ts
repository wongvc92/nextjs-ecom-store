import { CartItemWithProduct } from "../db/queries/carts";
import { CartItem } from "../db/schema/cartItems";
import { IProduct } from "../types";
import { findSelectedProductPrice } from "./productHelpers";

export const findSubtotalCartItems = (cartItems: CartItemWithProduct[]): number => {
  return cartItems.reduce((acc, cartItem) => {
    const productPrice = findSelectedProductPrice(cartItem.variationId as string, cartItem.nestedVariationId as string, cartItem.product as IProduct);
    const subtotalCartItem = cartItem.quantity * productPrice;
    return acc + subtotalCartItem;
  }, 0);
};

export const findTotalWeightInKg = (cartItems: CartItemWithProduct[]): number => {
  const totalWeightinGram = cartItems?.reduce((acc, item) => {
    const totalPerItem = (item.product?.weightInGram || 0) * item.quantity;
    return acc + totalPerItem;
  }, 0);
  return parseFloat((totalWeightinGram / 1000).toFixed(1));
};

export const findCartItemsQuantity = (cartItems: CartItemWithProduct[]): number => {
  return cartItems.reduce((acc, item) => {
    return acc + item.quantity;
  }, 0);
};

export const findTotalPricePerCartItem = (cartItem: CartItemWithProduct): number => {
  if (!cartItem) return 0;
  return (
    cartItem.quantity * findSelectedProductPrice(cartItem.variationId as string, cartItem.nestedVariationId as string, cartItem.product as IProduct)
  );
};

export const findCartItemVariation = (cartItem: CartItemWithProduct) => {
  let variationName = "";
  let nestedVariationName = "";

  // Find the main variation
  const mainVariation = cartItem.product?.variations.find((v) => v.id === cartItem.variationId);

  // If a main variation exists, get its name
  if (mainVariation) {
    variationName = mainVariation.name ?? "";

    // Handle nested variation if the type is NESTED_VARIATION
    if (cartItem.variationType === "NESTED_VARIATION") {
      const nestedVariation = mainVariation.nestedVariations?.find((nv) => nv.id === cartItem.nestedVariationId);
      if (nestedVariation) {
        nestedVariationName = nestedVariation.name ?? "";
      }
    }
  }

  // For VARIATION, return the main variation name
  // For NESTED_VARIATION, return both main and nested variation names
  return cartItem.variationType === "NESTED_VARIATION" ? `${variationName}${nestedVariationName ? ` - ${nestedVariationName}` : ""}` : variationName;
};

export const findCartItemNestedVariation = (cartItem: CartItemWithProduct) => {
  if (cartItem.variationType === "NESTED_VARIATION") {
    return cartItem.product?.variations
      .find((v) => {
        v.id === cartItem.variationId;
      })
      ?.nestedVariations.find((nv) => {
        nv.id === cartItem.nestedVariationId;
      });
  }
};

export const mergecartItem = (...cartItem: CartItem[][]): CartItem[] => {
  return cartItem.reduce((acc, items) => {
    items.forEach((item) => {
      let existingItem;
      if (item.variationType === "NONE") {
        existingItem = acc.find((i) => i.productId === item.productId);
      } else if (item.variationType === "VARIATION") {
        existingItem = acc.find((i) => i.productId === item.productId && i.variationId === item.variationId);
      } else if (item.variationType === "NESTED_VARIATION") {
        existingItem = acc.find(
          (i) => i.productId === item.productId && i.variationId === item.variationId && i.nestedVariationId === item.nestedVariationId
        );
      }

      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        acc.push(item);
      }
    });
    return acc;
  }, [] as CartItem[]);
};
