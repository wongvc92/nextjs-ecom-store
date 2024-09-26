import { eq } from "drizzle-orm";
import { db } from "../db";
import { CartItem, cartItems as cartItemsTable } from "../db/schema/cartItems";
import { handleStockErrors, validateProductStock } from "./productServices";
import { carts, carts as CartsTable } from "../db/schema/carts";
import { auth } from "@/auth";
import { Cart } from "../db/queries/carts";
import { addHours } from "date-fns";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

const baseUrl = process.env.NEXT_PUBLIC_ADMIN_URL;
const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function updateExistingCartQuantity(cartItemId: string, quantity: number) {
  return await db
    .update(cartItemsTable)
    .set({
      quantity,
    })
    .where(eq(cartItemsTable.id, cartItemId))
    .returning();
}

export const validateAndUpdateCart = async (
  productId: string,
  quantity: number,
  variationId: string | null,
  nestedVariationId: string | null,
  variationType?: string,
  cartItemId?: string
) => {
  const { stockCount, maxPurchase, isArchived } = await validateProductStock(productId, variationId!, nestedVariationId!, variationType!);
  const error = await handleStockErrors(stockCount, isArchived, maxPurchase, quantity, cartItemId!);
  if (error) {
    return { error };
  }

  await updateExistingCartQuantity(cartItemId!, quantity);
  return { success: "Cart updated successfully" };
};

export const deleteCartItem = async (cartItemId: string) => {
  return await db.delete(cartItemsTable).where(eq(cartItemsTable.id, cartItemId));
};

export const addNewCartItem = async (
  cartId: string,
  quantity: number,
  productId: string,
  variationId: string | null,
  nestedVariationId: string | null,
  variationType: string
) => {
  return await db
    .insert(cartItemsTable)
    .values({
      cartId,
      productId,
      variationId: variationId ?? null,
      nestedVariationId: nestedVariationId ?? null,
      quantity,
      variationType,
    })
    .returning();
};

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

export const mergecartItem = (...cartItem: CartItem[][]): CartItem[] => {
  return cartItem.reduce((acc, items) => {
    items.forEach((item) => {
      let existingItem;
      if (item.variationType === "NONE") {
        existingItem = acc.find((i) => i.productId === item.productId);
      } else if (item.variationType === "VARIATION") {
        existingItem = acc.find((i) => i.productId === item.productId && i.variationId === item.variationId);
      } else if (item.variationType === "NESTED_VARIATION") {
        existingItem = acc.find(
          (i) => i.productId === item.productId && i.variationId === item.variationId && i.nestedVariationId === item.nestedVariationId
        );
      }

      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        acc.push(item);
      }
    });
    return acc;
  }, [] as CartItem[]);
};

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
