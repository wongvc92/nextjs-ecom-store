"use client";

import { FavouriteItemWithProduct } from "@/lib/db/queries/favourites";
import { IProduct } from "@/lib/types";
import { createContext, useContext, useMemo, useOptimistic } from "react";

interface IFavouriteContext {
  favouriteProducts: FavouriteItemWithProduct[] | null;
  dispatch: (action: IAction) => void;
}

const favouriteContext = createContext<IFavouriteContext | undefined>(undefined);

interface FavouriteProviderProps {
  children: React.ReactNode;
  value: FavouriteItemWithProduct[];
}
interface IAction {
  type: "TOGGLE_LIKE";
  payload: IProduct;
}
const reducer = (state: FavouriteItemWithProduct[], action: IAction): FavouriteItemWithProduct[] => {
  switch (action.type) {
    case "TOGGLE_LIKE":
      const productIndex = state.findIndex((item) => item.productId === action.payload.id);

      if (productIndex !== -1) {
        return state.filter((item) => item.product?.id !== action.payload.id);
      } else {
        return [...state, { product: action.payload, isLiked: true } as FavouriteItemWithProduct];
      }

    default:
      return state;
  }
};

export const FavouriteProvider: React.FC<FavouriteProviderProps> = ({ value, children }) => {
  const [useOptimisticFavourites, dispatch] = useOptimistic(value || [], reducer);
  const contextValue = useMemo(
    () => ({
      favouriteProducts: useOptimisticFavourites,
      dispatch,
    }),
    [dispatch, useOptimisticFavourites]
  );

  return <favouriteContext.Provider value={contextValue}>{children}</favouriteContext.Provider>;
};

export const useFavouriteContext = () => {
  const context = useContext(favouriteContext);

  if (!context) {
    throw new Error("useFavourite must be used within a favouriteProvider");
  }
  return context;
};
