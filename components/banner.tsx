import React from "react";
import ImageSlider from "./image-slider";
import { IbannerImage } from "@/lib/types";

const Banner = ({ bannerImages }: { bannerImages: IbannerImage[] }) => {
  return (
    <div className="w-full">
      <ImageSlider images={bannerImages} autoSlide={true} autoSlideInterval={3000} />
    </div>
  );
};

export default Banner;
