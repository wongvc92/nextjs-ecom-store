"use client";

import { INestedVariation, IProduct, IVariation } from "@/lib/types";
import {
  areAllNoStock,
  findSelectedNestedVariation,
  findSelectedProductImage,
  findSelectedProductPrice,
  findSelectedProductStock,
  findSelectedVariation,
  isVariationNotSelected,
} from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { createContext, useContext, useMemo } from "react";

interface IProductContext {
  product: IProduct;
  selectedVariation: IVariation | null;
  selectedNestedVariation: INestedVariation | null;
  selectedProductPrice: number;
  selectedProductStock?: number;
  isVariationNotSelected: boolean;
  areAllNoStock: boolean;
  selectedProductImage: string;
}

const ProductByIdContext = createContext<IProductContext | null>(null);

interface ProductProviderProps {
  product: IProduct;
  children: React.ReactNode;
}

export const ProductByIdProvider: React.FC<ProductProviderProps> = ({ product, children }) => {
  const searchParams = useSearchParams();
  const variationId = searchParams.get("v1")?.trim() || "";
  const nestedVariationId = searchParams.get("v2")?.trim() || "";

  const memoizedSelectedVariation = useMemo(() => {
    return findSelectedVariation(variationId, product);
  }, [product, variationId]);

  const memoizedSelectedNestedVariation = useMemo(() => {
    return findSelectedNestedVariation(variationId, nestedVariationId, product);
  }, [product, variationId, nestedVariationId]);

  const memoizedAreAllNoStock = useMemo(() => {
    return areAllNoStock(product);
  }, [product]);

  const memoizedselectedProductStock = useMemo(() => {
    return findSelectedProductStock(variationId, nestedVariationId, product);
  }, [nestedVariationId, product, variationId]);
  console.log("memoizedselectedProductStock", memoizedselectedProductStock);

  const memoizedSelectedProductPrice = useMemo(() => {
    return findSelectedProductPrice(variationId, nestedVariationId, product);
  }, [nestedVariationId, product, variationId]);

  const memoizedSelectedProductImage = useMemo(() => {
    return findSelectedProductImage(variationId, product);
  }, [product, variationId]);

  const contextValue = useMemo(
    () => ({
      product,
      selectedVariation: memoizedSelectedVariation,
      selectedNestedVariation: memoizedSelectedNestedVariation,
      selectedProductPrice: memoizedSelectedProductPrice,
      selectedProductStock: memoizedselectedProductStock,
      isVariationNotSelected: isVariationNotSelected(variationId, nestedVariationId, product),
      areAllNoStock: memoizedAreAllNoStock,
      selectedProductImage: memoizedSelectedProductImage,
    }),
    [
      product,
      memoizedSelectedProductPrice,
      memoizedselectedProductStock,
      memoizedSelectedProductImage,
      memoizedAreAllNoStock,
      memoizedSelectedNestedVariation,
      memoizedSelectedVariation,
      nestedVariationId,
      variationId,
    ]
  );
  return <ProductByIdContext.Provider value={contextValue}>{children}</ProductByIdContext.Provider>;
};

export const useProductByIdContext = () => {
  const context = useContext(ProductByIdContext);
  if (!context) {
    throw new Error("useProductContext must be used within a ProductByIdProvider");
  }
  return context;
};
