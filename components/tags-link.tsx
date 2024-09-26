import Link from "next/link";
import React from "react";

const PRODUCT_TAGS = [
  { id: 1, label: "all products", path: "/products" },
  { id: 1, label: "men", path: "/products?tags=men" },
  { id: 1, label: "women", path: "/products?tags=women" },
] as const;

const TagsLink = () => {
  return (
    <div className="pb-4 flex gap-4 justify-center text-sm">
      {PRODUCT_TAGS.map((item) => (
        <Link key={item.id} href={item.path} className="capitalize">
          {item.label}
        </Link>
      ))}
    </div>
  );
};

export default TagsLink;
