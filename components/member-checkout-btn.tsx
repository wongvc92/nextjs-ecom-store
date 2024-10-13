"use client";

import React, { useTransition } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import Spinner from "./spinner";
import { memberCheckout } from "@/actions/checkout";
import { useCartContext } from "@/providers/cart.provider";

const MemberCheckoutButton = () => {
  const [isPending, startTransition] = useTransition();
  const { foundCourier } = useCartContext();

  const onCheckOut = async (e: React.FormEvent<HTMLFormElement>) => {
    startTransition(async () => {
      e.preventDefault();
      try {
        const res = await memberCheckout();
        if (res && res.success) {
          window.location.href = res.success.url;
        }
      } catch (error) {
        toast.error("Something went wrong");
      }
    });
  };
  return (
    <form onSubmit={onCheckOut}>
      <Button type="submit" className="flex items-center gap-2 w-full" disabled={isPending || foundCourier === false}>
        {isPending ? (
          <>
            <Spinner className="w-4 h-4" />
            Member Checkout
          </>
        ) : (
          "Member Checkout"
        )}
      </Button>
    </form>
  );
};

export default MemberCheckoutButton;
