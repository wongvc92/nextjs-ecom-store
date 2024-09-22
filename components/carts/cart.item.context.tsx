"use client";

import { createContext, useCallback, useContext, useMemo } from "react";
import { CartItemWithProduct } from "@/lib/db/queries/carts";
import { findSelectedProductImage, findSelectedProductPrice } from "@/lib/utils";
import { IProduct } from "@/lib/types";

interface ICartItemContext {
  cartItem?: CartItemWithProduct | null;
  selectedProductPrice: number;
  selectedProductImage: string;
}

const CartItemContext = createContext<ICartItemContext | undefined>(undefined);

interface CartItemProviderProps {
  children: React.ReactNode;
  cartItem: CartItemWithProduct;
}

export const CartItemProvider: React.FC<CartItemProviderProps> = ({ cartItem, children }) => {
  const memoizedSelectedProductPrice = useCallback(
    () => findSelectedProductPrice(cartItem.variationId as string, cartItem.nestedVariationId as string, cartItem.product as IProduct),
    [cartItem]
  );
  const memoizedSelectedProductImage = useCallback(
    () => findSelectedProductImage(cartItem.variationId as string, cartItem.product as IProduct),
    [cartItem]
  );

  const contextValue = useMemo(
    () => ({
      selectedProductPrice: memoizedSelectedProductPrice(),
      selectedProductImage: memoizedSelectedProductImage(),
      cartItem,
    }),
    [cartItem, memoizedSelectedProductImage, memoizedSelectedProductPrice]
  );
  return <CartItemContext.Provider value={contextValue}>{children}</CartItemContext.Provider>;
};

export const useCartItemContext = () => {
  const context = useContext(CartItemContext);

  if (!context) {
    throw new Error("useCartItemContext must be used within a CartItemProvider");
  }
  return context;
};
