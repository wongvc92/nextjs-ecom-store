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
  const { foundCourier } = useCartContext();
  const onCheckOut = async () => {
    const res = await guestCheckout();
    if (res?.success) {
      window.location.href = res.success.url;
    } else if (res?.error) {
      toast.error("Failed checkout, please try again later");
    }
  };

  return (
    <Button
      type="submit"
      className="flex items-center gap-2 w-full"
      disabled={isPending || foundCourier === false}
      onClick={() => startTransition(onCheckOut)}
      style={{ display: data?.user.id ? "none" : "block" }}
    >
      {isPending ? (
        <>
          <Spinner className="w-4 h-4" />
          Guest Checkout
        </>
      ) : (
        "Guest Checkout"
      )}
    </Button>
  );
};

export default GuestCheckOutButton;
