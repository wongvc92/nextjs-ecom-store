"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { cartItems } from "@/lib/db/schema/cartItems";
import { CartItemWithProduct, getCart, getExistingCartItem } from "@/lib/db/queries/carts";
import { createCart } from "@/lib/cart/createCart";
import {
  addToCartSchema,
  decreaseCartSchema,
  increaseCartSchema,
  removeCartSchema,
  updatecartItemsByNestedVariationSchema,
  updatecartItemsByVariationSchema,
  updateCartQuantitySchema,
} from "@/lib/validation/cartSchemas";
import { addNewCartItem, deleteCartItem, updateExistingCartQuantity, validateAndUpdateCart } from "@/lib/cart/cartHelpers";

export const increaseCartQuantity = async (formData: FormData): Promise<{ error?: string; success?: string }> => {
  try {
    const validatedData = increaseCartSchema.safeParse({ id: formData.get("id") });

    if (!validatedData.success) {
      return {
        error: "Something went wrong",
      };
    }
    const { id } = validatedData.data;

    const existingcartItem = await getExistingCartItem(id);

    if (!existingcartItem) {
      return {
        error: `cartItems with the product not found`,
      };
    }

    const result = await validateAndUpdateCart(
      existingcartItem.productId,
      existingcartItem.quantity + 1,
      existingcartItem.variationId,
      existingcartItem.nestedVariationId,
      existingcartItem.variationType,
      id
    );

    return result;
  } catch (error: any) {
    return {
      error: `Failed increase quantity: ${error?.message}`,
    };
  } finally {
    revalidateTag("/carts");
  }
};

export const decreaseCartQuantity = async (formData: FormData): Promise<{ error?: string; success?: string }> => {
  try {
    const validatedData = decreaseCartSchema.safeParse({ id: formData.get("id") });

    if (!validatedData.success) {
      return {
        error: "Something went wrong",
      };
    }
    const { id } = validatedData.data;

    const existingcartItem = await getExistingCartItem(id);

    if (!existingcartItem) {
      return {
        error: `cartItems with the product not found`,
      };
    }

    if (existingcartItem.quantity === 1) {
      await deleteCartItem(id);
    } else {
      const result = await validateAndUpdateCart(
        existingcartItem.productId,
        existingcartItem.quantity - 1,
        existingcartItem.variationId,
        existingcartItem.nestedVariationId,
        existingcartItem.variationType,
        id
      );
      return result;
    }

    return {
      success: "cart updated",
    };
  } catch (error: any) {
    return {
      error: `Failed decrease quantity`,
    };
  } finally {
    revalidateTag("/carts");
  }
};

export const updateCartQuantity = async (formData: FormData): Promise<{ error?: string; success?: string }> => {
  try {
    const validatedData = updateCartQuantitySchema.safeParse({ id: formData.get("id"), newQuantity: formData.get("newQuantity") });

    if (!validatedData.success) {
      return {
        error: "Something went wrong",
      };
    }
    const { id, newQuantity } = validatedData.data;

    const existingcartItem = await getExistingCartItem(id);

    if (!existingcartItem) {
      return {
        error: `cartItems with the product not found`,
      };
    }

    if (newQuantity < 1) {
      await deleteCartItem(id);
    } else {
      const result = await validateAndUpdateCart(
        existingcartItem.productId,
        newQuantity,
        existingcartItem.variationId,
        existingcartItem.nestedVariationId,
        existingcartItem.variationType,
        id
      );
      return result;
    }

    return {
      success: "cart updated",
    };
  } catch (error: any) {
    return {
      error: `Failed to update cart: ${error?.message}`,
    };
  } finally {
    revalidateTag("/carts");
  }
};

export const updatecartItemsByVariation = async (formData: FormData): Promise<{ error?: string; success?: string }> => {
  try {
    const validatedData = updatecartItemsByVariationSchema.safeParse(Object.fromEntries(formData));

    if (!validatedData.success) {
      return {
        error: "Something went wrong",
      };
    }
    const { id, newVariationId, productId, quantity } = validatedData.data;

    const cart = (await getCart()) ?? (await createCart());

    const existingCartItem = await getExistingCartItem(id);
    if (!existingCartItem) {
      return {
        error: `cart item with the product not found`,
      };
    }
    const [cartItemsWitNewVariationId] = await db
      .select()
      .from(cartItems)
      .where(and(eq(cartItems.cartId, cart.id), eq(cartItems.variationId, newVariationId), eq(cartItems.productId, productId)));

    let newcartItem;
    if (!cartItemsWitNewVariationId) {
      [newcartItem] = await addNewCartItem(
        cart.id,
        quantity,
        productId,
        newVariationId,
        existingCartItem.nestedVariationId,
        existingCartItem.variationType
      );

      await deleteCartItem(id);
    } else {
      [newcartItem] = await updateExistingCartQuantity(cartItemsWitNewVariationId.id, cartItemsWitNewVariationId.quantity + quantity);
      await deleteCartItem(id);
    }

    const result = await validateAndUpdateCart(
      newcartItem.productId,
      newcartItem.quantity,
      newcartItem.variationId,
      newcartItem.nestedVariationId,
      newcartItem.variationType
    );

    return result;
  } catch (error: any) {
    return {
      error: `Failed to update cart: ${error?.message}`,
    };
  } finally {
    revalidateTag("/carts");
  }
};

export const updatecartItemsByNestedVariation = async (formData: FormData): Promise<{ error?: string; success?: string }> => {
  try {
    const validatedData = updatecartItemsByNestedVariationSchema.safeParse(Object.fromEntries(formData));

    if (!validatedData.success) {
      return {
        error: "Something went wrong",
      };
    }
    const { id, newNestedVariationId, quantity } = validatedData.data;

    const cart = (await getCart()) ?? (await createCart());
    const existingCartItem = await getExistingCartItem(id);
    if (!existingCartItem) {
      return {
        error: `cart item with the product not found`,
      };
    }

    const [cartItemsWitNewNestedVariationId] = await db
      .select()
      .from(cartItems)
      .where(
        and(
          eq(cartItems.cartId, cart?.id as string),
          eq(cartItems.variationId, existingCartItem.variationId as string),
          eq(cartItems.nestedVariationId, newNestedVariationId),
          eq(cartItems.productId, existingCartItem.productId)
        )
      );

    let newcartItem;
    if (!cartItemsWitNewNestedVariationId) {
      [newcartItem] = await addNewCartItem(
        cart.id,
        existingCartItem.quantity,
        existingCartItem.productId,
        existingCartItem.variationId,
        newNestedVariationId,
        existingCartItem.variationType
      );
      await deleteCartItem(id);
    } else {
      [newcartItem] = await updateExistingCartQuantity(cartItemsWitNewNestedVariationId.id, cartItemsWitNewNestedVariationId.quantity + quantity);
      await deleteCartItem(id);
    }

    const result = await validateAndUpdateCart(
      newcartItem.productId,
      newcartItem.quantity,
      newcartItem.variationId,
      newcartItem.nestedVariationId,
      newcartItem.variationType
    );

    return result;
  } catch (error: any) {
    return {
      error: `Failed to update cart: ${error?.message}`,
    };
  } finally {
    revalidateTag("/carts");
  }
};

export const removeCart = async (formData: FormData): Promise<{ error?: string; success?: string }> => {
  try {
    const validatedData = removeCartSchema.safeParse({ id: formData.get("id") });

    if (!validatedData.success) {
      return {
        error: "something went wrong",
      };
    }
    const { id } = validatedData.data;

    const existingcartItem = await getExistingCartItem(id);

    if (!existingcartItem) {
      return {
        error: "Cart item not found or already deleted",
      };
    }
    await deleteCartItem(existingcartItem.id);

    return {
      success: "cart item deleted",
    };
  } catch (error) {
    return {
      error: `Failed to delete cart: ${error}`,
    };
  } finally {
    revalidatePath("/");
  }
};

export const removeAllcartItems = async () => {
  try {
    const cart = await getCart();
    if (!cart) {
      return {
        error: `cart not found`,
      };
    }
    for (const cartItem of cart.cartItems) {
      await deleteCartItem(cartItem.id);
    }
    return {
      success: "cart item deleted",
    };
  } catch (error: any) {
    return {
      error: `Failed to delete cart: ${error?.message}`,
    };
  } finally {
    revalidateTag("/carts");
    revalidatePath("/");
  }
};

export const addToCart = async (formData: FormData): Promise<{ error?: string; success?: string }> => {
  try {
    const validatedData = addToCartSchema.safeParse(Object.fromEntries(formData));

    if (!validatedData.success) {
      const errorMessage = validatedData.error.errors.map((err) => `${err.path.join(".")} - ${err.message}`);
      console.error("errorMessage", errorMessage);
      return {
        error: "something went wrong",
      };
    }

    const { productId, selectedNestedVariationId, selectedVariationId, variationType } = validatedData.data;
    const cart = (await getCart()) ?? (await createCart());

    let existingProductInCartItem: CartItemWithProduct | undefined;
    if (variationType === "NESTED_VARIATION") {
      existingProductInCartItem = cart.cartItems.find(
        (item) =>
          item.productId === productId &&
          item.variationId === selectedVariationId &&
          item.nestedVariationId === selectedNestedVariationId &&
          item.cartId === cart.id
      );
    } else if (variationType === "VARIATION") {
      existingProductInCartItem = cart.cartItems.find(
        (item) => item.productId === productId && item.variationId === selectedVariationId && item.cartId === cart.id
      );
    } else if (variationType === "NONE") {
      existingProductInCartItem = cart.cartItems.find((item) => item.productId === productId && item.cartId === cart.id);
    }

    let updatedProductInCart: CartItemWithProduct;
    if (existingProductInCartItem) {
      [updatedProductInCart] = await updateExistingCartQuantity(existingProductInCartItem.id, existingProductInCartItem.quantity + 1);
    } else {
      [updatedProductInCart] = await addNewCartItem(cart.id, 1, productId, selectedVariationId!, selectedNestedVariationId!, variationType);
    }

    const result = await validateAndUpdateCart(
      productId,
      updatedProductInCart.quantity,
      updatedProductInCart.variationId,
      updatedProductInCart.nestedVariationId,
      variationType
    );

    return result;
  } catch (error) {
    return {
      error: "Failed add to cart",
    };
  } finally {
    revalidatePath("/");
  }
};
