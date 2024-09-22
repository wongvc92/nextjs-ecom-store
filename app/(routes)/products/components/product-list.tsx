import ProductCard from "./product-card";
import { IProduct } from "@/lib/types";
import ResetFilterButton from "@/components/filter/reset-filter-button";

interface IProductList {
  products?: IProduct[] | null;
}

const ProductList: React.FC<IProductList> = ({ products }) => {
  return (
    <>
      {!products || products.length === 0 ? (
        <div className="flex justify-center items-center">
          <div className="flex flex-col items-center  gap-4">
            Products not found.
            <ResetFilterButton />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4  gap-2 sm:gap-4">
          {products?.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      )}
    </>
  );
};

export default ProductList;
