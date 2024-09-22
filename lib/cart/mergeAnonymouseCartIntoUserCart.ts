import { CartItem, cartItems as cartItemsTable } from "../db/schema/cartItems";
import { carts } from "../db/schema/carts";
import { cookies } from "next/dist/client/components/headers";
import { jwtVerify, SignJWT } from "jose";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { mergecartItem } from "./merCartItems";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function mergeAnonymouseCartIntoUserCart(userId: string) {
  const jwt = cookies().get("localCartId")?.value;
  if (!jwt) {
    return null;
  }
  const { payload } = await jwtVerify(jwt, secret);
  const localCartId = payload.cartId as string;
  console.log("localCartId", localCartId);
  console.log("userId logged in", userId);
  const localCart = localCartId
    ? await db.query.carts.findFirst({
        where: eq(carts.id, localCartId),
        with: { cartItems: true },
      })
    : null;
  console.log("localCart", localCart);

  if (!localCart) return;

  const userCart = await db.query.carts.findFirst({
    where: eq(carts.userId, userId),
    with: { cartItems: true },
  });

  console.log("userCart", userCart);

  await db.transaction(async (tx) => {
    if (userCart) {
      const mergedcartItem = mergecartItem(localCart.cartItems as CartItem[], userCart.cartItems as CartItem[]);
      console.log("mergedcartItem", mergedcartItem);
      await tx.delete(cartItemsTable).where(eq(cartItemsTable.cartId, userCart.id));

      for (const mergedCartItem of mergedcartItem) {
        await tx.insert(cartItemsTable).values({
          cartId: userCart.id,
          productId: mergedCartItem.productId,
          quantity: mergedCartItem.quantity,
          variationType: mergedCartItem.variationType,
          variationId: mergedCartItem.variationId ?? null,
          nestedVariationId: mergedCartItem.nestedVariationId ?? null,
        });
      }
    } else {
      const [newCart] = await tx.insert(carts).values({ userId: userId }).returning();
      for (const localCartItem of localCart.cartItems as CartItem[])
        await tx.insert(cartItemsTable).values({
          productId: localCartItem.productId,
          quantity: localCartItem.quantity,
          variationType: localCartItem.variationType,
          variationId: localCartItem.variationId ?? null,
          nestedVariationId: localCartItem.nestedVariationId ?? null,
          cartId: newCart.id,
        });
    }
    await tx.delete(carts).where(eq(carts.id, localCart.id));
    cookies().set("localCartId", "");
  });
}
