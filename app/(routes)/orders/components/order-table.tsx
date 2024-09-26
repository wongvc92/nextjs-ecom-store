import { DataTable } from "@/components/ui/data-table";
import React from "react";
import { columns } from "./Columns";
import { getOrders } from "@/lib/db/queries/orders";
import { IOrdersQuery } from "@/lib/validation/orderSchemas";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const OrderTable = async ({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) => {
  const session = await auth();
  if (!session?.user.id) {
    redirect("/auth/sign-in");
  }
  const { orders, ordersCount } = await getOrders(searchParams as IOrdersQuery, session.user.id);
  const perPage = (searchParams.perPage as string) || "5";
  const totalPage = Math.ceil(ordersCount / parseInt(perPage));

  return <DataTable columns={columns} data={orders} totalPage={totalPage} />;
};

export default OrderTable;
