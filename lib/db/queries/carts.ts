import { eq } from "drizzle-orm";
import { db } from "..";
import { IProduct } from "@/lib/types";
import { getProductById } from "./products";
import { auth } from "@/auth";
import { cookies } from "next/dist/client/components/headers";
import { jwtVerify } from "jose";
import { CartItem, cartItems as cartItemsTable } from "../schema/cartItems";
import { carts } from "../schema/carts";
import { cache } from "react";
import { deleteCartItem } from "@/lib/services/cartServices";
import { revalidatePath } from "next/cache";

export interface CartItemWithProduct extends CartItem {
  product?: IProduct | null;
}

export interface Cart {
  id: string;
  userId?: string | null;
  cartItems: CartItemWithProduct[];
}

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export const getCart = cache(async (): Promise<Cart | null> => {
  const session = await auth();

  let cart: Cart | null = null;

  if (session) {
    cart = (await db.query.carts.findFirst({
      where: eq(carts.userId, session.user.id),
      with: { cartItems: true },
    })) as Cart | null;
  } else {
    const jwt = cookies().get("localCartId")?.value;
    if (!jwt) {
      return null;
    }
    const { payload } = await jwtVerify(jwt, secret);
    const localCartId = payload.cartId as string;

    if (localCartId) {
      cart = (await db.query.carts.findFirst({
        where: eq(carts.id, localCartId),
        with: { cartItems: true },
      })) as Cart | null;
    }
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
    await deleteCartItem(item.id);
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

export const getExistingCartItem = cache(async (id: string): Promise<CartItem | null> => {
  const [existingcartItem] = await db.select().from(cartItemsTable).where(eq(cartItemsTable.id, id));
  if (!existingcartItem) return null;
  return existingcartItem;
});
