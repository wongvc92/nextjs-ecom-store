import React from "react";
import ProductDetails from "./product-details";
import ImageSlider from "./product-image-slider";
import ProductSlider from "@/components/product-slider";
import { IProduct } from "@/lib/types";

const Product = ({ featuredProducts }: { featuredProducts: IProduct[] }) => {
  return (
    <section className="max-w-4xl min-h-screen mx-auto py-10">
      <div className="flex flex-col sm:flex-row w-full md:px-4 gap-4">
        <div className="w-full md:w-1/2">
          <ImageSlider />
        </div>
        <div className="w-full md:w-1/2 ">
          <ProductDetails />
        </div>
      </div>
      <div className="w-full">
        <ProductSlider title="Products you might like" products={featuredProducts} />
      </div>
    </section>
  );
};

export default Product;
