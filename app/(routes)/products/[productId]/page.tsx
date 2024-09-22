import { Suspense } from "react";
import Product from "./components/product";
import { ProductByIdProvider } from "@/app/(routes)/products/[productId]/components/productById.provider";
import Loading from "./loading";
import { getFeaturedProduct, getProductById } from "@/lib/db/queries/products";

const ProductPageById = async ({ params }: { params: { productId: string } }) => {
  const { productId } = params;
  const { product } = await getProductById(productId);
  const { featuredProducts } = await getFeaturedProduct();

  return (
    <Suspense fallback={<Loading />}>
      <ProductByIdProvider product={product}>
        <Product featuredProducts={featuredProducts} />
      </ProductByIdProvider>
    </Suspense>
  );
};

export default ProductPageById;
