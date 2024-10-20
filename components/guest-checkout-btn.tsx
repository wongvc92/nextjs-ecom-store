"use client";

import React, { useTransition } from "react";
import { Button } from "./ui/button";
import Spinner from "./spinner";
import { useSession } from "next-auth/react";
import { guestCheckout } from "@/actions/checkout";
import { toast } from "sonner";
import { useCartContext } from "@/providers/cart.provider";

const GuestCheckOutButton = () => {
  const { data } = useSession();
  const [isPending, startTransition] = useTransition();
  const { foundCourier, toPostcode, courierChoice, totalWeightInKg } = useCartContext();
  const onCheckOut = async () => {
    const res = await guestCheckout({ toPostcode, courierChoice, totalWeightInKg });
    if (res?.success) {
      window.location.href = res.success.url;
    } else if (res?.error) {
      toast.error("Failed checkout, please try again later");
    }
  };

  return (
    <Button
      type="button"
      className={`flex items-center justify-center gap-2 w-full ${data?.user.id ? "hidden" : "flex"}`}
      disabled={isPending || foundCourier === false}
      onClick={() => startTransition(onCheckOut)}
    >
      {isPending ? (
        <p className="flex items-center justify-center gap-2 w-full">
          <Spinner className="w-4 h-4" />
          Guest Checkout
        </p>
      ) : (
        "Guest Checkout"
      )}
    </Button>
  );
};

export default GuestCheckOutButton;
