import Banner from "@/components/banner";
import { Suspense } from "react";
import ShopByCategory from "@/components/shop-by-category";
import FeaturedProducts from "@/components/featured-products";
import RelatedProducts from "@/components/related-products";
import TagsLink from "@/components/tags-link";

export default async function Home() {
  return (
    <main className="w-full min-h-screen md:container py-10">
      <TagsLink />
      <div className="flex flex-col space-y-20">
        <Banner />
        <FeaturedProducts />
        <ShopByCategory />
        <RelatedProducts />
      </div>
    </main>
  );
}
