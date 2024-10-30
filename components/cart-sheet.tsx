"use client";

import React, { useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ShoppingBag } from "lucide-react";
import Cart from "./carts/cart";
import { useCartContext } from "../providers/cart.provider";
import CartCheckout from "./carts/cart-checkout";
import { useSearchParams } from "next/navigation";
import { removeAllcartItems } from "@/actions/cart";
import { toast } from "sonner";

const CartSheet = () => {
  const { cartItemsQuantity, dispatch, isOpen, setIsOpen } = useCartContext();

  const params = useSearchParams();

  const deleteCart = useCallback(async () => {
    dispatch({ type: "CLEAR_CART_ITEM" });
    if (params.has("success")) {
      const res = await removeAllcartItems();
      if (res.error) {
        toast.error(res.error);
      } else if (res.success) {
        toast.success(res.success);
      }
    }
  }, [dispatch, params]);

  useEffect(() => {
    deleteCart();
    () => toast.dismiss();
  }, [deleteCart]);

  return (
    <Sheet open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
      <SheetTrigger asChild>
        <Button variant="outline" className="flex items-center gap-1" onClick={() => setIsOpen(true)}>
          <ShoppingBag />
          <span className="text-xs text-muted-foreground font-light"> {cartItemsQuantity}</span>
        </Button>
      </SheetTrigger>

      <SheetContent className="w-full overflow-y-scroll">
        <Cart />
        <CartCheckout />
      </SheetContent>
    </Sheet>
  );
};

export default CartSheet;
