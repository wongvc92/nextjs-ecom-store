"use client";

import { Separator } from "@/components/ui/separator";
import React from "react";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./Columns";
import { Heading } from "@/components/ui/heading";

import { useSearchParams } from "next/navigation";

import NameFilter from "./name-filter";
import StatusFilter from "./status-filter";
import Link from "next/link";
import OrderStats from "./order-stats";
import { IOrder } from "@/lib/types";
import { DatePickerWithRange } from "@/components/date-picker-with-range";

interface OrderClientProps {
  data: IOrder[];
  orderCount: number;
  totalPage: number;
  allOrdersCount: number;
  cancelledOrdersCount: number;
  completedOrdersCount: number;
  pendingOrdersCount: number;
  shipppedOrdersCount: number;
  toShipOrdersCount: number;
}

//data props passed from parent component which is retrieved from database as array
export const OrderClient: React.FC<OrderClientProps> = ({
  data,
  orderCount,
  totalPage,
  allOrdersCount,
  cancelledOrdersCount,
  completedOrdersCount,
  pendingOrdersCount,
  shipppedOrdersCount,
  toShipOrdersCount,
}) => {
  const searchParams = useSearchParams();

  return (
    <section className="py-8 px-4 flex-col space-y-4 max-w-4xl mx-auto">
      <div className="flex  items-center justify-between bg-white rounded-md p-4 shadow-sm dark:bg-inherit border">
        <Heading title="Orders" description="Manage orders for your store" />
      </div>
      <OrderStats
        allOrdersCount={allOrdersCount}
        cancelledOrdersCount={cancelledOrdersCount}
        completedOrdersCount={completedOrdersCount}
        pendingOrdersCount={pendingOrdersCount}
        shipppedOrdersCount={shipppedOrdersCount}
        toShipOrdersCount={toShipOrdersCount}
      />
      <Separator className="my-4" />
      <div className="flex flex-wrap gap-2 items-center">
        <DatePickerWithRange title="Created" />
        <StatusFilter />
        <NameFilter />
        {(searchParams.get("productName") ||
          searchParams.getAll("status").length > 0 ||
          searchParams.get("dateFrom") ||
          searchParams.get("dateTo")) && (
          <Link href="orders?page=1&perPage=5 " className="text-xs underline text-muted-foreground">
            Clear filters
          </Link>
        )}
      </div>
      <DataTable columns={columns} data={data} totalPage={totalPage} />
    </section>
  );
};
