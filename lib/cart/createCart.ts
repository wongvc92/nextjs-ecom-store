import { auth } from "@/auth";
import { Cart } from "../db/queries/carts";
import { db } from "../db";
import { carts as CartsTable } from "../db/schema/carts";
import { addHours } from "date-fns";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function createCart(): Promise<Cart> {
  const session = await auth();

  let newCart;
  if (session) {
    [newCart] = await db.insert(CartsTable).values({ userId: session.user.id }).returning();
  } else {
    [newCart] = await db.insert(CartsTable).values({}).returning({ id: CartsTable.id });

    if (!newCart) {
      throw new Error("Failed to create cart");
    }
    const expirationTime = addHours(new Date(), 6);

    const jwt = await new SignJWT({ cartId: newCart.id })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime(Math.floor(expirationTime.getTime() / 1000))
      .sign(secret);

    cookies().set("localCartId", jwt, {
      expires: expirationTime,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
  }

  return {
    ...newCart,
    cartItems: [],
  };
}
