"use server";

import { auth } from "@/auth";
import { getCart } from "@/lib/db/queries/carts";
import { redirect } from "next/navigation";

interface ICheckoutProps {
  toPostcode: string;
  courierChoice: string;
  totalWeightInKg: number;
}
export const guestCheckout = async ({ toPostcode, courierChoice, totalWeightInKg }: ICheckoutProps) => {
  const cart = await getCart();

  if (!cart?.cartItems) return;
  const response = await fetch(`${process.env.NEXT_PUBLIC_ADMIN_URL}/api/checkout/guest`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ cartItems: cart.cartItems, toPostcode, courierChoice, totalWeightInKg }),
  });
  if (!response.ok) {
    return {
      error: "Failed checkout",
    };
  }
  const data = await response.json();
  if (data) {
    return { success: { url: data.url } };
  }
};

export const memberCheckout = async ({ toPostcode, courierChoice, totalWeightInKg }: ICheckoutProps) => {
  const session = await auth();
  if (!session) {
    return redirect("/auth/sign-in");
  }

  const cart = await getCart();

  const customer = {
    customerId: session?.user?.id,
  };
  if (!cart?.cartItems) return;

  const response = await fetch(`${process.env.NEXT_PUBLIC_ADMIN_URL}/api/checkout/member`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ cartItems: cart.cartItems, customer, toPostcode, courierChoice, totalWeightInKg }),
  });
  if (!response.ok) {
    throw new Error("Failed checkout");
  }
  const data = await response.json();
  if (data) {
    return { success: { url: data.url } };
  }
};
