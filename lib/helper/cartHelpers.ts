import { CartItemWithProduct } from "../db/queries/carts";
import { IProduct } from "../types";
import { findSelectedProductPrice } from "./productHelpers";

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

export const findTotalPricePerCartItem = (cartItem: CartItemWithProduct): number => {
  if (!cartItem) return 0;
  return (
    cartItem.quantity * findSelectedProductPrice(cartItem.variationId as string, cartItem.nestedVariationId as string, cartItem.product as IProduct)
  );
};
