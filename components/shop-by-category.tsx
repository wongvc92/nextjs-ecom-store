import { capitalizeSentenceFirstChar } from "@/lib/utils";
import { Bike, Icon, Laptop, Popcorn, Shirt, SofaIcon, Wrench } from "lucide-react";
import Link from "next/link";
import React from "react";

const CATEGORY = [
  { id: 1, label: "apparel", icon: Shirt, path: "#" },
  { id: 2, label: "sport", icon: Bike, path: "#" },
  { id: 3, label: "furniture", icon: SofaIcon, path: "#" },
  { id: 4, label: "electronic", icon: Laptop, path: "#" },
  { id: 5, label: "tools", icon: Wrench, path: "#" },
  { id: 5, label: "food", icon: Popcorn, path: "#" },
] as const;

const ShopByCategory = () => {
  return (
    <div className="px-4 space-y-4">
      <div>Shop By Category</div>
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {CATEGORY.map((item) => (
          <Link
            href={item.path}
            key={item.id}
            className="aspect-square border rounded-md flex flex-col justify-center w-full items-center gap-4 hover:ring-2 hover:ring-black hover:ring-inset dark:hover:ring-2 dark:hover:ring-white dark:hover:ring-inset"
          >
            <item.icon className="w-10 h-10" />
            <p className="text-muted-foreground text-sm">{capitalizeSentenceFirstChar(item.label)}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ShopByCategory;
