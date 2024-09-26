"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PlusCircle } from "lucide-react";
import React, { useTransition } from "react";
import { IProduct } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";
import { useCartContext } from "@/providers/cart.provider";
import { useFavouriteItemContext } from "@/providers/favourite.Item.provider";
import { toast } from "sonner";
import { addToCart } from "@/actions/cart";

interface AddCartBtnProps {
  onClose: () => void;
  product?: IProduct;
}

const AddCartBtn: React.FC<AddCartBtnProps> = ({ onClose, product }) => {
  const [isPending, startTransition] = useTransition();
  const { selectedVariation, selectedNestedVariation, variationNotSelected, areAllNoStock } = useFavouriteItemContext();
  const { dispatch } = useCartContext();

  const addCart = async () => {
    if (!product) return;

    dispatch({
      type: "ADD_TO_CART",
      payload: {
        id: uuidv4(),
        productId: product.id,
        variationId: (selectedVariation?.id as string) ?? null,
        nestedVariationId: (selectedNestedVariation?.id as string) ?? null,
        variationType: product.variationType,
        quantity: 1,
        product: product,
        createdAt: null,
        updatedAt: null,
        cartId: "",
      },
    });
    onClose();

    const formData = new FormData();
    formData.append("productId", product.id);
    formData.append("variationType", product.variationType as string);
    formData.append("selectedVariationId", (selectedVariation?.id as string) ?? null);
    formData.append("selectedNestedVariationId", (selectedNestedVariation?.id as string) ?? null);

    const res = await addToCart(formData);
    if (res.error) {
      toast.error(res.error);
    }
  };

  return (
    <Button
      onClick={() => startTransition(addCart)}
      variant="outline"
      className={cn(
        "rounded-full  items-center shadow-lg w-full flex gap-2 px-6 dark:bg-white dark:text-black",
        variationNotSelected && "cursor-not-allowed"
      )}
      disabled={areAllNoStock || variationNotSelected}
    >
      <PlusCircle /> Add to cart
    </Button>
  );
};

export default React.memo(AddCartBtn);
