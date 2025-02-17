import Banner from "@/components/banner";
import { Suspense } from "react";
import ShopByCategory from "@/components/shop-by-category";
import FeaturedProducts from "@/components/featured-products";
import RelatedProducts from "@/components/related-products";
import TagsLink from "@/components/tags-link";
import { Skeleton } from "@/components/ui/skeleton";
import ImageSliderLoading from "@/components/loading/image-slider-loading";
import NoProducts from "@/components/no-products";
import { getproductCount } from "@/lib/db/queries/products";

export default async function HomePage() {
  const data = await getproductCount();

  return (
    <main className="w-full min-h-screen md:container py-10">
      {data.productCount > 0 ? (
        <>
          <TagsLink />
          <div className="flex flex-col space-y-20">
            <Suspense fallback={<Skeleton className="w-full flex-shrink-0 relative h-[200px] md:h-[400px] md:rounded-md overflow-hidden" />}>
              <Banner />
            </Suspense>
            <Suspense fallback={<ImageSliderLoading />}>
              <FeaturedProducts />
            </Suspense>
            <ShopByCategory />
            <Suspense fallback={<ImageSliderLoading />}>
              <RelatedProducts />
            </Suspense>
          </div>
        </>
      ) : (
        <NoProducts />
      )}
    </main>
  );
}
