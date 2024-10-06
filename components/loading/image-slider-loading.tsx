import React from "react";
import { Skeleton } from "../ui/skeleton";

const ImageSliderLoading = () => {
  const rows = Array.from({ length: 6 });
  return (
    <div className="flex flex-row gap-4 h-[300px] pl-4">
      {rows.map((_, i) => (
        <Skeleton key={i} className="aspect-square"></Skeleton>
      ))}
    </div>
  );
};

export default ImageSliderLoading;
