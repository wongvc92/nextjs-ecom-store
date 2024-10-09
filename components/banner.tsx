import { unstable_cache } from "next/cache";
import ImageSlider from "./image-slider";
import { getBanners } from "@/lib/db/queries/banners";

const getCachedBanners = unstable_cache(
  async () => {
    return await getBanners();
  },
  ["banners"],
  { tags: ["banners"] }
);
const Banner = async () => {
  const bannerImages = await getCachedBanners();
  if (!bannerImages) {
    return null;
  }
  return (
    <div className="w-full">
      <ImageSlider images={bannerImages} autoSlide={true} autoSlideInterval={3000} />
    </div>
  );
};

export default Banner;
