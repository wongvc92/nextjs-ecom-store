import { Search, SearchIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import React, { Dispatch, SetStateAction, useRef, useState } from "react";
import { Input } from "./ui/input";

const MobileSearch = ({ setIsOpen }: { setIsOpen: Dispatch<SetStateAction<boolean>> }) => {
  const inputSearchRef = useRef<HTMLInputElement>(null);
  const searchParams = useSearchParams();
  const { push } = useRouter();
  const params = new URLSearchParams(searchParams);
  const handleSearch = () => {
    if (inputSearchRef.current !== null) {
      params.set("query", inputSearchRef.current.value);
      push(`/products?${params.toString()}`);
      setIsOpen(false);
    }
  };
  return (
    <div className="flex flex-col w-full gap-4 ">
      <div className="flex flex-1 gap-2 space-y-4 relative ">
        <Input
          className="bg-muted shadow-inner"
          defaultValue={searchParams.get("query")?.toString()}
          ref={inputSearchRef}
          placeholder="Search products"
        />
        <button type="button" className="absolute right-2 bottom-3 z-10 " onClick={handleSearch}>
          <SearchIcon />
        </button>
      </div>
    </div>
  );
};

export default MobileSearch;
