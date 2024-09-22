"use client";

import { Button } from "@/components/ui/button";
import { useProductFilter } from "@/providers/product.filter.provider";

import { SlidersHorizontal } from "lucide-react";
import React from "react";

const ToggleFilterButton = () => {
  const { setIsOpen, isOpen } = useProductFilter();

  return (
    <Button onClick={() => setIsOpen(!isOpen)} className="hidden gap-2 items-center rounded-full  md:flex" variant="outline">
      <span className="text-sm">{isOpen ? "Show filter" : "Hide filter"}</span>
      <SlidersHorizontal />
    </Button>
  );
};

export default ToggleFilterButton;
