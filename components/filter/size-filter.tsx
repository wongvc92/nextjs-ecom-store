"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useProductFilter } from "@/providers/product.filter.provider";
import { ChevronDown } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";

interface SizeFilterProps {
  showFilter: string | null;
  toggleOpen: (filter: string) => void;
}
const SizeFilter: React.FC<SizeFilterProps> = ({ showFilter, toggleOpen }) => {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const params = new URLSearchParams(searchParams);
  const pathname = usePathname();

  const { sizes } = useProductFilter();
  console.log(params.get("size"));
  const handleChangeSize = (isChecked: boolean, sizeName: string) => {
    if (isChecked) {
      params.append("size", sizeName);
    } else {
      params.delete("size", sizeName);
      params.delete("page");
    }
    replace(`${pathname}/?${params.toString()}`);
  };

  return (
    <>
      {sizes && sizes.length > 0 && (
        <div className="flex flex-col space-y-2 ">
          <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleOpen("sizes")}>
            <label htmlFor="size">
              Size
              {params.getAll("size").length > 0 && <span className="ml-1">({params.getAll("size").length})</span>}
            </label>
            <ChevronDown className={`transition-transform duration-300 ${showFilter === "sizes" ? "rotate-180" : ""}`} />
          </div>
          <div
            className={`transition-all ease-out space-y-4 grid grid-cols-2 items-baseline ${
              showFilter === "sizes" ? "max-h-screen opacity-100 pb-4" : "max-h-0 opacity-0 overflow-hidden"
            }`}
          >
            {sizes.map((size: string) => (
              <div
                className={`hover:text-black dark:hover:text-white flex items-center gap-2 ${
                  params.getAll("size").includes(size) ? "dark:text-white text-black" : "text-muted-foreground "
                }`}
                key={size}
              >
                <Checkbox
                  id={size}
                  name={size}
                  defaultValue={searchParams.get("size")?.toString()}
                  checked={params.getAll("size").includes(size)}
                  onCheckedChange={(isChecked) => handleChangeSize(isChecked as boolean, size)}
                />
                <Label>{size.toUpperCase()}</Label>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default SizeFilter;
