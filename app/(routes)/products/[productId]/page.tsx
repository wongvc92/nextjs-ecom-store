import { Suspense } from "react";
import Product from "./components/product";
import { ProductByIdProvider } from "@/app/(routes)/products/[productId]/components/productById.provider";
import Loading from "./loading";
import { getFeaturedProduct, getProductById, getProductIds } from "@/lib/db/queries/products";

export const generateStaticParams = async () => {
  const productsId = await getProductIds();

  if (!productsId || productsId.length === 0) {
    return [];
  }

  return productsId.map((product) => ({
    productId: product.id,
  }));
};

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
