import React from "react";
import ProductList from "./product-list";
import { IProduct } from "@/lib/types";
import FilterSidebar from "@/components/filter/filter-sidebar";
import FilterSidebarMobile from "@/components/filter/filter-sidebar-mobile";
import CategoriesFilter from "@/components/filter/categories-filter";

import SortFilter from "@/components/filter/sort-filter";
import GroupPagination from "@/components/group-pagination";

interface ProductsProps {
  products?: IProduct[] | null;
  totalPages: number;
  productCounts: number;
}
const Products: React.FC<ProductsProps> = ({ products, totalPages, productCounts }) => {
  return (
    <div className="max-w-7xl mx-auto min-h-screen">
      <CategoriesFilter />
      <div className="flex justify-between items-center py-4 px-4">
        <FilterSidebarMobile productCounts={productCounts} />
        <div className="flex ml-auto">
          <SortFilter />
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-8 w-full overflow-hidden px-4">
        <div className="w-[200px]">
          <FilterSidebar />
        </div>
        <div className="flex flex-col gap-4 w-full">
          <ProductList products={products} />
          <GroupPagination totalPages={totalPages} />
        </div>
      </div>
    </div>
  );
};

export default Products;
