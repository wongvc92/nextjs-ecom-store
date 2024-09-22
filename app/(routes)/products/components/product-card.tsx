"use client";

import FavouriteButton from "@/components/favourite-btn";
import { IProduct } from "@/lib/types";
import { getMinMaxPrices, shortenedProductName } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useMemo } from "react";

interface ProductItemProps {
  product: IProduct;
}

const ProductCard: React.FC<ProductItemProps> = ({ product }) => {
  const memoizedMinMaxPrice = useMemo(() => getMinMaxPrices(product), [product]);

  return (
    <div className="w-full relative">
      <Link href={`/products/${product.id}`}>
        <div className="aspect-square bg-gray-100 relative overflow-hidden group rounded-md  ">
          <Image
            src={product.productImages[0].url}
            alt={`${product.name} image`}
            fill
            className="object-cover absolute group-hover:scale-110 transition"
            priority
          />
        </div>

        <div className="flex flex-col md:flex-col p-2">
          <p className="text-sm font-semibold text-muted-foreground line-clamp-2 capitalize">{product.name}</p>
          <p className="text-sm font-normal text-muted-foreground">{memoizedMinMaxPrice}</p>
        </div>
      </Link>

      <FavouriteButton className="bg-white absolute top-2 right-2 rounded-full  p-1 z-10 opacity-80 shadow-md" product={product} />
    </div>
  );
};

export default ProductCard;
