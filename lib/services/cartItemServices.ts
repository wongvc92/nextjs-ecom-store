import { eq } from "drizzle-orm";
import { CartItem, cartItems as cartItemsTable } from "../db/schema/cartItems";
import { db } from "../db";
import { validateProductStock } from "./productServices";
import { PgTransaction } from "drizzle-orm/pg-core";

export const deleteCartItemByCartId = async (cartId: string, tx: PgTransaction<any, any, any>) => {
  return await tx.delete(cartItemsTable).where(eq(cartItemsTable.cartId, cartId));
};

export const deleteCartItem = async (id: string, tx: PgTransaction<any, any, any>) => {
  return await tx.delete(cartItemsTable).where(eq(cartItemsTable.id, id));
};

interface AddNewCartItemProps {
  cartId: string;
  quantity: number;
  productId: string;
  variationId: string | null;
  nestedVariationId: string | null;
  variationType: string;
  tx: PgTransaction<any, any, any>;
}
export const addNewCartItem = async ({
  cartId,
  quantity,
  productId,
  variationId,
  nestedVariationId,
  variationType,
  tx,
}: AddNewCartItemProps): Promise<CartItem | null> => {
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

interface ValidateAndUpdateCartItemProps {
  cartItemId: string;
  quantity: number;
  productId: string;
  variationId: string | null;
  nestedVariationId: string | null;
  variationType: string;
}

export const validateAndUpdateCartItem = async ({
  cartItemId,
  quantity,
  productId,
  variationId,
  nestedVariationId,
  variationType,
}: ValidateAndUpdateCartItemProps) => {
  try {
    const { stockCount, maxPurchase, isArchived } = await validateProductStock(productId, variationId!, nestedVariationId!, variationType!);

    if (quantity > maxPurchase) {
      await updateExistingCartItemQuantity(cartItemId, maxPurchase);
      return { error: `Only ${maxPurchase} item per single variation or product allowed` };
    }
    if (quantity > stockCount) {
      await updateExistingCartItemQuantity(cartItemId, stockCount);
      return { error: `Only ${stockCount} unit left for this product` };
    }
    if (isArchived) {
      return { error: `Sorry, this product is no longer available.` };
    }
    if (stockCount === 0) {
      return { error: `Item out of stock.` };
    }

    return { success: "Cart updated successfully" };
  } catch (error) {
    console.log("Failed validate cart", error);
    return { error: "Failed validate cart" };
  }
};
