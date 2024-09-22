"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

import { useProductFilter } from "@/providers/product.filter.provider";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CategoriesFilter = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const categoryParams = searchParams.get("category");
  const [isOverflowing, setIsOverflowing] = useState(false);
  const { categories } = useProductFilter();

  // Function to check if the container is overflowing
  const checkOverflow = () => {
    if (containerRef.current) {
      const { scrollWidth, clientWidth } = containerRef.current;
      setIsOverflowing(scrollWidth > clientWidth);
    }
  };

  // Call checkOverflow when the component mounts and when categories change
  useEffect(() => {
    checkOverflow();
    // Add event listener for window resizing to check overflow on resize
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [categories]);

  //set url params
  const setParamsUrl = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("category", category);
    const newUrl = `${pathname}/?${params.toString()}`;
    router.replace(newUrl, { scroll: false });
  };

  const deleteParamsUrl = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("category");
    const newUrl = `${pathname}/?${params.toString()}`;
    router.replace(newUrl, { scroll: false });
  };

  //set active button & set params
  function handleActiveButton(category: string) {
    if (categoryParams === category) {
      deleteParamsUrl();
    } else {
      setParamsUrl(category);
    }
  }

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
      {categories && categories.length > 0 && (
        <div className="relative flex items-center justify-center overflow-hidden p-2">
          {/* Scrollable Category Buttons */}
          <div ref={containerRef} className="flex items-center gap-2 overflow-x-auto whitespace-nowrap no-scrollbar px-8">
            {categories.map((category: string, i: number) => (
              <button
                key={category}
                type="button"
                className={`rounded-lg text-xs px-4 py-3 border transition-colors duration-300 ease-in-out hover:bg-muted text-muted-foreground ${
                  categoryParams === category ? "bg-black text-white dark:bg-white dark:text-black" : "dark:bg-transparent dark:text-white"
                }`}
                onClick={() => handleActiveButton(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {isOverflowing && (
            <>
              {/* Scroll Left Button */}
              <div className="absolute top-1/2 -translate-y-1/2 left-2 z-10">
                <button
                  type="button"
                  onClick={handleScrollLeft}
                  className="rounded-full bg-white dark:bg-gray-800 shadow-md p-2 hover:bg-muted transition-colors active:bg-muted-foreground"
                  style={{ marginLeft: "-10px" }}
                >
                  <ChevronLeft className="text-black dark:text-white" />
                </button>
              </div>

              {/* Scroll Right Button */}
              <div className="absolute top-1/2 -translate-y-1/2 right-2 z-10">
                <button
                  type="button"
                  onClick={handleScrollRight}
                  className="rounded-full bg-white dark:bg-gray-800 shadow-md p-2 hover:bg-muted transition-colors active:bg-muted-foreground"
                  style={{ marginRight: "-10px" }}
                >
                  <ChevronRight className="text-black dark:text-white" />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default CategoriesFilter;
