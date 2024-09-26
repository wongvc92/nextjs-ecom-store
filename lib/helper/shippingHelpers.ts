import { CartItemWithProduct } from "../db/queries/carts";

export const findSubShippingFeeCartItems = (cartItems: CartItemWithProduct[]): number => {
  return cartItems.reduce((acc, item) => {
    const shippingFeeCartItem = item.quantity * (item.product?.shippingFeeInCents ?? 0);
    return acc + shippingFeeCartItem;
  }, 0);
};

export const findTotalShippingFeePerItem = (cartItem: CartItemWithProduct) => {
  return cartItem.quantity * (cartItem.product?.shippingFeeInCents ?? 0);
};
