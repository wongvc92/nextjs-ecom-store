import React, { Suspense } from "react";
import OrderItem from "./components/order-item";
import { unstable_cache } from "next/cache";
import { getOrderById } from "@/lib/db/queries/orders";

interface OrderPageByIdProps {
  params: { orderId: string };
}

const OrderPageById = async ({ params }: OrderPageByIdProps) => {
  console.log("params.orderId", params.orderId);
  const order = await getOrderById(params.orderId);
  console.log("OrderPageById", order);

  return (
    <Suspense>
      <section className="w-full md:container">
        <OrderItem order={order} />
      </section>
    </Suspense>
  );
};

export default OrderPageById;
