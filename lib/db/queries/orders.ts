import { addSearchParams } from "@/lib/utils";
import { IOrdersQuery, orderQuerySchema } from "@/lib/validation/orderSchemas";
import { validate as isUuid } from "uuid";
import { IOrder } from "@/lib/types";

const BASE_URL = process.env.NEXT_PUBLIC_ADMIN_URL!;

export async function getOrders(searchParams: IOrdersQuery, userId: string) {
  const parsed = orderQuerySchema.safeParse(searchParams);
  if (!parsed.success) {
    const errorMessage = parsed.error.errors.map((err) => `${err.path.join(".")} - ${err.message}`);
    console.error(errorMessage);
    return {
      orders: null,
      ordersCount: 0,
    };
  }

  let url = new URL(`${BASE_URL}/api/orders`);
  addSearchParams(url, searchParams);

  try {
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "X-User-ID": userId,
      },
      cache: "force-cache",
    });

    if (!response.ok) {
      return {
        orders: null,
        ordersCount: 0,
      };
    }

    const data = await response.json();

    return { orders: data.orders, ordersCount: data.ordersCount };
  } catch (error: any) {
    console.error(`[Failed to fetch order]: ${error}`);
    return {
      orders: null,
      ordersCount: 0,
    };
  }
}

export const getOrderById = async (orderId: string): Promise<IOrder | null> => {
  if (!isUuid(orderId)) {
    return null;
  }

  const url = new URL(`${BASE_URL}/api/orders/${encodeURIComponent(orderId)}`);

  try {
    const response = await fetch(url.toString(), {
      cache: "force-cache",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Fetch Error]: Failed to fetch orders (${response.status} - ${response.statusText}): ${errorText}`);
      return null;
    }

    const data = await response.json();

    return data.order as IOrder;
  } catch (error: any) {
    console.error(`[Failed fetch orders]: ${error}`);
    return null;
  }
};

export const getOrderStatsCount = async (userId: string) => {
  const url = new URL(`${BASE_URL}/api/orders/statsCount`);
  let statsCount = {
    allOrdersCount: 0,
    cancelledOrdersCount: 0,
    completedOrdersCount: 0,
    pendingOrdersCount: 0,
    shippedOrdersCount: 0,
    toShipOrdersCount: 0,
  };
  try {
    const response = await fetch(url.toString(), {
      headers: {
        "X-User-ID": userId,
      },
      cache: "force-cache",
    });

    if (!response.ok) {
      return statsCount;
    }

    const data = await response.json();

    if (!data) {
      return statsCount;
    }

    return {
      ...statsCount,
      allOrdersCount: data.allOrdersCount,
      cancelledOrdersCount: data.cancelledOrdersCount,
      completedOrdersCount: data.completedOrdersCount,
      pendingOrdersCount: data.pendingOrdersCount,
      shippedOrdersCount: data.shippedOrdersCount,
      toShipOrdersCount: data.toShipOrdersCount,
    };
  } catch (error) {
    console.log("Failed fetch stats count for orders", error);
    return statsCount;
  }
};
