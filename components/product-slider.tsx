"use client";

import { IProduct } from "@/lib/types";
import { currencyFormatter, shortenedProductName } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import React, { useRef } from "react";
import FavouriteButton from "./favourite-btn";

interface ProductSliderProps {
  products: IProduct[];
  title: string;
}
const ProductSlider: React.FC<ProductSliderProps> = ({ products, title }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleScrollLeft = () => {
    if (containerRef.current !== null) {
      containerRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const handleScrollRight = () => {
    if (containerRef.current !== null) {
      containerRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <>
      {!!products && products.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center px-4">
            <h4>{title}</h4>
            <div className="flex items-center gap-4">
              <button type="button" onClick={handleScrollLeft} className="rounded-full active:bg-muted-foreground  active:text-white p-2">
                <ChevronLeft />
              </button>
              <button type="button" onClick={handleScrollRight} className="rounded-full active:bg-muted-foreground  active:text-white p-2">
                <ChevronRight />
              </button>
            </div>
          </div>
          {products.length > 0 && (
            <div ref={containerRef} className="w-full flex flex-row gap-4 overflow-x-scroll no-scrollbar pl-4">
              {products.map((product) => (
                <div key={product.id} className="space-y-2 ">
                  <div className="h-[300px] relative aspect-square rounded-md overflow-hidden">
                    <Link href={`/products/${product.id}`}>
                      <Image src={product.productImages[0].url} alt={product.productImages[0].url} fill className="object-cover" />
                    </Link>
                    <FavouriteButton product={product} className="absolute top-2 right-2 bg-white rounded-full shadow-md p-1 z-10" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm line-clamp-2 capitalize">{product.name}</p>
                    <p className="text-xs text-muted-foreground">From {currencyFormatter(product.lowestPriceInCents)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ProductSlider;
