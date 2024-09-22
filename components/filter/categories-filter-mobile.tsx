"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";

import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { useProductFilter } from "@/providers/product.filter.provider";
import { ChevronDown } from "lucide-react";
import { capitalizeSentenceFirstChar } from "@/lib/utils";

interface CategoriesFilterMobileProps {
  showFilter: string | null;
  toggleOpen: (filter: string) => void;
}

const CategoriesFilterMobile: React.FC<CategoriesFilterMobileProps> = ({ showFilter, toggleOpen }) => {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const params = new URLSearchParams(searchParams);
  const pathname = usePathname();
  const { categories } = useProductFilter();

  const handleChangeSize = (isChecked: boolean, category: string) => {
    if (isChecked) {
      params.append("category", category);
    } else {
      params.delete("category", category);
      params.delete("page");
    }
    replace(`${pathname}/?${params.toString()}`);
  };

  return (
    <>
      {categories && categories.length > 0 && (
        <div className="flex flex-col space-y-4">
          <div
            className={`flex justify-between items-center`}
            onClick={() => {
              toggleOpen("category");
            }}
          >
            <label htmlFor="category">
              Categories
              {params.getAll("category").length > 0 && <span className="ml-1">({params.getAll("category").length})</span>}
            </label>
            <ChevronDown className={`transition-transform duration-300 ${showFilter === "category" ? "rotate-180" : ""}`} />
          </div>
          <div
            className={`transition-all ease-out space-y-4 ${
              showFilter === "category" ? "max-h-screen opacity-100" : "max-h-0 opacity-0 overflow-hidden"
            }`}
          >
            {categories.map((category: string) => (
              <div
                className={`hover:text-black dark:hover:text-white flex items-center gap-2  ${
                  searchParams.getAll("category").includes(category) ? "text-black dark:text-white" : "text-muted-foreground"
                }`}
                key={category}
              >
                <Checkbox
                  id={category}
                  name={category}
                  defaultValue={searchParams.get("category")?.toString()}
                  checked={params.getAll("category").includes(category)}
                  onCheckedChange={(isChecked) => handleChangeSize(isChecked as boolean, category)}
                />
                <Label>{capitalizeSentenceFirstChar(category)}</Label>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default CategoriesFilterMobile;
