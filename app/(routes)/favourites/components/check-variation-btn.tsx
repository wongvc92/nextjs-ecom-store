"use client";

import { Button } from "@/components/ui/button";
import FavouritesModal from "./favourites-modal";
import { useFavouriteItemContext } from "@/app/(routes)/favourites/components/favourite.Item.provider";
import AddCartBtn from "./add-cart-btn";
import { useModal } from "@/providers/modal.provider";
import Modal from "@/components/ui/modal";
import { DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";
import VariationButton from "@/components/variation-button";
import NestedVariationButton from "@/components/nested-variation.button";

const CheckVariationButton = () => {
  const { favouriteProduct, selectedImage, selectedPrice } = useFavouriteItemContext();
  const { closeModal, openModal } = useModal();

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
      openModal("favouritesModal");
    }
  };
  return (
    <>
      {!isVariation() ? (
        <AddCartBtn product={favouriteProduct} onClose={closeModal} />
      ) : (
        <Button type="button" variant="outline" onClick={handleClick} className="rounded-full w-full">
          {isVariation() ? "Select variation" : "Add to cart"}
        </Button>
      )}
      <Modal modalName="favouritesModal">
        <DialogHeader>
          <DialogTitle className="text-left">Select variation</DialogTitle>
          <span className="text-left">RM{selectedPrice}</span>
          <DialogDescription className="text-left pt-5">Choose</DialogDescription>
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
      </Modal>
    </>
  );
};

export default CheckVariationButton;
