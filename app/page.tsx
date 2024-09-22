import Banner from "@/components/banner";
import ProductSlider from "@/components/product-slider";
import { Suspense } from "react";

import ShopByCategory from "@/components/shop-by-category";
import Link from "next/link";
import { capitalizeSentenceFirstChar } from "@/lib/utils";

import { getFeaturedProduct } from "@/lib/db/queries/products";
import { getBanners } from "@/lib/db/queries/banners";
import Loading from "./loading";

const PRODUCT_TAGS = [
  { id: 1, label: "all products", path: "/products" },
  { id: 1, label: "men", path: "/products?tags=men" },
  { id: 1, label: "women", path: "/products?tags=women" },
] as const;
export default async function Home() {
  const { featuredProducts } = await getFeaturedProduct();
  const { bannerImages } = await getBanners();

  return (
    <Suspense fallback={<Loading />}>
      <main className="w-full min-h-screen md:container py-10">
        <div className="pb-4 flex gap-4 justify-center text-sm">
          {PRODUCT_TAGS.map((item) => (
            <Link key={item.id} href={item.path}>
              {capitalizeSentenceFirstChar(item.label)}
            </Link>
          ))}
        </div>
        <div className="flex flex-col space-y-20">
          <Banner bannerImages={bannerImages} />
          <ProductSlider title="Featured Products" products={featuredProducts} />
          <ShopByCategory />
          <ProductSlider title="Popular Products" products={featuredProducts} />
        </div>
      </main>
    </Suspense>
  );
}
