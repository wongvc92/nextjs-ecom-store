"use client";

import { Separator } from "@/components/ui/separator";
import { ChevronDownIcon, ShoppingBag } from "lucide-react";
import React, { useCallback, useState } from "react";
import { useCartContext } from "../../providers/cart.provider";
import { currencyFormatter } from "@/lib/utils";
import { CartItemWithProduct } from "@/lib/db/queries/carts";
import dynamic from "next/dynamic";
import { IProduct } from "@/lib/types";
import { findSelectedProductPrice } from "@/lib/helper/productHelpers";
import { findCartItemVariation, findTotalPricePerCartItem } from "@/lib/helper/cartHelpers";
import { Button } from "../ui/button";
import ShippingCost from "./shipping-cost";

const MemberCheckoutButton = dynamic(() => import("@/components/member-checkout-btn"), { ssr: false });
const GuestCheckOutButton = dynamic(() => import("@/components/guest-checkout-btn"), { ssr: false });

const CartCheckout = () => {
  const { cartItems, subtotalCartItems, totalPrice, foundCourier } = useCartContext();
  const [showDetails, setShowDetails] = useState(false);

  const memoizedSelectedPrice = useCallback((cartItem: CartItemWithProduct) => {
    return findSelectedProductPrice(cartItem.variationId as string, cartItem.nestedVariationId as string, cartItem.product as IProduct);
  }, []);

  const memoizedTotalPricePerItem = useCallback((cartItem: CartItemWithProduct) => {
    return findTotalPricePerCartItem(cartItem);
  }, []);

  const memoizedCartItemVariation = useCallback((cartItem: CartItemWithProduct) => {
    const name = findCartItemVariation(cartItem);
    return name;
  }, []);

  console.log("cartItems", cartItems);
  return (
    <>
      {(!!cartItems || cartItems !== null) && (
        <div className="w-full rounded-md bg-gray-50 px-4 py-10 bg-inherit">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold">Summary</h4>

              <Button
                type="button"
                size="icon"
                variant="none"
                className="text-xs font-light text-muted-foreground w-fit flex items-center"
                onClick={() => setShowDetails(!showDetails)}
              >
                Show details <ChevronDownIcon className={`${showDetails ? "rotate-180 duration-300" : ""}`} />
              </Button>
            </div>
            <div className={`space-y-6 overflow-hidden transition-all duration-300 ${showDetails ? "max-h-screen" : "max-h-0"}`}>
              {cartItems?.map((cartItem) => (
                <div key={cartItem.id} className="flex flex-col gap-2">
                  <p className="text-xs capitalize">{cartItem.product?.name ?? ""}</p>
                  <span className="text-xs">{memoizedCartItemVariation(cartItem)} </span>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-muted-foreground flex gap-1 items-center">
                      <ShoppingBag />
                      <span>
                        {currencyFormatter(memoizedSelectedPrice(cartItem))} x {cartItem.quantity}
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground">{currencyFormatter(memoizedTotalPricePerItem(cartItem))}</p>
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
              <ShippingCost />
            </div>
            <Separator />
            <div className="flex justify-between">
              <p className="text-normal font-medium">Total</p>
              <p className="font-extrabold">{!foundCourier ? null : currencyFormatter(parseInt(totalPrice))}</p>
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
