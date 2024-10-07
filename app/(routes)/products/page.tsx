import { Suspense } from "react";
import { getProducts } from "@/lib/db/queries/products";
import { IProductsQuery } from "@/lib/validation/productSchemas";
import ProductListSkeleton from "./components/product-list-skeleton";
import CategoriesFilter from "@/components/filter/categories-filter";
import FilterSidebarMobile from "@/components/filter/filter-sidebar-mobile";
import SortFilter from "@/components/filter/sort-filter";
import FilterSidebar from "@/components/filter/filter-sidebar";
import ProductList from "./components/product-list";
import GroupPagination from "@/components/group-pagination";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products",
  description: "Browse and discover products tailored to your preferences using various filters, including category, price range, and more.",
};

export const dynamic = "force-dynamic";

const ProductsPage = async ({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) => {
  const { perPage, productCounts } = await getProducts(searchParams as IProductsQuery);

  return (
    <section className="max-w-7xl mx-auto min-h-screen">
      <CategoriesFilter />
      <div className="flex justify-between items-center py-4 px-4">
        <FilterSidebarMobile productCounts={productCounts} />
        <div className="flex ml-auto">
          <SortFilter />
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-8 w-full overflow-hidden px-4">
        <div className="w-[200px]">
          <Suspense fallback={"loading...."}>
            <FilterSidebar />
          </Suspense>
        </div>
        <div className="flex flex-col gap-4 w-full">
          <Suspense fallback={<ProductListSkeleton />}>
            <ProductList searchParams={searchParams} />
          </Suspense>
          <GroupPagination totalPages={Math.ceil(productCounts / perPage)} />
        </div>
      </div>
    </section>
  );
};

export default ProductsPage;
