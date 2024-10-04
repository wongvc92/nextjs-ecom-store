import { eq } from "drizzle-orm";
import { db } from "..";
import { IProduct } from "@/lib/types";
import { getProductById } from "./products";
import { auth } from "@/auth";
import { CartItem, cartItems as cartItemsTable } from "../schema/cartItems";
import { carts } from "../schema/carts";
import { cache } from "react";
import { revalidatePath } from "next/cache";
import { deleteCartItem } from "@/lib/services/cartItemServices";
import { getJWT, verifyJWT } from "@/lib/helper/jwtHelpers";

export interface CartItemWithProduct extends CartItem {
  product?: IProduct | null;
}

export interface Cart {
  id: string;
  userId?: string | null;
  cartItems: CartItemWithProduct[];
}

export const getCart = cache(async (): Promise<Cart | null> => {
  const session = await auth();

  let cart: Cart | null = null;

  if (session) {
    cart = await getUserCart(session.user.id);
  } else {
    cart = await getGuestCart();
  }

  if (!cart) {
    return null;
  }
  let itemsWithProducts;
  itemsWithProducts = await Promise.all(
    cart.cartItems.map(async (cartItem) => {
      const product = await getProductById(cartItem.productId as string);
      return { ...cartItem, product: (product as IProduct) ?? null };
    })
  );
  const itemWithNullProducts = itemsWithProducts.filter((item) => item.product === null);

  for (const item of itemWithNullProducts) {
    await db.transaction(async (tx) => {
      await deleteCartItem(item.id, tx);
    });

    revalidatePath("/", "layout");
  }

  const itemsWithoutNullProduct = itemsWithProducts.filter((item) => item.product !== null);

  return {
    ...cart,
    id: cart.id,
    userId: (cart.userId as string) ?? null,
    cartItems: itemsWithoutNullProduct,
  };
});

export const getExistingCartItem = async (id: string): Promise<CartItem | null> => {
  const [existingcartItem] = await db.select().from(cartItemsTable).where(eq(cartItemsTable.id, id));
  if (!existingcartItem) return null;
  return existingcartItem;
};

export const getUserCart = async (userId: string): Promise<Cart | null> => {
  const userCart = await db.query.carts.findFirst({
    where: eq(carts.userId, userId),
    with: { cartItems: true },
  });
  if (!userCart) return null;
  return userCart;
};

export const getGuestCart = async (): Promise<Cart | null> => {
  const jwt = getJWT("guestCartId");
  if (!jwt) {
    return null;
  }
  const payload = await verifyJWT(jwt);
  const guestCartId = payload.cartId as string;

  if (!guestCartId) return null;
  const cart = await db.query.carts.findFirst({
    where: eq(carts.id, guestCartId),
    with: { cartItems: true },
  });

  if (!cart) return null;
  return cart;
};
