import { auth } from "@/auth";
import { addSearchParams } from "@/lib/utils";

import { ensureAuthenticated } from "@/lib/utilts/authHelpers";
import { IOrdersQuery, orderQuerySchema } from "@/lib/validation/orderSchemas";
import { validate as isUuid } from "uuid";
const BASE_URL = process.env.NEXT_PUBLIC_ADMIN_URL!;

export async function getOrders(searchParams: IOrdersQuery) {
  const session = await ensureAuthenticated();

  const parsed = orderQuerySchema.safeParse(searchParams);
  if (!parsed.success) {
    const errorMessage = parsed.error.errors.map((err) => `${err.path.join(".")} - ${err.message}`);
    console.log("errorMessage", errorMessage);
    return {
      error: errorMessage,
    };
  }

  let url = new URL(`${BASE_URL}/api/orders`);
  addSearchParams(url, searchParams);

  try {
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "X-User-ID": session.user.id,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch order: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log(data);
    return { orders: data.orders, ordersCount: data.ordersCount };
  } catch (error: any) {
    console.error(`[Failed to fetch order]: ${error}`);
    throw error;
  }
}

export async function getOrderById(orderId: string) {
  console.log("orderId", orderId);
  await ensureAuthenticated();
  if (!isUuid(orderId)) {
    return {
      error: "Something went wrong",
    };
  }

  const url = new URL(`${BASE_URL}/api/orders/${encodeURIComponent(orderId)}`);

  try {
    const response = await fetch(url.toString());
    console.log("Response status:", response.status);
    if (!response.ok) {
      throw new Error("failed fetch orders");
    }

    const data = await response.json();

    return data.order;
  } catch (error: any) {
    console.error(`[Failed fetch orders]: ${error}`);
    return {
      error: "[Failed fetch orders]",
    };
  }
}

export const getOrderStatsCount = async () => {
  const session = await ensureAuthenticated();

  console.log("session.user.id", session.user.id);
  const url = new URL(`${BASE_URL}/api/orders/statsCount`);
  try {
    const response = await fetch(url.toString(), {
      headers: {
        "X-User-ID": session.user.id,
      },
    });

    // Log the response status
    console.log("Response status:", response.status);

    if (!response.ok) {
      throw new Error("Failed fetch stats count for orders");
    }

    const data = await response.json();

    console.log("data", data);

    if (!data) {
      throw new Error("Failed fetch stats count for orders");
    }

    return {
      allOrdersCount: data.allOrdersCount,
      cancelledOrdersCount: data.cancelledOrdersCount,
      completedOrdersCount: data.completedOrdersCount,
      pendingOrdersCount: data.pendingOrdersCount,
      shippedOrdersCount: data.shippedOrdersCount,
      toShipOrdersCount: data.toShipOrdersCount,
    };
  } catch (error) {
    console.log("Failed fetch stats count for orders", error);
    throw error;
  }
};
