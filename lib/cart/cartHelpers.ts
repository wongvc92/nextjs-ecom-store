import { and, eq, sql } from "drizzle-orm";
import { db } from "../db";
import { cartItems as cartItemsTable } from "../db/schema/cartItems";

const baseUrl = process.env.NEXT_PUBLIC_ADMIN_URL;
const url = `${baseUrl}/api/checkProduct`;

export const handleStockErrors = async (stockCount: number, isArchived: boolean, maxPurchase: number, quantity: number, cartItemId: string) => {
  if (quantity >= maxPurchase) {
    await updateExistingCartQuantity(cartItemId, maxPurchase);
    return `Only ${maxPurchase} item per single variation or product allowed`;
  }
  if (quantity >= stockCount) {
    await updateExistingCartQuantity(cartItemId, stockCount);
    return `Only ${stockCount} unit left for this product`;
  }
  if (isArchived) {
    return `Sorry, this product is no longer available.`;
  }
  if (stockCount === 0) {
    return `Item out of stock.`;
  }
  return null;
};

export const validateProductStock = async (
  productId: string,
  selectedVariationId: string | null,
  selectedNestedVariationId: string | null,
  variationType: string
) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId,
        selectedVariationId,
        selectedNestedVariationId,
        variationType,
      }),
    });

    if (!response.ok) {
      return {
        error: "Something went wrong",
      };
    }

    const { stockCount, maxPurchase, isArchived } = await response.json();

    return { stockCount, maxPurchase, isArchived };
  } catch (error) {
    return {
      error: `Failed fetch check product`,
    };
  }
};

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
