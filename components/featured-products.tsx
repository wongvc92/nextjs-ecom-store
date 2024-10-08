import { getFeaturedProduct } from "@/lib/db/queries/products";
import ProductSlider from "./product-slider";

export const revalidate = 60;

const FeaturedProducts = async () => {
  const { featuredProducts } = await getFeaturedProduct();
  return <ProductSlider title="Featured Products" products={featuredProducts} />;
};

export default FeaturedProducts;
