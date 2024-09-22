"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { ArrowUpDown, Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const SORT_FILTER_LIST = [
  {
    id: 1,
    name: "Latest",
    searchParams: "latest-desc",
  },
  {
    id: 2,

    name: "Price: High to low",
    searchParams: "price-desc",
  },
  {
    id: 3,

    name: "Price: Low to high",
    searchParams: "price-asc",
  },
] as const;

const SortFilter = () => {
  const [sortName, setSortName] = useState<string>("");
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSortFilter = (searchParams: string, name: string) => {
    params.set("sort", searchParams);
    setSortName(name);
    replace(`${pathname}/?${params.toString()}`);
  };

  return (
    <>
      {SORT_FILTER_LIST && SORT_FILTER_LIST.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 rounded-full border px-4 py-2 text-sm ">
            <span className="hidden md:block">Sort</span>
            <span className={`text-muted-foreground md:block ${searchParams.has("sort") ? "block" : "hidden"}`}>{sortName}</span>
            <ArrowUpDown className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {SORT_FILTER_LIST.map((item) => (
              <DropdownMenuItem onClick={() => handleSortFilter(item.searchParams, item.name)} key={item.id}>
                {item.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
};

export default SortFilter;
