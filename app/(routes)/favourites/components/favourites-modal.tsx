"use client";

import { DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";

import VariationButton from "@/components/variation-button";
import NestedVariationButton from "@/components/nested-variation.button";
import AddCartBtn from "./add-cart-btn";
import { IProduct } from "@/lib/types";
import { useModal } from "@/providers/modal.provider";

interface FavouritesModalProps {
  description?: string;
  favouriteProduct?: IProduct;
  selectedImage: string;
  selectedPrice: number;
}

const FavouritesModal: React.FC<FavouritesModalProps> = ({ description, favouriteProduct, selectedImage, selectedPrice }) => {
  const { closeModal } = useModal();
  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-left">Select variation</DialogTitle>
        <span className="text-left">RM{selectedPrice}</span>
        <DialogDescription className="text-left pt-5">{description}</DialogDescription>
      </DialogHeader>

      <div className="flex flex-col gap-6">
        <div className="space-y-4 flex-col  md:pl-4 md:flex-row w-full flex gap-6">
          <div className="aspect-square w-full md:w-1/2 relative overflow-hidden rounded-md ">
            <Image src={selectedImage} alt="image" fill className="object-cover" />
          </div>

          <div className="flex flex-col gap-2 ">
            <VariationButton product={favouriteProduct} />
            <NestedVariationButton product={favouriteProduct} />
          </div>
        </div>
        <AddCartBtn product={favouriteProduct} onClose={closeModal} />
      </div>

      {/* {showSelectButton()} */}
      {/* <div>{children}</div> */}
    </>
  );
};
export default FavouritesModal;
