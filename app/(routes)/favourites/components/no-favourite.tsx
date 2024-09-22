import { Frown, Heart, ShoppingBag } from "lucide-react";
import Link from "next/link";
import React from "react";

const NoFavourite = () => {
  return (
    <div className="min-h-screen container mx-auto">
      <div className=" flex justify-center items-center py-10">
        <div className="flex flex-col justify-center items-center gap-4 border w-[600px] h-[500px] rounded-md">
          <div className="relative">
            <Heart className="w-20 h-20" />
            <div className="absolute -top-1 -right-1 p-2 rounded-full w-5 h-5 flex justify-center items-center bg-black text-white z-10">0</div>
          </div>
          <p className="flex items-center gap-2">
            No favourites yet <Frown />
          </p>
          <p className="text-sm text-muted-foreground">You have no favourite item</p>

          <Link href={`/products`} className="border px-4 py-2 rounded-md bg-black text-white dark:bg-white dark:text-black">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NoFavourite;
