"use client";

import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";
import { IProduct } from "@/lib/types";

import { switchFavourite } from "@/actions/favourite";
import { useTransition } from "react";

import { useFavouriteContext } from "@/providers/favourite.provider";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface FavouriteButtonProps {
  className?: string;
  product?: IProduct;
}

const FavouriteButton: React.FC<FavouriteButtonProps> = ({ className, product }) => {
  const { data } = useSession();
  const { favouriteProducts, dispatch } = useFavouriteContext();
  const [isPending, startTransition] = useTransition();
  const isLiked = favouriteProducts?.find((item) => item.product?.id === product?.id)?.isLiked;

  const router = useRouter();

  const handleFavourite = async () => {
    if (!data?.user.id) {
      router.push("/auth/sign-in");
      return;
    }
    const formData = new FormData();
    formData.append("userId", data?.user?.id as string);
    formData.append("productId", product?.id as string);
    formData.append("variationType", product?.variationType as string);

    dispatch({ type: "TOGGLE_LIKE", payload: product as IProduct });

    await switchFavourite(formData);
  };

  return (
    <button onClick={() => startTransition(handleFavourite)} className={cn("flex items-center justify-center", className)} disabled={isPending}>
      <Heart fill={isLiked === true ? "red" : "none"} className={`text-muted-foreground ${isLiked === true && "text-red-500"}`} />
    </button>
  );
};

export default FavouriteButton;
