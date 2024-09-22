"use client";

import { Separator } from "@/components/ui/separator";
import { ShoppingBag, Truck } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect } from "react";
import { toast } from "sonner";
import { useCartContext } from "./cart.context";
import {
  capitalizeSentenceFirstChar,
  currencyFormatter,
  findSelectedProductPrice,
  findTotalPricePerCartItem,
  findTotalShippingFeePerItem,
} from "@/lib/utils";
import { CartItemWithProduct } from "@/lib/db/queries/carts";
import dynamic from "next/dynamic";
import { IProduct } from "@/lib/types";
import { removeAllcartItems, removeCart } from "@/actions/cart";

const MemberCheckoutButton = dynamic(() => import("@/components/member-checkout-btn"), { ssr: false });
const GuestCheckOutButton = dynamic(() => import("@/components/guest-checkout-btn"), { ssr: false });

const CartCheckout = () => {
  const { cartItems, subShippingFeeCartItems, subtotalCartItems, totalPrice, dispatch } = useCartContext();

  const memoizedTotalShippingFeePerItem = useCallback((cartItem: CartItemWithProduct) => {
    return findTotalShippingFeePerItem(cartItem);
  }, []);

  const memoizedSelectedPrice = useCallback((cartItem: CartItemWithProduct) => {
    return findSelectedProductPrice(cartItem.variationId as string, cartItem.nestedVariationId as string, cartItem.product as IProduct);
  }, []);

  const memoizedTotalPricePerItem = useCallback((cartItem: CartItemWithProduct) => {
    return findTotalPricePerCartItem(cartItem);
  }, []);

  return (
    <>
      {(!!cartItems || cartItems !== null) && (
        <div className="w-full rounded-md bg-gray-50 px-4 py-10 bg-inherit">
          <div className="flex flex-col space-y-4">
            <h4 className="font-bold">Summary</h4>
            <div className="space-y-6">
              {cartItems?.map((cartItem) => (
                <div key={cartItem.id} className="flex flex-col gap-2">
                  <p className="text-xs">{capitalizeSentenceFirstChar(cartItem.product?.name ?? "")}</p>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-muted-foreground flex gap-1 items-center">
                      <ShoppingBag />
                      <span>
                        {currencyFormatter(memoizedSelectedPrice(cartItem))} x {cartItem.quantity}
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground">{currencyFormatter(memoizedTotalPricePerItem(cartItem))}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Truck />
                      <span>
                        {currencyFormatter(parseInt(cartItem.product?.shippingFeeInCents.toString() as string))} x {cartItem.quantity}
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground">{currencyFormatter(memoizedTotalShippingFeePerItem(cartItem))}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between pt-4">
              <p className="text-normal text-muted-foreground">Subtotal</p>
              <p className="font-bold">{currencyFormatter(parseInt(subtotalCartItems))}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-normal text-muted-foreground">Delivery</p>
              <p className="font-bold">{currencyFormatter(parseInt(subShippingFeeCartItems))}</p>
            </div>
            <Separator />
            <div className="flex justify-between">
              <p className="text-normal font-medium">Total</p>
              <p className="font-extrabold">{currencyFormatter(parseInt(totalPrice))}</p>
            </div>
            <Separator />

            <MemberCheckoutButton />
            <GuestCheckOutButton />
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(CartCheckout);
