import { getOrderById } from "@/lib/db/queries/orders";
import { Metadata } from "next";
import { HashIcon, MapPin, ReceiptText, ScrollText } from "lucide-react";
import OrderLogisticInfo from "./components/order-logistic-info";
import OrderPaymentInfo from "./components/order-payment-info";
import { currencyFormatter } from "@/lib/utils";
import OrderHistory from "./components/order-history";
import OrderPageLoading from "./components/order-page-loading";

interface OrderPageByIdProps {
  params: { orderId: string };
}

export const metadata: Metadata = {
  title: "Order Details",
  description: "View detailed information about your order, including items, shipping status, and payment information.",
};

export const dynamic = "force-dynamic";

const OrderPageById = async ({ params }: OrderPageByIdProps) => {
  const order = await getOrderById(params.orderId);

  if (!order) {
    return <div className="flex justify-center">No orders</div>;
  }

  return (
    <section className="w-full md:container">
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
        <OrderHistory order={order} />
      </div>
    </section>
  );
};

export default OrderPageById;
