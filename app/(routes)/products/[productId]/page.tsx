import { ProductByIdProvider } from "@/providers/productById.provider";
import { getProductById, getProductIds } from "@/lib/db/queries/products";
import ProductDetails from "./components/product-details";
import ProductImageSlider from "./components/product-image-slider";
import RelatedProducts from "../../../../components/related-products";
import { Metadata } from "next";
import { Suspense } from "react";
import ImageSliderLoading from "@/components/loading/image-slider-loading";

export const dynamic = "auto";

export const generateStaticParams = async () => {
  const productsId = await getProductIds();

  if (!productsId || productsId.length === 0) {
    return [];
  }

  return productsId.map((product) => ({
    productId: product.id,
  }));
};

export async function generateMetadata({ params }: { params: { productId: string } }): Promise<Metadata> {
  const product = await getProductById(params.productId);
  const productName = product?.name || "Product";

  return {
    title: `${productName} - Buy Now at Our Store`,
    description: `Explore details, features, and pricing for ${productName}. Find related products and discover more items tailored to your preferences.`,
  };
}

const ProductPageById = async ({ params }: { params: { productId: string } }) => {
  const { productId } = params;
  const product = await getProductById(productId);

  if (!product) {
    return <div className="max-w-4xl min-h-screen mx-auto py-10">Product not found</div>;
  }

  return (
    <ProductByIdProvider product={product}>
      <section className="max-w-4xl min-h-screen mx-auto ">
        <div className="md:py-10 space-y-6">
          <div className="flex flex-col lg:flex-row w-full md:px-4 gap-4">
            <div className="w-full lg:w-1/2">
              <ProductImageSlider />
            </div>
            <div className="w-full lg:w-1/2 ">
              <ProductDetails />
            </div>
          </div>

          <Suspense fallback={<ImageSliderLoading />}>
            <div className="w-full pb-6 pt-4">
              <RelatedProducts />
            </div>
          </Suspense>
        </div>
      </section>
    </ProductByIdProvider>
  );
};

export default ProductPageById;
