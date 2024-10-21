import { eq } from "drizzle-orm";
import { db } from "../db";
import { CartItem } from "../db/schema/cartItems";
import { carts, carts as CartsTable } from "../db/schema/carts";
import { auth } from "@/auth";
import { Cart, getGuestCart, getUserCart } from "../db/queries/carts";
import { addHours } from "date-fns";
import { mergecartItem } from "../helper/cartHelpers";
import { createJWT } from "../helper/jwtHelpers";
import { addNewCartItem, deleteCartItem } from "./cartItemServices";
import { resetCookie, setCookie } from "../helper/cookieHelpers";

export const deleteCart = async (cartId: string, tx: any) => {
  await tx.delete(carts).where(eq(carts.id, cartId));
};

export const createUserCart = async (userId: string, tx: any) => {
  const [newCart] = await tx.insert(CartsTable).values({ userId }).returning();
  return newCart;
};

export const createGuestCart = async () => {
  const [newCart] = await db.insert(CartsTable).values({}).returning();

  if (!newCart) {
    throw new Error("Failed to create cart");
  }
  const expirationTime = addHours(new Date(), 6);
  const jwt = await createJWT(newCart.id, expirationTime);
  setCookie(jwt, expirationTime);
  return newCart;
};

export async function createCart(): Promise<Cart> {
  const session = await auth();

  let newCart;
  if (session) {
    newCart = await createGuestCart();
  } else {
    newCart = await createGuestCart();
  }

  return {
    ...newCart,
    cartItems: [],
  };
}

export async function mergeAnonymouseCartIntoUserCart(userId: string) {
  const guestCart = await getGuestCart();

  if (!guestCart) return;

  const userCart = await getUserCart(userId);

  await db.transaction(async (tx) => {
    if (userCart) {
      await deleteCartItem(userCart.id, tx);
      const mergedcartItem = mergecartItem(guestCart.cartItems as CartItem[], userCart.cartItems as CartItem[]);

      for (const mergedCartItem of mergedcartItem) {
        await addNewCartItem(
          userCart.id,
          mergedCartItem.quantity,
          mergedCartItem.productId,
          mergedCartItem.variationId,
          mergedCartItem.nestedVariationId,
          mergedCartItem.variationType,
          tx
        );
      }
    } else {
      const newCart = await createUserCart(userId, tx);
      for (const localCartItem of guestCart.cartItems as CartItem[])
        await addNewCartItem(
          newCart.id,
          localCartItem.quantity,
          localCartItem.productId,
          localCartItem.variationId,
          localCartItem.nestedVariationId,
          localCartItem.variationType,
          tx
        );
    }
    await deleteCart(guestCart.id, tx);
    resetCookie("guestCartId");
  });
}
