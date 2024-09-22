"use client";

import { Label } from "@/components/ui/label";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

const PRICE_RANGE = [
  { id: 1, label: "Under RM 200", minPrice: 0, maxPrice: 200 },
  { id: 2, label: "RM 200 - RM 500", minPrice: 200, maxPrice: 500 },
  { id: 3, label: "RM 500 - RM 1000", minPrice: 500, maxPrice: 1000 },
  { id: 4, label: "Over RM 1000", minPrice: 1000, maxPrice: 10000 },
] as const;

interface PriceFilterProps {
  showFilter: string | null;
  toggleOpen: (filter: string) => void;
}

const PriceFilter: React.FC<PriceFilterProps> = ({ showFilter, toggleOpen }) => {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const pathname = usePathname();

  const createQueryString = (minPrice: number, maxPrice: number) => {
    params.set("minPrice", minPrice.toString());
    params.set("maxPrice", maxPrice.toString());
    return params.toString();
  };

  return (
    <>
      {PRICE_RANGE && PRICE_RANGE.length > 0 && (
        <div className="flex flex-col space-y-2">
          <div
            className="flex justify-between items-center cursor-pointer"
            onClick={() => {
              toggleOpen("price");
            }}
          >
            <label htmlFor="price">
              Price
              {params.getAll("price").length > 0 && <span className="ml-1">({params.getAll("price").length})</span>}
            </label>
            <ChevronDown className={`transition-transform duration-300 ${showFilter === "price" ? "rotate-180" : ""}`} />
          </div>
          <div
            className={`transition-all ease-out space-y-2 ${
              showFilter === "price" ? "max-h-screen opacity-100 pb-2" : "max-h-0 opacity-0 overflow-hidden"
            }`}
          >
            {PRICE_RANGE.map((price) => {
              return (
                <div className="flex items-center gap-2" key={price.id}>
                  <Link href={`${pathname}/?${createQueryString(price.minPrice, price.maxPrice)}`}>
                    <Label
                      htmlFor={`price-${price.id}`}
                      className={`cursor-pointer text-muted-foreground hover:text-black dark:hover:text-white ${
                        searchParams.get("minPrice") === price.minPrice.toString() && searchParams.get("maxPrice") === price.maxPrice.toString()
                          ? "text-black dark:text-white"
                          : "text-muted-foreground"
                      }`}
                    >
                      {price.label}
                    </Label>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default PriceFilter;
