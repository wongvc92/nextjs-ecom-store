"use client";

import { removeCart } from "@/actions/cart";
import Spinner from "@/components/spinner";

import { ICartWithProduct, IProduct } from "@/lib/types";

import { cn } from "@/lib/utils";

import { Trash2Icon } from "lucide-react";
import React, { useTransition } from "react";
import { toast } from "sonner";
import { useCartItemContext } from "./cart.item.context";
import { useCartContext } from "./cart.context";
import { create } from "domain";

interface RemoveCartBtnProps {
  className?: string;
}

const RemoveCartBtn: React.FC<RemoveCartBtnProps> = ({ className }) => {
  const [isPending, startTransition] = useTransition();
  const { dispatch } = useCartContext();
  const { cartItem } = useCartItemContext();

  const onRemoveItem = async () => {
    dispatch({
      type: "REMOVE_CART_ITEM",
      payload: {
        ...cartItem,
        id: cartItem?.id as string,
        productId: cartItem?.product?.id as string,
        variationId: (cartItem?.variationId as string) ?? null,
        nestedVariationId: (cartItem?.nestedVariationId as string) ?? null,
        variationType: cartItem?.variationType as string,
        quantity: 1,
        product: cartItem?.product as IProduct,
        createdAt: cartItem?.createdAt as Date | null,
        updatedAt: cartItem?.updatedAt as Date | null,
        cartId: "",
      },
    });
    const formData = new FormData();
    formData.append("id", cartItem?.id as string);
    const res = await removeCart(formData);
    if (res.error) {
      toast.error(res.error);
    }
  };

  return (
    <form onSubmit={onRemoveItem}>
      <button type="submit" disabled={isPending} className={cn("flex justify-center items-center", className)}>
        <Trash2Icon className="h-5 w-5 text-muted-foreground" />
      </button>
    </form>
  );
};

export default RemoveCartBtn;
