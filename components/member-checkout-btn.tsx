"use client";

import React, { useTransition } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import Spinner from "./spinner";
import { memberCheckout } from "@/actions/checkout";
import { useCartContext } from "@/providers/cart.provider";

const MemberCheckoutButton = () => {
  const [isPending, startTransition] = useTransition();
  const { foundCourier, toPostcode, courierChoice, totalWeightInKg } = useCartContext();

  const onCheckOut = async () => {
    try {
      const res = await memberCheckout({ toPostcode, courierChoice, totalWeightInKg });
      if (res && res.success) {
        window.location.href = res.success.url;
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };
  return (
    <Button
      onClick={() => startTransition(onCheckOut)}
      type="button"
      className="flex items-center gap-2 w-full"
      disabled={isPending || foundCourier === false}
    >
      {isPending ? (
        <>
          <Spinner className="w-4 h-4" />
          Member Checkout
        </>
      ) : (
        "Member Checkout"
      )}
    </Button>
  );
};

export default MemberCheckoutButton;
