"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { FormEvent, useState } from "react";

const CustomPriceFilter = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  // const { categoryId } = useDataStore();
  const params = new URLSearchParams(searchParams);
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    setLoading(true);
    const minPrice = formData.get("minPriceField") as string;
    const maxPrice = formData.get("maxPriceField") as string;

    params.set("minPrice", minPrice.toString());
    params.set("maxPrice", maxPrice.toString());
    router.replace(`${pathname}/?${params.toString()}`);
    setLoading(false);
  };
  return (
    <div className="space-y-2 mt-2">
      <form onSubmit={handleSubmit}>
        <div className="flex sm:flex-row gap-2 items-center justify-center">
          <div className="relative flex items-center">
            <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-xs">RM</span>
            <Input
              name="minPriceField"
              className="pl-8 py-2 border rounded-md"
              placeholder="min"
              defaultValue={params.get("minPrice")?.toString()}
              required
            />
          </div>
          <div className="relative flex items-center">
            <span className="absolute inset-y-0 left-0 flex items-center pl-2 text-xs">RM</span>
            <Input
              name="maxPriceField"
              className="pl-8  py-2 border rounded-md"
              placeholder="max"
              defaultValue={params.get("maxPrice")?.toString()}
              required
            />
          </div>
        </div>
        <Button type="submit" variant="secondary" className="mt-2 text-sm w-full " disabled={loading}>
          {loading ? "Setting..." : "Set price"}
        </Button>
      </form>
    </div>
  );
};

export default CustomPriceFilter;
