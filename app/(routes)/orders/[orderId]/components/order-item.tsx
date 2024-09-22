import { HashIcon, MapPin, ReceiptText, ScrollText } from "lucide-react";

import React, { useMemo } from "react";
import { currencyFormatter, findOrderItemsShippingSubTotal, findOrderItemsSubTotal } from "@/lib/utils";
import OrderHistory from "./order-history";
import OrderPaymentInfo from "./order-payment-info";
import OrderLogisticInfo from "./order-logistic-info";
import { IOrder } from "@/lib/types";

interface OrderItemProps {
  order: IOrder;
}

const OrderItem: React.FC<OrderItemProps> = ({ order }) => {
  return (
    <>
      {!order ? (
        <div>No orders</div>
      ) : (
        <div className="flex flex-col xl:flex-row  py-10 px-4 gap-4">
          <div className="flex flex-col gap-6 w-full">
            <div className=" border rounded-md p-4 bg-white shadow-sm dark:bg-black">
              <p className="flex items-center gap-2 font-semibold text-sm">
                <ScrollText className="h-4 w-4" />
                {order.status}
              </p>
            </div>
            <div className="flex flex-col space-y-8 border p-4 rounded-md  bg-white dark:bg-black shadow-sm">
              <div className="flex">
                <div className="flex flex-col">
                  <p className="flex items-center gap-2 font-semibold text-sm">
                    <HashIcon className="h-4 w-4 " /> Order Id
                  </p>
                  <div className="pl-6">
                    <span className="text-muted-foreground text-xs">{order.id}</span>
                  </div>
                </div>
              </div>
              <div className="flex">
                <div className="flex flex-col">
                  <p className="flex items-center gap-2  font-semibold text-sm">
                    <MapPin className="h-4 w-4" />
                    Delivery Address
                  </p>
                  <div className="pl-6">
                    {order && order.shipping ? (
                      <span className="text-muted-foreground text-xs">
                        {`${order?.shipping?.address}, ${order?.shipping?.address2}, ${order?.shipping?.postalCode}, ${order?.shipping?.city}, ${order?.shipping?.state}`}
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>

              {/* Logistic Information */}
              <OrderLogisticInfo status={order.status} orderId={order.id} />
            </div>

            {/* Payment Information */}
            <OrderPaymentInfo order={order} />

            {/* Final Amount */}
            <div className="flex justify-between border rounded-md p-4 items-center bg-white dark:bg-black shadow-sm">
              <p className="flex items-center gap-2 font-semibold text-sm">
                <ReceiptText className="h-4 w-4" />
                Final Amount
              </p>
              <div>
                <span className="text-xl font-semibold text-orange-500">{currencyFormatter(parseInt(order.amountInCents))}</span>
              </div>
            </div>
          </div>
          {/* order history */}
          <OrderHistory />
        </div>
      )}
    </>
  );
};

export default OrderItem;
