"use client";
import { Button } from "@/components/ui/button";
import { IProduct } from "@/lib/types";
import { cn } from "@/lib/utils";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const VariationButton = ({ product }: { product?: IProduct }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const variationParams = searchParams.get("v1")?.trim() || "";

  //set url params
  const setParamsUrl = (id: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("v1", id);
    params.delete("v2");
    const newUrl = `${pathname}?${params.toString()}`;
    router.replace(newUrl, { scroll: false });
  };

  const deleteParamsUrl = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("v1");
    const newUrl = `${pathname}?${params.toString()}`;
    router.replace(newUrl, { scroll: false });
  };

  //set active button & set params
  function handleActiveButton(id: string, name: string, i: number) {
    if (!product) return;
    if (variationParams && activeIndex === i) {
      setActiveIndex(null);
      deleteParamsUrl();
    } else {
      const index = product.variations.findIndex((item) => item.id === id);
      if (index !== -1) {
        setActiveIndex(index);
        setParamsUrl(id);
      }
    }
  }

  //return true if all the stock of nestedvariation is equal to "0"
  const disableButton = () => {
    if (!!product && !!product.variationType && product.variationType === "VARIATION") {
      return product.variations.every((v) => !!v.stock && v.stock === 0);
    } else if (!!product && !!product.variationType && product.variationType === "NESTED_VARIATION") {
      return (
        !!product.variations &&
        product.variations.every((v) => !!v.nestedVariations && v.nestedVariations.every((nv) => !!nv.stock && nv.stock === 0))
      );
    }
    return false;
  };

  return (
    <>
      {((product && product.variationType === "NESTED_VARIATION") || (product && product.variationType === "VARIATION")) &&
        product.variations &&
        product.variations.length > 0 && (
          <div className="space-y-2">
            <p>{product.variations[0]?.label}</p>
            <div className="flex items-center flex-wrap gap-4">
              {product.variations
                ?.sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""))
                .map((item, i) => (
                  <Button
                    type="button"
                    variant="none"
                    key={item.id}
                    className={cn(
                      "shadow-lg text-xs  rounded-full border hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black dark:bg-transparent dark:text-white",
                      variationParams === item.id && "bg-black text-white dark:border-white dark:bg-white dark:text-black",
                      activeIndex === i && "border-black text-white  dark:border-white dark:bg-white dark:text-black",
                      !variationParams && "bg-white text-muted-foreground",
                      disableButton() && "bg-zinc-200 cursor-not-allowed border-none dark:text-zinc-500 line-through"
                    )}
                    disabled={disableButton()}
                    onClick={() => handleActiveButton(item.id as string, item.name!, i)}
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

export default VariationButton;
