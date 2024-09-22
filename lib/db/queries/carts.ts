import { and, eq } from "drizzle-orm";
import { db } from "..";
import { users } from "../schema/users";
import { IProduct } from "@/lib/types";
import { getProductById } from "./products";
import { auth } from "@/auth";
import { cookies } from "next/dist/client/components/headers";
import { jwtVerify, SignJWT } from "jose";
import { CartItem, cartItems as cartItemsTable } from "../schema/cartItems";
import { carts } from "../schema/carts";

export interface CartItemWithProduct extends CartItem {
  product?: IProduct | null;
}

export interface Cart {
  id: string;
  userId?: string | null;
  cartItems: CartItemWithProduct[];
}

const baseUrl = process.env.NEXT_PUBLIC_ADMIN_URL!;

export const getCartQuantityByUserId = async (loggedInId: string, productId: string, variationId: string, nestedVariationId: string) => {
  try {
    const [existingUser] = await db.select().from(users).where(eq(users.id, loggedInId)).limit(1);
    if (!existingUser) {
      return null;
    }

    const [existingCart] = await db.select().from(carts).where(eq(carts.userId, existingUser.id)).limit(1);

    if (!existingCart) {
      return {
        error: `cart not found`,
      };
    }

    const whereConditions = [eq(cartItemsTable.cartId, existingCart.id!), eq(cartItemsTable.productId, productId)];

    if (variationId) {
      whereConditions.push(eq(cartItemsTable.variationId, variationId));
    }

    if (nestedVariationId) {
      whereConditions.push(eq(cartItemsTable.nestedVariationId, nestedVariationId));
    }

    const foundCartItem = await db.query.cartItems.findFirst({
      where: and(...whereConditions),
      columns: { quantity: true },
    });

    return { cartQuantity: foundCartItem?.quantity };
  } catch (error: any) {
    return {
      error: "[FAILED FETCH CART ITEM COUNT]",
    };
  }
};

export const getCartByUserId = async (loggedInId: string) => {
  try {
    const url = `${baseUrl}/api/cart`;
    const [existingUser] = await db.select().from(users).where(eq(users.id, loggedInId)).limit(1);
    if (!existingUser) {
      return null;
    }

    const cart = await db.query.carts.findFirst({
      where: eq(carts.userId, loggedInId),
      with: { cartItems: true },
    });

    if (!cart) {
      return {
        error: "cart not found",
      };
    }

    const cartItem = cart;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cartItem }),
      cache: "force-cache",
      next: { tags: ["carts"] },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const { newcartItem } = await response.json();

    return { cartsData: newcartItem };
  } catch (error: any) {
    console.error(`Failed fetch cart: ${error}`);
    return {
      error: "Failed fetch cart",
    };
  }
};

export const getCheckoutcartItems = async (loggedInId: string): Promise<{ cartItems?: CartItem[]; error?: string }> => {
  try {
    const session = await auth();
    if (!session) {
      return {
        error: "user not found",
      };
    }

    const [cart] = await db.query.carts.findMany({
      where: eq(carts.userId, session.user.id),
      with: { cartItems: true },
    });

    if (!cart) {
      return {
        error: "cart not found",
      };
    }

    return { cartItems: cart.cartItems };
  } catch (error: any) {
    console.error(`Failed fetch cart: ${error}`);
    return {
      error: "Failed fetch cart",
    };
  }
};

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function getCart(): Promise<Cart | null> {
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

  const itemsWithProducts = await Promise.all(
    cart.cartItems.map(async (cartItem) => {
      const product = await getProductById(cartItem.productId as string);
      return { ...cartItem, product: product.product };
    })
  );

  return {
    ...cart,
    id: cart.id,
    userId: (cart.userId as string) ?? null,
    cartItems: itemsWithProducts,
  };
}

export const getExistingCartItem = async (id: string): Promise<CartItem | null> => {
  const [existingcartItem] = await db.select().from(cartItemsTable).where(eq(cartItemsTable.id, id));
  if (!existingcartItem) return null;
  return existingcartItem;
};
