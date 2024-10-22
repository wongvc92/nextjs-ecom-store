import { eq } from "drizzle-orm";
import { db } from "../db";
import { CartItem } from "../db/schema/cartItems";
import { carts, carts as CartsTable } from "../db/schema/carts";
import { auth } from "@/auth";
import { Cart, getGuestCart, getUserCart } from "../db/queries/carts";
import { addHours } from "date-fns";
import { mergecartItem } from "../helper/cartHelpers";
import { createJWT } from "../helper/jwtHelpers";
import { addNewCartItem, deleteCartItemByCartId, validateAndUpdateCartItem } from "./cartItemServices";
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
    newCart = await db.transaction(async (tx) => {
      return await createUserCart(session.user.id, tx);
    });
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
  const newCartItems: CartItem[] = [];
  await db.transaction(async (tx) => {
    if (userCart) {
      await deleteCartItemByCartId(userCart.id, tx);
      const mergedcartItem = mergecartItem(guestCart.cartItems as CartItem[], userCart.cartItems as CartItem[]);

      for (const mergedCartItem of mergedcartItem) {
        const newCartItem = await addNewCartItem({
          cartId: userCart.id,
          quantity: mergedCartItem.quantity,
          productId: mergedCartItem.productId,
          variationId: mergedCartItem.variationId,
          nestedVariationId: mergedCartItem.nestedVariationId,
          variationType: mergedCartItem.variationType,
          tx,
        });
        if (newCartItem) {
          newCartItems.push(newCartItem);
        }
      }
    } else {
      const newCart = await createUserCart(userId, tx);
      for (const localCartItem of guestCart.cartItems as CartItem[]) {
        const newCartItem = await addNewCartItem({
          cartId: newCart.id,
          quantity: localCartItem.quantity,
          productId: localCartItem.productId,
          variationId: localCartItem.variationId,
          nestedVariationId: localCartItem.nestedVariationId,
          variationType: localCartItem.variationType,
          tx,
        });
        if (newCartItem) {
          newCartItems.push(newCartItem);
        }
      }
    }

    for (const newCartItem of newCartItems) {
      await validateAndUpdateCartItem({
        productId: newCartItem.productId,
        quantity: newCartItem.quantity,
        variationId: newCartItem.variationId,
        nestedVariationId: newCartItem.nestedVariationId,
        variationType: newCartItem.variationType,
        cartItemId: newCartItem.id,
      });
    }
    await deleteCart(guestCart.id, tx);
    resetCookie("guestCartId");
  });
}
