"use client";

import { increaseCartQuantity } from "@/actions/cart";
import React, { useTransition } from "react";
import { useCartItemContext } from "./cart.item.context";
import { useCartContext } from "./cart.context";
import { toast } from "sonner";

const IncreaseCartCounter = () => {
  const [isPending, startTransition] = useTransition();
  const { dispatch } = useCartContext();
  const { cartItem } = useCartItemContext();

  const handleIncreaseQuantity = async () => {
    if (!cartItem) return;
    dispatch({
      type: "INCREASE_CART_QUANTITY",
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
    const res = await increaseCartQuantity(formData);
    if (res?.error) {
      toast.error(res.error);
    }
  };
  return (
    <button
      onClick={() => startTransition(handleIncreaseQuantity)}
      className="flex justify-center items-center h-5 w-5 rounded-r-full text-xl text-muted-foreground"
    >
      +
    </button>
  );
};

export default IncreaseCartCounter;
