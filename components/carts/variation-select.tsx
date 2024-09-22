"use client";

import React, { useRef, useTransition } from "react";
import { toast } from "sonner";
import { useCartItemContext } from "./cart.item.context";
import { useCartContext } from "./cart.context";
import { useSession } from "next-auth/react";
import { updatecartItemsByVariation } from "@/actions/cart";

const VariationSelect = () => {
  const { data } = useSession();
  const { dispatch } = useCartContext();
  const { cartItem } = useCartItemContext();
  const [isPending, startTransition] = useTransition();

  const selectRef = useRef<HTMLSelectElement>(null);
  const handleChangeVariation = async () => {
    startTransition(async () => {
      if (selectRef.current === null || !cartItem) return;

      const selectedOption = selectRef.current.options[selectRef.current.selectedIndex];
      dispatch({
        type: "UPDATE_CART_BY_VARIATION",
        payload: {
          ...cartItem,
          id: cartItem.id,
          product: cartItem.product,
          productId: cartItem.productId,
          quantity: cartItem.quantity,
          variationType: cartItem.variationType,
          variationId: cartItem.variationId,
          nestedVariationId: cartItem.nestedVariationId,
          newVariationId: selectedOption.value,
        },
      });
      const formData = new FormData();
      formData.append("id", cartItem.id);

      formData.append("previousProductId", cartItem.productId);
      formData.append("quantity", cartItem.quantity.toString());
      formData.append("newVariationId", selectedOption.value);
      const res = await updatecartItemsByVariation(formData);

      if (res.error) {
        toast.error(res.error);
      }
    });
  };
  return (
    <>
      {cartItem && cartItem.variationType === "VARIATION" && (
        <select
          className="border rounded-md px-4 py-2 flex justify-center w-fit  font-light text-muted-foreground"
          onChange={() => startTransition(handleChangeVariation)}
          value={cartItem.variationId!}
          disabled={isPending}
        >
          {cartItem.product?.variations
            .filter((v) => v.stock !== 0)
            .map((v) => (
              <option key={v.id} value={v.id as string} className="text-xs font-light text-muted-foreground">
                {v?.name?.toUpperCase()}
              </option>
            ))}
        </select>
      )}
    </>
  );
};

export default VariationSelect;
