"use client";

import React, { useCallback } from "react";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import RemoveCartBtn from "./remove-cart-btn";
import VariationSelect from "./variation-select";
import NestedVariationSelect from "./nested-variation-select";
import CartCounter from "./cart-counter";

import { CartItemProvider } from "../../providers/cart.item.provider";
import { CartItemWithProduct } from "@/lib/db/queries/carts";
import { IProduct } from "@/lib/types";
import { findTotalPricePerCartItem } from "@/lib/helper/cartHelpers";
import { findSelectedProductImage, findSelectedProductPrice, shortenedProductName } from "@/lib/helper/productHelpers";
import { capitalizeSentenceFirstChar, currencyFormatter } from "@/lib/utils";

interface CartCardProps {
  cartItem: CartItemWithProduct;
}

const CartCard: React.FC<CartCardProps> = ({ cartItem }) => {
  const memoizedTotalPricePerCartItem = useCallback(() => findTotalPricePerCartItem(cartItem), [cartItem]);
  const memoizedCartImage = useCallback(() => findSelectedProductImage(cartItem.variationId as string, cartItem.product as IProduct), [cartItem]);

  const variationName =
    cartItem && cartItem.variationType === "NESTED_VARIATION" ? cartItem?.product?.variations.find((v) => v.id === cartItem.variationId)?.name : "";

  return (
    <>
      <CartItemProvider cartItem={cartItem}>
        <div className="grid grid-cols-3 gap-4 pt-10 w-full ">
          {/* image */}
          <div className="aspect-square w-full relative rounded-md overflow-hidden ">
            <Image src={memoizedCartImage()} alt="product image" fill className="object-cover" />
            <RemoveCartBtn className="absolute top-2 right-2 bg-white p-1 w-6 h-6 rounded-full z-10" />
          </div>

          {/* details */}
          <div className="flex flex-col  gap-1 h-full w-full">
            <h4 className="text-sm">{shortenedProductName(cartItem.product?.name as string)}</h4>

            <p className="text-xs text-muted-foreground">
              {currencyFormatter(
                findSelectedProductPrice(cartItem.variationId as string, cartItem.nestedVariationId as string, cartItem.product as IProduct)
              )}
            </p>
            <p className="text-xs text-muted-foreground">{capitalizeSentenceFirstChar(variationName as string)}</p>
            <VariationSelect />
            <NestedVariationSelect />
          </div>
          <div className="flex flex-col items-end justify-between h-full ">
            <div>
              <p className="text-sm font-bold">{currencyFormatter(memoizedTotalPricePerCartItem())}</p>
            </div>
            <CartCounter />
          </div>
        </div>
        <Separator className="my-5" />
      </CartItemProvider>
    </>
  );
};

export default CartCard;
