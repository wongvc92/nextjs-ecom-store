"use client";

import { IProduct } from "@/lib/types";
import Image from "next/image";
import React from "react";
import CheckVariationButton from "./check-variation-btn";
import FavouriteButton from "@/components/favourite-btn";
import { FavouriteItemProvider } from "@/providers/favourite.Item.provider";
import { getMinMaxPrices } from "@/lib/utils";
import Link from "next/link";
import { FavouriteItemWithProduct } from "@/lib/db/queries/favourites";

interface FavouriteCardProps {
  favouriteProduct?: FavouriteItemWithProduct;
}
const FavouriteCard: React.FC<FavouriteCardProps> = ({ favouriteProduct }) => {
  return (
    <FavouriteItemProvider favouriteProduct={favouriteProduct?.product}>
      <div className="flex flex-col">
        <div className="relative overflow-hidden rounded-md w-full aspect-square">
          <Link href={`/products/${favouriteProduct?.productId}`}>
            <Image src={favouriteProduct?.product?.productImages[0].url as string} alt="IMAGE" fill className="object-cover" />
          </Link>
          <FavouriteButton product={favouriteProduct?.product} className="absolute top-2 right-2 bg-white rounded-full shadow-md p-1 z-10" />
        </div>
        <div>
          <div className="flex flex-col  w-full p-2">
            <p className="text-sm line-clamp-2 capitalize">{favouriteProduct?.product?.name as string}</p>
            <p className="text-sm">{getMinMaxPrices(favouriteProduct?.product as IProduct)}</p>
          </div>
          <CheckVariationButton />
        </div>
      </div>
    </FavouriteItemProvider>
  );
};

export default FavouriteCard;
