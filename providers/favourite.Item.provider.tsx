"use client";

import {
  areAllNoStock,
  findSelectedNestedVariation,
  findSelectedProductImage,
  findSelectedProductPrice,
  findSelectedProductStock,
  findSelectedVariation,
  isVariationNotSelected,
} from "@/lib/helper/productHelpers";
import { INestedVariation, IProduct, IVariation } from "@/lib/types";

import { useSearchParams } from "next/navigation";

import { createContext, useContext, useMemo } from "react";

interface IFavouriteItemContext {
  favouriteProduct?: IProduct;
  selectedImage: string;
  selectedPrice: number;
  selectedProductStock: number;
  areAllNoStock: boolean;
  variationNotSelected: boolean;
  selectedVariation?: IVariation;
  selectedNestedVariation?: INestedVariation;
}

const FavouriteItemContext = createContext<IFavouriteItemContext | undefined>(undefined);

interface FavouriteItemProviderProps {
  children: React.ReactNode;
  favouriteProduct?: IProduct;
}

export const FavouriteItemProvider: React.FC<FavouriteItemProviderProps> = ({ favouriteProduct, children }) => {
  const searchParams = useSearchParams();
  const variationId = searchParams.get("v1")?.trim() || "";
  const nestedVariationId = searchParams.get("v2")?.trim() || "";

  const memoizedSelectedVariation = useMemo(() => {
    return findSelectedVariation(variationId, favouriteProduct as IProduct);
  }, [favouriteProduct, variationId]);

  const memoizedSelectedNestedVariation = useMemo(() => {
    return findSelectedNestedVariation(variationId, nestedVariationId, favouriteProduct as IProduct);
  }, [favouriteProduct, variationId, nestedVariationId]);

  //check selected variation using searchparams
  const variationNotSelected = isVariationNotSelected(variationId, nestedVariationId, favouriteProduct as IProduct);

  //check stock status
  const memoizedAreAllNoStock = useMemo(() => {
    return areAllNoStock(favouriteProduct as IProduct);
  }, [favouriteProduct]);

  //product stock

  const memoizedselectedProductStock = useMemo(() => {
    return findSelectedProductStock(variationId, nestedVariationId, favouriteProduct as IProduct);
  }, [nestedVariationId, favouriteProduct, variationId]);

  // product price

  const memoizedSelectedProductPrice = useMemo(() => {
    return findSelectedProductPrice(variationId, nestedVariationId, favouriteProduct as IProduct);
  }, [nestedVariationId, favouriteProduct, variationId]);

  const memoizedSelectedProductImage = useMemo(() => {
    return findSelectedProductImage(variationId, favouriteProduct as IProduct);
  }, [favouriteProduct, variationId]);

  const contextValue = useMemo(
    () => ({
      favouriteProduct,
      selectedImage: memoizedSelectedProductImage,
      selectedPrice: memoizedSelectedProductPrice,
      selectedProductStock: memoizedselectedProductStock,
      areAllNoStock: memoizedAreAllNoStock,
      variationNotSelected,
      selectedVariation: memoizedSelectedVariation as IVariation,
      selectedNestedVariation: memoizedSelectedNestedVariation as INestedVariation,
    }),
    [
      favouriteProduct,
      memoizedSelectedProductImage,
      memoizedSelectedProductPrice,
      memoizedAreAllNoStock,
      memoizedselectedProductStock,
      variationNotSelected,
      memoizedSelectedVariation,
      memoizedSelectedNestedVariation,
    ]
  );
  return <FavouriteItemContext.Provider value={contextValue}>{children}</FavouriteItemContext.Provider>;
};
export const useFavouriteItemContext = () => {
  const context = useContext(FavouriteItemContext);

  if (!context) {
    throw new Error("useFavouriteItemContext must be used within a FavouriteItemProvider");
  }
  return context;
};
