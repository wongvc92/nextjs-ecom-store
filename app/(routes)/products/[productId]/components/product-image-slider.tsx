"use client";

import Image from "next/image";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSwipeable } from "react-swipeable";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ImageThumbnail from "./image-thumbnail";
import { useProductByIdContext } from "@/providers/productById.provider";

const ProductImageSlider = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [variationImage, setVariationImage] = useState<string | null>(null);
  const { product } = useProductByIdContext();
  const searchParams = useSearchParams();
  const v1 = searchParams.get("v1") || "";
  const displayImage = variationImage || (product?.productImages && product.productImages[activeIndex]?.url);

  useEffect(() => {
    if (v1) {
      const index = product?.variations?.findIndex((item) => item.id === v1);
      if (index !== -1 && index !== undefined) {
        setVariationImage(product?.variations[index]?.image || null);
      } else {
        setVariationImage(null);
      }
    } else {
      setVariationImage(null);
    }
  }, [product?.variations, v1]);

  const handleImageUrl = useCallback((imageIndex: number) => {
    setActiveIndex(imageIndex);
    setVariationImage(null);
  }, []);

  const handlePrevImage = useMemo(() => {
    return () => {
      if (activeIndex === 0) {
        setActiveIndex((product?.productImages?.length || 1) - 1);
      } else {
        setActiveIndex((prevActiveIndex) => prevActiveIndex - 1);
      }
      setVariationImage(null);
    };
  }, [activeIndex, product?.productImages?.length]);

  const handleNextImage = useMemo(() => {
    return () => {
      if (activeIndex === (product?.productImages?.length || 1) - 1) {
        setActiveIndex(0);
      } else {
        setActiveIndex((prevActiveIndex) => prevActiveIndex + 1);
      }
      setVariationImage(null);
    };
  }, [activeIndex, product?.productImages?.length]);

  const handleLeftSwipe = useMemo(() => {
    return () => {
      if (activeIndex === (product?.productImages?.length || 1) - 1) return;
      setActiveIndex((activeIndex) => activeIndex + 1);
      setVariationImage(null);
    };
  }, [activeIndex, product?.productImages?.length]);

  const handleRightSwipe = useMemo(() => {
    return () => {
      if (activeIndex === 0) return;
      setActiveIndex((activeIndex) => activeIndex - 1);
      setVariationImage(null);
    };
  }, [activeIndex]);

  const handlers = useSwipeable({
    onSwipedLeft: handleLeftSwipe,
    onSwipedRight: handleRightSwipe,
  });

  return (
    <>
      {product && product.productImages.length > 0 && (
        <div className="w-full relative  flex flex-col ">
          {/* image display with control button */}
          <div {...handlers} className="relative overflow-hidden w-full  aspect-square sm:rounded-lg border-none ">
            {product?.productImages?.map((item, i) => (
              <Image key={item.id} src={displayImage as string} alt={`Product image ${i + 1}`} layout="fill" className="object-cover" />
            ))}

            <div className="absolute inset-0 flex justify-between items-center p-1">
              <button
                onClick={handlePrevImage}
                className="rounded-full border-none p-1 bg-white opacity-70 active:bg-muted-foreground active:text-white dark:text-black"
              >
                <ChevronLeft />
              </button>
              <button
                onClick={handleNextImage}
                className="rounded-full border-none p-1 bg-white opacity-70 active:bg-muted-foreground active:text-white dark:text-black"
              >
                <ChevronRight />
              </button>
            </div>
          </div>

          {/* Image thumbnail */}
          <ImageThumbnail product={product} handleImageUrl={handleImageUrl} displayImage={displayImage as string} />
        </div>
      )}
    </>
  );
};

export default ProductImageSlider;
