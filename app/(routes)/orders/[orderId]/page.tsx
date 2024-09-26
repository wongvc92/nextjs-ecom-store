import React, { Suspense } from "react";
import OrderItem from "./components/order-item";
import { getOrderById } from "@/lib/db/queries/orders";
import { Metadata } from "next";
import { auth } from "@/auth";

interface OrderPageByIdProps {
  params: { orderId: string };
}

export const metadata: Metadata = {
  title: "Order Details",
  description: "View detailed information about your order, including items, shipping status, and payment information.",
};

const OrderPageById = async ({ params }: OrderPageByIdProps) => {
  const order = await getOrderById(params.orderId);

  return (
    <Suspense>
      <section className="w-full md:container">
        <OrderItem order={order} />
      </section>
    </Suspense>
  );
};

export default OrderPageById;
