"use server";

import { auth } from "@/auth";
import { getCart } from "@/lib/db/queries/carts";

export const guestCheckout = async () => {
  const cart = await getCart();

  if (!cart?.cartItems) return;
  const response = await fetch(`${process.env.NEXT_PUBLIC_ADMIN_URL}/api/checkout/guest`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ cartItems: cart.cartItems }),
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

export const memberCheckout = async () => {
  const session = await auth();
  if (!session) {
    return null;
  }

  const cart = await getCart();
  console.log("checkout cart", cart);
  const customer = {
    customerId: session?.user?.id,
  };
  if (!cart?.cartItems) return;

  const response = await fetch(`${process.env.NEXT_PUBLIC_ADMIN_URL}/api/checkout/member`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ cartItems: cart.cartItems, customer }),
  });
  if (!response.ok) {
    throw new Error("Failed checkout");
  }
  const data = await response.json();
  if (data) {
    return { success: { url: data.url } };
  }
};
