import { Suspense } from "react";
import Products from "./components/products";
import Loading from "./loading";
import { getProducts } from "@/lib/db/queries/products";
import { IProductsQuery } from "@/lib/validation/productSchemas";

const ProductsPage = async ({ searchParams }: { searchParams: IProductsQuery }) => {
  const { products, perPage, productCounts } = await getProducts(searchParams);

  return (
    <Suspense fallback={<Loading />}>
      <Products products={products} totalPages={Math.ceil(productCounts / perPage)} productCounts={productCounts} />
    </Suspense>
  );
};

export default ProductsPage;
