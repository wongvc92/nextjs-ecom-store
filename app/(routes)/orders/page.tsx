import React, { Suspense } from "react";
import { OrderClient } from "./components/Client";

import { getOrders, getOrderStatsCount } from "@/lib/db/queries/orders";
import { IOrdersQuery } from "@/lib/validation/orderSchemas";

const OrderPage = async ({ searchParams }: { searchParams: IOrdersQuery }) => {
  const perPage = searchParams.perPage || "5";

  const { orders, ordersCount } = await getOrders(searchParams);

  const { allOrdersCount, cancelledOrdersCount, completedOrdersCount, pendingOrdersCount, shippedOrdersCount, toShipOrdersCount } =
    await getOrderStatsCount();

  return (
    <Suspense fallback="loading...">
      <OrderClient
        data={orders}
        orderCount={ordersCount}
        totalPage={Math.ceil(allOrdersCount / parseInt(perPage))}
        allOrdersCount={allOrdersCount}
        cancelledOrdersCount={cancelledOrdersCount}
        completedOrdersCount={completedOrdersCount}
        pendingOrdersCount={pendingOrdersCount}
        shipppedOrdersCount={shippedOrdersCount}
        toShipOrdersCount={toShipOrdersCount}
      />
    </Suspense>
  );
};

export default OrderPage;
