"use client";

import { useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useModal } from "@/providers/modal.provider";
import Modal from "./ui/modal";

const SearchModal = () => {
  const inputSearchRef = useRef<HTMLInputElement>(null);
  const searchParams = useSearchParams();
  const { openModal, closeModal } = useModal();
  const { push } = useRouter();

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams);
    if (inputSearchRef.current !== null) {
      params.set("query", inputSearchRef.current.value);
      push(`/products?${params.toString()}`);
      closeModal();
    }
  };

  return (
    <div className="md:flex md:items-center hidden ">
      <button
        type="button"
        className="flex justify-between relative rounded-full py-2 px-4  gap-2 w-full md:w-[400px] bg-muted shadow-inner"
        onClick={() => openModal("searchProduct")}
      >
        <span className="text-sm text-muted-foreground">Search products...</span>
        <Search className="text-muted-foreground" />
      </button>
      <Modal modalName="searchProduct">
        <div className="flex flex-col w-full gap-4 ">
          <div className="flex flex-1 gap-2 space-y-4 relative ">
            <Input defaultValue={searchParams.get("query")?.toString()} ref={inputSearchRef} placeholder="Search products" />

            <button type="button" className="absolute right-2 bottom-3 z-10" onClick={handleSearch}>
              <SearchIcon />
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
export default SearchModal;
