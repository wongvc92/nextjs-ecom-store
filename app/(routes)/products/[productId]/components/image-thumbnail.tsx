import { IProduct } from "@/lib/types";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

interface ImageThumbnailProps {
  displayImage: string;
  product: IProduct;
  handleImageUrl: (i: number) => void;
}

const ImageThumbnail: React.FC<ImageThumbnailProps> = ({ displayImage, product, handleImageUrl }) => {
  return (
    <div className="flex overflow-x-auto  gap-2 p-2 relative w-full">
      {product?.productImages?.map((image, i) => (
        <div
          key={image.id}
          onClick={() => handleImageUrl(i)}
          onMouseEnter={() => handleImageUrl(i)}
          className={cn(
            "relative w-24 h-24 flex-shrink-0 border-2 border-border hover:border-ring rounded-md overflow-hidden",
            displayImage === image.url && "border-ring"
          )}
        >
          <Image src={image.url} alt="image" fill className="object-cover" />
        </div>
      ))}
    </div>
  );
};

export default React.memo(ImageThumbnail);
