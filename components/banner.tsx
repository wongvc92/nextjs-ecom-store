import ImageSlider from "./image-slider";
import { getBanners } from "@/lib/db/queries/banners";

export const dynamic = "force-dynamic";
const Banner = async () => {
  const bannerImages = await getBanners();
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
