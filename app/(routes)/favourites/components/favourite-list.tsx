"use client";

import React from "react";
import FavouriteCard from "./favourite-card";
import { useFavouriteContext } from "@/providers/favourite.provider";
import NoFavourite from "./no-favourite";

const FavouriteList = () => {
  const { favouriteProducts } = useFavouriteContext();
  return (
    <>
      {!favouriteProducts || favouriteProducts?.length === 0 ? (
        <NoFavourite />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-10 ">
          {favouriteProducts.map((item) => (
            <FavouriteCard key={item.id} favouriteProduct={item} />
          ))}
        </div>
      )}
    </>
  );
};

export default FavouriteList;
