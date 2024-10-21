import { eq } from "drizzle-orm";
import { CartItem, cartItems as cartItemsTable } from "../db/schema/cartItems";
import { db } from "../db";
import { handleStockErrors, validateProductStock } from "./productServices";
import { PgTransaction } from "drizzle-orm/pg-core";

export const deleteCartItem = async (cartId: string, tx: PgTransaction<any, any, any>) => {
  return await tx.delete(cartItemsTable).where(eq(cartItemsTable.cartId, cartId));
};

export const addNewCartItem = async (
  cartId: string,
  quantity: number,
  productId: string,
  variationId: string | null,
  nestedVariationId: string | null,
  variationType: string,
  tx: PgTransaction<any, any, any>
): Promise<CartItem | null> => {
  const [newCartItem] = await tx
    .insert(cartItemsTable)
    .values({
      cartId,
      productId,
      quantity,
      variationId: variationId ?? null,
      nestedVariationId: nestedVariationId ?? null,
      variationType,
    })
    .returning();

  return newCartItem ?? null;
};

export const updateExistingCartItemQuantity = async (cartItemId: string, quantity: number): Promise<CartItem | null> => {
  const [updatedCartItem] = await db
    .update(cartItemsTable)
    .set({
      quantity,
    })
    .where(eq(cartItemsTable.id, cartItemId))
    .returning();

  return updatedCartItem;
};

export const validateAndUpdateCartItem = async (
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

  await updateExistingCartItemQuantity(cartItemId!, quantity);
  return { success: "Cart updated successfully" };
};
