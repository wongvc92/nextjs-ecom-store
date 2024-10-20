"use client";

import { createContext, SetStateAction, useContext, useMemo, useOptimistic, useState } from "react";
import { Cart, CartItemWithProduct } from "@/lib/db/queries/carts";
import { findCartItemsQuantity, findSubtotalCartItems, findTotalWeightInKg } from "@/lib/helper/cartHelpers";

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
  isOpen: boolean;
  setIsOpen: React.Dispatch<SetStateAction<boolean>>;
  toPostcode: string;
  setToPostcode: React.Dispatch<SetStateAction<string>>;
  courierChoice: string;
  setCourierChoice: React.Dispatch<SetStateAction<string>>;
  setFoundCorier: React.Dispatch<SetStateAction<boolean>>;
  foundCourier: boolean;
  MAX_WEIGHT_IN_KG: number;
  setSubtotalShippings: (value: number) => void;
  totalWeightInKg: number;
  cart?: Cart | null;
  cartItems?: CartItemWithProduct[];
  dispatch: (action: IAction) => void;
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
  const MAX_WEIGHT_IN_KG = 60;
  const [optimisticCartItems, dispatch] = useOptimistic(cartItems, reducer);
  const [subTotalShippings, setSubtotalShippings] = useState(0);
  const [foundCourier, setFoundCorier] = useState(false);
  const [toPostcode, setToPostcode] = useState("");
  const [courierChoice, setCourierChoice] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const memoizedSubtotalCartItems = useMemo(() => findSubtotalCartItems(optimisticCartItems), [optimisticCartItems]);
  const memoizedCartItemsQuantity = useMemo(() => findCartItemsQuantity(optimisticCartItems), [optimisticCartItems]);
  const totalWeightInKg = useMemo(() => findTotalWeightInKg(optimisticCartItems), [optimisticCartItems]);

  const totalPrice = memoizedSubtotalCartItems + subTotalShippings;

  const contextValue = useMemo(
    () => ({
      isOpen,
      setIsOpen,
      toPostcode,
      setToPostcode,
      foundCourier,
      setFoundCorier,
      courierChoice,
      setCourierChoice,
      MAX_WEIGHT_IN_KG,
      setSubtotalShippings,
      totalWeightInKg,
      totalPrice: totalPrice.toString(),
      cartItemsQuantity: memoizedCartItemsQuantity.toString(),
      subtotalCartItems: memoizedSubtotalCartItems.toString(),
      cart,
      cartItems: optimisticCartItems,
      dispatch,
    }),
    [
      isOpen,
      courierChoice,
      toPostcode,
      setSubtotalShippings,
      cart,
      dispatch,
      optimisticCartItems,
      totalPrice,
      memoizedCartItemsQuantity,
      memoizedSubtotalCartItems,
      totalWeightInKg,
      foundCourier,
    ]
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
