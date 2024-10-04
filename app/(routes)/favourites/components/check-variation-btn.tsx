"use client";

import { Button } from "@/components/ui/button";
import { useFavouriteItemContext } from "@/providers/favourite.Item.provider";
import AddCartBtn from "./add-cart-btn";

import VariationButton from "@/components/variation-button";
import NestedVariationButton from "@/components/nested-variation.button";
import { currencyFormatter } from "@/lib/utils";
import { DrawerModal } from "./drawer-modal";
import { useState } from "react";
import Image from "next/image";

const CheckVariationButton = () => {
  const { favouriteProduct, selectedPrice, selectedImage } = useFavouriteItemContext();
  const [isOpen, setIsOpen] = useState(false);

  const isVariation = () => {
    if (favouriteProduct?.variationType === "NESTED_VARIATION" || favouriteProduct?.variationType === "VARIATION") {
      return true;
    }
    return false;
  };

  const handleClick = () => {
    if (!isVariation()) {
      return;
    } else {
      setIsOpen(true);
    }
  };
  return (
    <div>
      {!isVariation() ? (
        <AddCartBtn product={favouriteProduct} onClose={() => setIsOpen(false)} />
      ) : (
        <Button type="button" variant="outline" onClick={handleClick} className="rounded-full w-full">
          {isVariation() ? "Select variation" : "Add to cart"}
        </Button>
      )}
      <DrawerModal
        isOpen={isOpen}
        closeModal={() => setIsOpen(false)}
        title={favouriteProduct?.name ?? ""}
        description={currencyFormatter(selectedPrice)}
      >
        <div className="flex flex-col gap-6 p-4 md:p-0">
          <div className="space-y-4 flex-col md:flex-row w-full flex gap-6 ">
            <div className="h-[200px] w-[200px]  relative overflow-hidden rounded-md md:w-full">
              <Image src={selectedImage} alt="image" fill className="object-cover" />
            </div>

            <div className="flex flex-col gap-2 w-full">
              <p>Select variation</p>
              <VariationButton product={favouriteProduct} />
              <NestedVariationButton product={favouriteProduct} />
            </div>
          </div>
          <AddCartBtn
            product={favouriteProduct}
            onClose={() => {
              setIsOpen(false);
            }}
          />
        </div>
      </DrawerModal>
    </div>
  );
};

export default CheckVariationButton;
