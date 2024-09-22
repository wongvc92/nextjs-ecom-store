"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PlusCircle } from "lucide-react";
import React, { useTransition } from "react";
import { addToCart } from "@/actions/cart";
import { IProduct } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";

import { useProductByIdContext } from "@/app/(routes)/products/[productId]/components/productById.provider";
import { toast } from "sonner";
import { useCartContext } from "@/components/carts/cart.context";

interface AddCartBtnProps {
  product?: IProduct;
}

const AddCartBtn: React.FC<AddCartBtnProps> = ({ product }) => {
  const [isPending, startTransition] = useTransition();
  const { areAllNoStock, isVariationNotSelected, selectedVariation, selectedNestedVariation } = useProductByIdContext();
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

    const formData = new FormData();
    formData.append("productId", product.id);
    formData.append("variationType", product.variationType as string);
    formData.append("selectedVariationId", (selectedVariation?.id as string) ?? null);
    formData.append("selectedNestedVariationId", (selectedNestedVariation?.id as string) ?? null);

    const res = await addToCart(formData);
    if (res?.error) {
      toast.error(res.error);
    }
  };

  return (
    <Button
      onClick={() => startTransition(addCart)}
      variant="outline"
      className={cn(
        "rounded-full  items-center shadow-lg w-full flex gap-2 px-6 dark:bg-white dark:text-black",
        isVariationNotSelected && "cursor-not-allowed"
      )}
      disabled={areAllNoStock || isVariationNotSelected}
      type="submit"
    >
      <PlusCircle /> Add to cart
    </Button>
  );
};

export default React.memo(AddCartBtn);
