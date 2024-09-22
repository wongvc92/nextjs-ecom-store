"use client";

import { Separator } from "@/components/ui/separator";

import ColorFilter from "./color-filter";
import SizeFilter from "./size-filter";
import PriceFilter from "./price-filter";
import CustomPriceFilter from "./custom-price-filter";
import ResetFilterButton from "./reset-filter-button";
import { useState } from "react";

const FilterSidebar = () => {
  const [showFilter, setShowFilter] = useState<string | null>(null);

  const toggleOpen = (filter: string) => {
    setShowFilter(showFilter === filter ? null : filter);
  };
  return (
    <div className="w-[200px] hidden md:block space-y-6 ">
      <SizeFilter toggleOpen={toggleOpen} showFilter={showFilter} />

      <ColorFilter toggleOpen={toggleOpen} showFilter={showFilter} />

      <PriceFilter toggleOpen={toggleOpen} showFilter={showFilter} />

      <CustomPriceFilter />
    </div>
  );
};

export default FilterSidebar;
