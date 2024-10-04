"use client";

import { toast } from "sonner";
import { useCartItemContext } from "../../providers/cart.item.provider";
import { useCartContext } from "../../providers/cart.provider";
import { useRef, useTransition } from "react";
import { updatecartItemsByNestedVariation } from "@/actions/cart";

const NestedVariationSelect = () => {
  const { dispatch } = useCartContext();
  const { cartItem } = useCartItemContext();
  const selectRef = useRef<HTMLSelectElement>(null);
  const [isPending, startTransition] = useTransition();

  const handleNestedVariationChange = async () => {
    if (selectRef.current === null || !cartItem) return;

    const selectedOption = selectRef.current.options[selectRef.current.selectedIndex];
    dispatch({
      type: "UPDATE_CART_BY_NESTED_VARIATION",
      payload: {
        ...cartItem,
        id: cartItem.id,
        product: cartItem.product,
        productId: cartItem.productId,
        quantity: cartItem.quantity,
        variationType: cartItem.variationType,
        variationId: cartItem.variationId,
        nestedVariationId: cartItem.nestedVariationId,
        newNestedVariationId: selectedOption.value,
      },
    });
    const formData = new FormData();
    formData.append("id", cartItem.id);
    formData.append("newNestedVariationId", selectedOption.value);
    formData.append("quantity", cartItem.quantity.toString());
    await updatecartItemsByNestedVariation(formData);
  };

  return (
    <>
      {cartItem && cartItem.variationType === "NESTED_VARIATION" && (
        <select
          ref={selectRef}
          className="border rounded-md px-4 py-2 flex justify-center w-fit text-xs font-light text-muted-foreground"
          defaultValue={cartItem.nestedVariationId!}
          onChange={() => startTransition(handleNestedVariationChange)}
          disabled={isPending}
        >
          {cartItem.product?.variations
            ?.find((v) => v.id === cartItem.variationId)
            ?.nestedVariations.filter((nv) => nv.stock !== 0)
            .map((nv) => (
              <option key={nv.id} value={nv.id as string} className="text-xs font-light text-muted-foreground">
                {nv?.name?.toUpperCase()}
              </option>
            ))}
        </select>
      )}
    </>
  );
};

export default NestedVariationSelect;
