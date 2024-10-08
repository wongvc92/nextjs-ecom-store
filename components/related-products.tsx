import ProductSlider from "@/components/product-slider";
import { getFeaturedProduct } from "@/lib/db/queries/products";

export const revalidate = 60;

const RelatedProducts = async () => {
  const { featuredProducts } = await getFeaturedProduct();
  return <ProductSlider title="Products you might like" products={featuredProducts} />;
};

export default RelatedProducts;
