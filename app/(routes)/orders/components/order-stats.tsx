import { auth } from "@/auth";
import { getOrderStatsCount } from "@/lib/db/queries/orders";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

const OrderStats = async () => {
  const session = await auth();
  if (!session?.user.id) {
    redirect("/auth/sign-in");
  }
  const { allOrdersCount, cancelledOrdersCount, completedOrdersCount, pendingOrdersCount, toShipOrdersCount, shippedOrdersCount } =
    await getOrderStatsCount(session.user.id);
  const PRODUCT_STATS = [
    {
      id: 1,
      label: "Total",
      count: allOrdersCount ?? 0,
      url: "/orders?page=1&perPage=5",
    },
    {
      id: 2,
      label: "Cancelled",
      count: cancelledOrdersCount ?? 0,
      url: "/orders?page=1&perPage=5&status=cancelled",
    },
    {
      id: 3,
      label: "Pending",
      count: pendingOrdersCount ?? 0,
      url: "/orders?page=1&perPage=5&status=pending",
    },
    {
      id: 4,
      label: "To Ship",
      count: toShipOrdersCount,
      url: "/orders?page=1&perPage=5&status=toShip",
    },
    {
      id: 5,
      label: "Shipped",
      count: shippedOrdersCount,
      url: "/orders?page=1&perPage=5&status=shipped",
    },
    {
      id: 5,
      label: "Completed",
      count: completedOrdersCount,
      url: "/orders?page=1&perPage=5&status=completed",
    },
  ] as const;

  return (
    <>
      <div className="grid grid-cols-3 gap-2 md:flex md:flex-wrap">
        {PRODUCT_STATS.map((item) => (
          <Link
            href={item.url}
            key={item.id}
            className={`border p-2 rounded-md flex flex-col justify-center text-muted-foreground items-center text-xs md:text-base break-words aspect-square max-h-32 flex-1 ${
              item.count === 0 && "pointer-events-none"
            }`}
          >
            <p className="text-muted-foreground text-center text-xl font-bold">{item.count}</p>
            <p className="text-center font-light">{item.label}</p>
          </Link>
        ))}
      </div>
    </>
  );
};

export default OrderStats;
