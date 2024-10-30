"use client";

import { IProduct } from "@/lib/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useRef } from "react";
import ProductCard from "@/app/(routes)/products/components/product-card";

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
            <div className={`flex items-center gap-4 ${products.length > 1 ? "flex" : "hidden"} ${products.length > 5 ? "lg:flex" : "lg:hidden"}`}>
              <button type="button" onClick={handleScrollLeft} className="rounded-full active:bg-muted-foreground  active:text-white p-2">
                <ChevronLeft />
              </button>
              <button type="button" onClick={handleScrollRight} className="rounded-full active:bg-muted-foreground  active:text-white p-2">
                <ChevronRight />
              </button>
            </div>
          </div>

          <div
            ref={containerRef}
            className={`w-full flex flex-row gap-4 overflow-x-scroll no-scrollbar pl-4 ${products.length > 0 ? "flex" : "hidden"}`}
          >
            {products.map((product) => (
              <ProductCard product={product} key={product.id} classname="max-w-[300px]" />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default ProductSlider;
