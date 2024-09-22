"use client";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SlidersHorizontal } from "lucide-react";

import ResetFilterButton from "./reset-filter-button";
import SizeFilter from "./size-filter";
import ColorFilter from "./color-filter";

import PriceFilter from "./price-filter";
import CustomPriceFilter from "./custom-price-filter";
import CategoriesFilterMobile from "./categories-filter-mobile";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

interface FilterSidebarMobileProps {
  productCounts: number;
}
const FilterSidebarMobile: React.FC<FilterSidebarMobileProps> = ({ productCounts }) => {
  const [showFilter, setShowFilter] = useState<string | null>(null);

  const toggleOpen = (filter: string) => {
    setShowFilter(showFilter === filter ? null : filter);
  };
  const searchParams = useSearchParams();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="rounded-full text-sm flex items-center justify-around w-fit gap-2 md:hidden">
          <SlidersHorizontal />
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-scroll no-scrollbar w-full" side="left">
        <SheetHeader>
          <SheetTitle>Filter product</SheetTitle>
        </SheetHeader>
        <div className="grid gap-6 pt-4 ">
          <SizeFilter toggleOpen={toggleOpen} showFilter={showFilter} />
          <ColorFilter toggleOpen={toggleOpen} showFilter={showFilter} />
          <CategoriesFilterMobile toggleOpen={toggleOpen} showFilter={showFilter} />
          <PriceFilter toggleOpen={toggleOpen} showFilter={showFilter} />
          <CustomPriceFilter />
        </div>

        <SheetFooter className=" pt-2 flex flex-row gap-2 justify-center items-center h-fit my-4">
          <ResetFilterButton />
          <SheetClose asChild>
            <Button type="button" className=" w-full flex items-center gap-1 transition-all ease-in duration-500">
              Apply
              {(searchParams.has("size") ||
                searchParams.has("color") ||
                searchParams.has("category") ||
                searchParams.has("minPrice") ||
                searchParams.has("maxPrice")) && <span>{productCounts > 0 && `(${productCounts})`}</span>}
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
export default FilterSidebarMobile;
