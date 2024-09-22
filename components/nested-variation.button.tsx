"use client";

import { Button } from "@/components/ui/button";
import { IProduct, IVariation } from "@/lib/types";
import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useState } from "react";

const NestedVariationButton = ({ product }: { product?: IProduct }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const variationParams = searchParams.get("v1")?.trim() || "";
  const nestedVariationParams = searchParams.get("v2")?.trim() || "";
  const selectedVariation =
    (variationParams && !nestedVariationParams && (product?.variations.find((item) => item.name === variationParams) as IVariation)) || null;
  const selectedNestedVariations =
    product && variationParams && product.variations.length > 0
      ? product?.variations.find((v) => v.id === variationParams)?.nestedVariations
      : product?.variations[0]?.nestedVariations;

  //set url params
  const setParamsUrl = useCallback(
    (id: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("v2", id);
      const newUrl = `${pathname}?${params.toString()}`;
      router.replace(newUrl, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  //delete url params
  const deleteParamsUrl = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("v2");
    const newUrl = `${pathname}?${params.toString()}`;
    router.replace(newUrl, { scroll: false });
  }, [pathname, router, searchParams]);

  const disableButton = (i: number) => {
    if (selectedVariation && selectedVariation.nestedVariations[i]?.stock === 0) {
      return true;
    }
    return false;
  };

  //set active button & set params
  function handleActiveButton(name: string, i: number, id: string) {
    if (nestedVariationParams && i === activeIndex) {
      deleteParamsUrl();
      setActiveIndex(null);
    } else {
      const index = selectedNestedVariations && selectedNestedVariations.findIndex((item) => item.id === id);
      if (index !== -1) {
        setActiveIndex(index!);
      }
      setParamsUrl(id);
    }
  }

  return (
    <>
      {product && product.variationType === "NESTED_VARIATION" && selectedNestedVariations && selectedNestedVariations.length > 0 && (
        <div className="space-y-2">
          <p>{selectedNestedVariations[0]?.label}</p>
          <div className="flex items-center flex-wrap gap-4">
            {selectedNestedVariations
              ?.sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""))
              .map((item, i) => (
                <Button
                  type="button"
                  variant="none"
                  key={item.id}
                  className={cn(
                    "shadow-lg text-xs rounded-full dark:bg-transparent dark:text-white dark:border hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black",
                    nestedVariationParams === item.id && "bg-black text-white dark:border-white dark:bg-white dark:text-black",
                    activeIndex === i && "bg-black text-white dark:border-white dark:bg-white dark:text-black",
                    !nestedVariationParams && "bg-white text-muted-foreground ",
                    disableButton(i) && "bg-zinc-200 cursor-not-allowed border-none dark:text-zinc-500 line-through"
                  )}
                  disabled={disableButton(i)}
                  onClick={() => handleActiveButton(item.name!, i, item.id!)}
                >
                  {item.name?.toUpperCase()}
                </Button>
              ))}
          </div>
        </div>
      )}
    </>
  );
};

export default NestedVariationButton;
