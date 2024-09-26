"use client";

import { decreaseCartQuantity } from "@/actions/cart";
import React, { useTransition } from "react";
import { toast } from "sonner";
import { useCartItemContext } from "../../providers/cart.item.provider";
import { useCartContext } from "../../providers/cart.provider";

const DecreaseCartCounter = () => {
  const [isPending, startTransition] = useTransition();
  const { cartItem } = useCartItemContext();
  const { dispatch } = useCartContext();
  const handleDecreaseQuantity = async () => {
    if (!cartItem) return;
    dispatch({
      type: "DECREASE_CART_QUANTITY",
      payload: {
        ...cartItem,
        id: cartItem.id,
        product: cartItem.product,
        productId: cartItem.productId,
        quantity: cartItem.quantity,
        variationType: cartItem.variationType,
        variationId: cartItem.variationId,
        nestedVariationId: cartItem.nestedVariationId,
      },
    });
    const formData = new FormData();
    formData.append("id", cartItem.id);

    const res = await decreaseCartQuantity(formData);
    if (res?.error) {
      toast.error(res.error);
    }
  };
  return (
    <button
      onClick={() => startTransition(handleDecreaseQuantity)}
      className="flex justify-center items-center h-5 w-5 rounded-l-full text-xl text-muted-foreground"
    >
      -
    </button>
  );
};

export default DecreaseCartCounter;
