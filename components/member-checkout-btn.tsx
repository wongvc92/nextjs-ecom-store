"use client";

import React, { useTransition } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import Spinner from "./spinner";
import { memberCheckout } from "@/actions/checkout";
import { useCartContext } from "@/providers/cart.provider";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const MemberCheckoutButton = () => {
  const [isPending, startTransition] = useTransition();
  const { foundCourier, toPostcode, courierChoice, totalWeightInKg, setIsOpen } = useCartContext();
  const { data } = useSession();
  const router = useRouter();
  const onCheckOut = async () => {
    if (!data?.user.id) {
      setIsOpen(false);
      router.push("/auth/sign-in");
      return;
    }
    const res = await memberCheckout({ toPostcode, courierChoice, totalWeightInKg });
    if (res && res.success) {
      window.location.href = res.success.url;
    }
  };
  return (
    <Button
      onClick={() => startTransition(onCheckOut)}
      type="button"
      className="flex items-center justify-center gap-2 w-full"
      disabled={isPending || foundCourier === false}
    >
      {isPending ? (
        <p className="flex items-center justify-center gap-2 w-full">
          <Spinner className="w-4 h-4" />
          Member Checkout
        </p>
      ) : (
        "Member Checkout"
      )}
    </Button>
  );
};

export default MemberCheckoutButton;
