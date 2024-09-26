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
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
          {favouriteProducts.map((item) => (
            <FavouriteCard key={item.id} favouriteProduct={item} />
          ))}
        </div>
      )}
    </>
  );
};

export default FavouriteList;
