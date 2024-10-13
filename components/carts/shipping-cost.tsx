"use client";

import { useCartContext } from "@/providers/cart.provider";
import React, { useCallback, useEffect, useState } from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CourierService } from "@/lib/types";
import { convertCentsToTwoDecimal } from "@/lib/utils";
import { Input } from "../ui/input";
import { useDebouncedCallback } from "use-debounce";
import Image from "next/image";

const baseUrl = process.env.NEXT_PUBLIC_STORE_URL!;
const ShippingCost = () => {
  const { totalWeightInKg, setSubtotalShippings, MAX_WEIGHT_IN_KG, setFoundCorier, setToPostcode, courierChoice, toPostcode, setCourierChoice } =
    useCartContext();
  const [couriers, setCouriers] = useState<CourierService[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [error, setError] = useState("");
  const handleSearch = useDebouncedCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setToPostcode(e.target.value);
  }, 1000);

  const handleFetchShippingCost = useCallback(async () => {
    setError("");
    setFoundCorier(false);
    if (!courierChoice || !totalWeightInKg || !toPostcode) {
      setError("Provide postcode & select courier");
      setFoundCorier(false);
      return;
    }

    if (totalWeightInKg > MAX_WEIGHT_IN_KG) {
      setError(`Total weight must not exceed ${MAX_WEIGHT_IN_KG} KG`);
      setFoundCorier(false);
      return;
    }
    setLoading(true);

    try {
      const url = new URL(`${baseUrl}/api/courier/services`);
      const res = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          courierChoice,
          toPostcode,
          totalWeightInKg,
        }),
      });

      if (!res.ok) {
        setError("Please provide correct postcode");
        setFoundCorier(false);
        return;
      }

      const data: CourierService[] = await res.json();

      if (data) {
        setCouriers(data);
        setSubtotalShippings(data[0].price);
        setFoundCorier(true);
      }
    } catch (error) {
      console.error("Failed to fetch shipping cost:", error);
      setError("Please try other courier");
      setCouriers(null);
      setFoundCorier(false);
      return;
    } finally {
      setLoading(false);
    }
  }, [courierChoice, totalWeightInKg, toPostcode, setSubtotalShippings, MAX_WEIGHT_IN_KG, setFoundCorier]);

  useEffect(() => {
    if (courierChoice && totalWeightInKg && toPostcode) {
      handleFetchShippingCost();
    }
  }, [handleFetchShippingCost, courierChoice, totalWeightInKg, toPostcode]);

  console.log("cartchecout", couriers);
  return (
    <div className="flex flex-col gap-2 items-end w-[200px]">
      {/* Pricing area */}

      {loading && <p>Calculating...</p>}
      {!loading && couriers && (
        <div className="flex items-center gap-2">
          <Image src={couriers?.[0].courier_image} alt={couriers?.[0].courier_title} height={40} width={40} />
          <p className="font-bold">RM {convertCentsToTwoDecimal(couriers[0].price)}</p>
        </div>
      )}

      {error && <p className="text-muted-foreground text-xs font-light text-red-500">{error}</p>}

      {/* Input for postcode */}
      <Input onChange={handleSearch} placeholder="Enter postcode" className="w-full text-muted-foreground text-sm" />

      {/* Select for courier choice */}
      <Select onValueChange={(value) => setCourierChoice(value)}>
        <SelectTrigger className="w-full text-muted-foreground text-sm">
          <SelectValue placeholder="Select courier" />
        </SelectTrigger>
        <SelectContent className="text-muted-foreground text-sm">
          <SelectGroup>
            <SelectLabel>Couriers</SelectLabel>
            <SelectItem value="Pos Malaysia">Pos Malaysia</SelectItem>
            <SelectItem value="J&T Express">J&T Express</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ShippingCost;
