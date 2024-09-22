"use client";

"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useSwipeable } from "react-swipeable";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { IbannerImage } from "@/lib/types";
import Image from "next/image";

const ImageSlider = ({
  images,
  autoSlide = false,
  autoSlideInterval = 3000,
}: {
  images: IbannerImage[];
  autoSlide: boolean;
  autoSlideInterval: number;
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrevImage = () => {
    setActiveIndex((activeIndex - 1 + images.length) % images.length);
  };

  const handleNextImage = useCallback(() => {
    setActiveIndex((activeIndex + 1) % images.length);
  }, [activeIndex, images.length]);

  useEffect(() => {
    if (!autoSlide) return;
    const slideInterval = setInterval(handleNextImage, autoSlideInterval);
    return () => clearInterval(slideInterval);
  }, [autoSlide, autoSlideInterval, handleNextImage]);

  const handlers = useSwipeable({
    onSwipedLeft: handleNextImage,
    onSwipedRight: handlePrevImage,
  });

  return (
    <div className="relative overflow-hidden" {...handlers}>
      <div className="flex transition-transform ease-out duration-500" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
        {images.map((image) => (
          <div key={image.id} className="w-full flex-shrink-0 relative h-[200px] md:h-[400px] md:rounded-md overflow-hidden">
            <Image src={image.url} alt={image.url} fill className="object-cover" />
          </div>
        ))}
      </div>
      <div className="absolute inset-0 flex justify-between items-center p-2">
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
      <div className="absolute bottom-4 right-0 left-0">
        <div className="flex items-center justify-center gap-2">
          {images.map((_, i) => (
            <div key={i} className={`transition-all w-3 h-3 bg-white rounded-full ${activeIndex === i ? "p-2" : "bg-opacity-50"}`}></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageSlider;
