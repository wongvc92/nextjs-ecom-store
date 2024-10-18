"use client";

import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import ProductModal from "./product-modal";
import FavouriteButton from "@/components/favourite-btn";
import { currencyFormatter } from "@/lib/utils";
import AddCartBtn from "@/app/(routes)/products/[productId]/components/add-cart-btn";
import { useProductByIdContext } from "@/providers/productById.provider";
import VariationButton from "@/components/variation-button";
import NestedVariationButton from "@/components/nested-variation.button";

const ProductDetails = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { product, selectedProductPrice, selectedProductStock } = useProductByIdContext();

  return (
    <>
      {product && (
        <div className="flex flex-col items-start space-y-10  pb-20  w-full  relative px-4">
          <div className="flex justify-between w-full">
            <div className="space-y-2">
              <h3 className="md:text-xl font-semibold capitalize">{product?.name}</h3>
              <p className="text-sm font-semibold"> {currencyFormatter(selectedProductPrice)}</p>

              <p className="font-light text-sm capitalize">{selectedProductStock} pieces available</p>
            </div>
            <FavouriteButton className="bg-white  rounded-full w-6 h-6 p-1 z-10 opacity-80 shadow-md" product={product} />
          </div>
          <VariationButton product={product} />
          <NestedVariationButton product={product} />
          <AddCartBtn product={product} />
          <div>
            <p className="text-sm break-all line-clamp-3">{product.description}</p>
          </div>

          <Button variant="link" onClick={() => setIsOpen(true)} className="font-semibold underline ">
            View Product Details
          </Button>
          <ProductModal isOpen={isOpen} product={product} onClose={() => setIsOpen(false)} title={product?.name} description={product?.description} />
        </div>
      )}
    </>
  );
};

export default ProductDetails;
