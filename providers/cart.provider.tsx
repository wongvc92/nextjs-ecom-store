"use client";

import { createContext, useContext, useMemo, useOptimistic } from "react";
import { Cart, CartItemWithProduct } from "@/lib/db/queries/carts";
import { findSubShippingFeeCartItems } from "@/lib/helper/shippingHelpers";
import { findCartItemsQuantity, findSubtotalCartItems } from "@/lib/helper/cartHelpers";

interface CartItemPayload extends CartItemWithProduct {
  newVariationId?: string | null;
  newNestedVariationId?: string | null;
}

interface IAction {
  type:
    | "ADD_TO_CART"
    | "INCREASE_CART_QUANTITY"
    | "DECREASE_CART_QUANTITY"
    | "UPDATE_CART_QUANTITY"
    | "UPDATE_CART_BY_VARIATION"
    | "UPDATE_CART_BY_NESTED_VARIATION"
    | "REMOVE_CART_ITEM"
    | "CLEAR_CART_ITEM";
  payload?: CartItemPayload;
}

interface ICartContext {
  cart?: Cart | null;
  cartItems?: CartItemWithProduct[];
  dispatch: (action: IAction) => void;
  subShippingFeeCartItems: string;
  subtotalCartItems: string;
  totalPrice: string;
  cartItemsQuantity: string;
}

const CartContext = createContext<ICartContext | undefined>(undefined);

interface CartProviderProps {
  children: React.ReactNode;
  cart: Cart | null;
}

const reducer = (state: CartItemWithProduct[], action: IAction): CartItemWithProduct[] => {
  const existingItem = state.find(
    (item) =>
      item.productId === action.payload?.productId &&
      item.variationId === action.payload?.variationId &&
      item.nestedVariationId === action.payload?.nestedVariationId
  );

  const existingCartItems = [...state];
  let updatedCart = existingCartItems;

  switch (action.type) {
    case "ADD_TO_CART":
      if (existingItem) {
        updatedCart = existingCartItems.map((item) => (item.id === existingItem.id ? { ...item, quantity: item.quantity + 1 } : item));
      } else {
        updatedCart = [...state, { ...(action.payload as CartItemPayload), quantity: 1 }];
      }
      return updatedCart;
    case "INCREASE_CART_QUANTITY":
      if (existingItem && existingItem.quantity > 0) {
        updatedCart = existingCartItems.map((item) => (item.id === existingItem.id ? { ...item, quantity: item.quantity + 1 } : item));
      }
      return updatedCart;
    case "DECREASE_CART_QUANTITY":
      if (existingItem) {
        if (existingItem.quantity === 1) {
          updatedCart = existingCartItems.filter((item) => item.id !== action.payload?.id);
        } else if (existingItem.quantity && existingItem.quantity > 1) {
          updatedCart = existingCartItems.map((item) => (item.id === action.payload?.id ? { ...item, quantity: action.payload.quantity - 1 } : item));
        }
      }
      return updatedCart;
    case "UPDATE_CART_QUANTITY":
      if (existingItem) {
        updatedCart = existingCartItems.map((item) => (item.id === action.payload?.id ? { ...item, quantity: action.payload.quantity } : item));
      }
      return updatedCart;
    case "UPDATE_CART_BY_VARIATION":
      const previouseVariationCartItem = existingCartItems.find(
        (item) => item.productId === action.payload?.productId && item.variationId === action.payload?.variationId
      );
      if (previouseVariationCartItem) {
        previouseVariationCartItem.quantity = previouseVariationCartItem.quantity + action.payload?.quantity!!;
        const updatedCartItems = existingCartItems.filter((item) => item.id !== action.payload?.id);
        return updatedCartItems;
      }

      return [
        ...existingCartItems,
        { ...(action.payload as CartItemPayload), variationId: action.payload?.newVariationId ? action.payload?.newVariationId : null },
      ];
    case "UPDATE_CART_BY_NESTED_VARIATION":
      if (!existingItem) {
        return [...existingCartItems, { ...(action.payload as CartItemPayload), nestedVariationId: action.payload?.newNestedVariationId ?? null }];
      }
      const updatedCartItems = existingCartItems.map((item) =>
        item.id === action.payload?.id
          ? {
              ...item,
              nestedVariationId: action.payload.newNestedVariationId ?? null,
              quantity: action.payload.quantity,
            }
          : item
      );
      return updatedCartItems;
    case "REMOVE_CART_ITEM":
      updatedCart = state.filter((item) => item.id !== action.payload?.id);
      return updatedCart;
    case "CLEAR_CART_ITEM":
      updatedCart = [];
      return updatedCart;
    default:
      return updatedCart;
  }
};

export const CartProvider = ({ cart, children }: CartProviderProps) => {
  const cartItems = cart ? cart.cartItems : [];
  const [optimisticCartItems, dispatch] = useOptimistic(cartItems, reducer);
  const memoizedSubShippingFeeCartItems = useMemo(() => findSubShippingFeeCartItems(optimisticCartItems), [optimisticCartItems]);
  const memoizedSubtotalCartItems = useMemo(() => findSubtotalCartItems(optimisticCartItems), [optimisticCartItems]);
  const memoizedCartItemsQuantity = useMemo(() => findCartItemsQuantity(optimisticCartItems), [optimisticCartItems]);

  const totalPrice = memoizedSubtotalCartItems + memoizedSubShippingFeeCartItems;

  const contextValue = useMemo(
    () => ({
      totalPrice: totalPrice.toString(),
      cartItemsQuantity: memoizedCartItemsQuantity.toString(),
      subtotalCartItems: memoizedSubtotalCartItems.toString(),
      subShippingFeeCartItems: memoizedSubShippingFeeCartItems.toString(),
      cart,
      cartItems: optimisticCartItems,
      dispatch,
    }),
    [cart, dispatch, optimisticCartItems, totalPrice, memoizedCartItemsQuantity, memoizedSubShippingFeeCartItems, memoizedSubtotalCartItems]
  );

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
};

export const useCartContext = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCartContext must be used within a CartProvider");
  }
  return context;
};
