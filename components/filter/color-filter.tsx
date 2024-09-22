"use client";

import { Label } from "@/components/ui/label";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { Checkbox } from "../ui/checkbox";
import { useProductFilter } from "@/providers/product.filter.provider";
import { ChevronDown } from "lucide-react";
import { capitalizeSentenceFirstChar } from "@/lib/utils";

interface ColorFilterProps {
  showFilter: string | null;
  toggleOpen: (filter: string) => void;
}

const ColorFilter: React.FC<ColorFilterProps> = ({ showFilter, toggleOpen }) => {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();
  const params = new URLSearchParams(searchParams);
  const { colors } = useProductFilter();

  const handleChangeColor = (isChecked: boolean, colorName: string) => {
    if (isChecked) {
      params.append("color", colorName);
    } else {
      params.delete("color", colorName);
      params.delete("page");
    }
    replace(`${pathname}/?${params.toString()}`, { scroll: false });
  };

  return (
    <>
      {colors && colors.length > 0 && (
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleOpen("colors")}>
            <label htmlFor="color">
              Color
              {params.getAll("color").length > 0 && <span className="ml-1">({params.getAll("color").length})</span>}
            </label>
            <ChevronDown className={`transition-transform duration-300 ${showFilter === "colors" ? "rotate-180" : ""}`} />
          </div>
          <div
            className={`transition-all ease-out space-y-4 grid grid-cols-2 items-baseline ${
              showFilter === "colors" ? "max-h-screen opacity-100 pb-4" : "max-h-0 opacity-0 overflow-hidden"
            }`}
          >
            {colors.map((color: string) => (
              <div
                className={`hover:text-black hover:dark:text-white flex items-center gap-2  ${
                  params.getAll("color").includes(color) ? "dark:text-white text-black" : "text-muted-foreground "
                }`}
                key={color}
              >
                <Checkbox
                  id={color}
                  name={color}
                  defaultValue={searchParams.get("color")?.toString()}
                  checked={params.getAll("color").includes(color)}
                  onCheckedChange={(isChecked) => handleChangeColor(isChecked as boolean, color)}
                />
                <Label>{capitalizeSentenceFirstChar(color)}</Label>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default ColorFilter;
