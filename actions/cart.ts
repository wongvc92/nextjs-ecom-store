"use server";

import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { CartItem, cartItems } from "@/lib/db/schema/cartItems";
import { CartItemWithProduct, getCart, getExistingCartItem } from "@/lib/db/queries/carts";

import {
  addToCartSchema,
  decreaseCartSchema,
  increaseCartSchema,
  removeCartSchema,
  updatecartItemsByNestedVariationSchema,
  updatecartItemsByVariationSchema,
  updateCartQuantitySchema,
} from "@/lib/validation/cartSchemas";
import { addNewCartItem, deleteCartItem, updateExistingCartItemQuantity, validateAndUpdateCartItem } from "@/lib/services/cartItemServices";
import { createCart } from "@/lib/services/cartServices";

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

    const result = await validateAndUpdateCartItem({
      productId: existingcartItem.productId,
      quantity: existingcartItem.quantity + 1,
      variationId: existingcartItem.variationId,
      nestedVariationId: existingcartItem.nestedVariationId,
      variationType: existingcartItem.variationType,
      cartItemId: id,
    });
    revalidatePath("/", "layout");
    return result;
  } catch (error: any) {
    return {
      error: `Failed increase quantity: ${error?.message}`,
    };
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
      await db.transaction(async (tx) => {
        await deleteCartItem(id, tx);
      });
    } else {
      await updateExistingCartItemQuantity(existingcartItem.id, existingcartItem.quantity - 1);
    }

    return {
      success: "cart updated",
    };
  } catch (error: any) {
    return {
      error: `Failed decrease quantity`,
    };
  } finally {
    revalidatePath("/", "layout");
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
      await db.transaction(async (tx) => {
        await deleteCartItem(id, tx);
      });
    } else {
      const result = await validateAndUpdateCartItem({
        productId: existingcartItem.productId,
        quantity: newQuantity,
        variationId: existingcartItem.variationId,
        nestedVariationId: existingcartItem.nestedVariationId,
        variationType: existingcartItem.variationType,
        cartItemId: id,
      });
      return result;
    }
    revalidatePath("/", "layout");
    return {
      success: "cart updated",
    };
  } catch (error: any) {
    return {
      error: `Failed to update cart: ${error?.message}`,
    };
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
    const { id, newVariationId, quantity } = validatedData.data;

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
      .where(and(eq(cartItems.cartId, cart.id), eq(cartItems.variationId, newVariationId), eq(cartItems.productId, existingCartItem.productId)));

    let newcartItem;
    if (!cartItemsWitNewVariationId) {
      await db.transaction(async (tx) => {
        newcartItem = await addNewCartItem({
          cartId: cart.id,
          quantity,
          productId: existingCartItem.productId,
          variationId: newVariationId,
          nestedVariationId: existingCartItem.nestedVariationId,
          variationType: existingCartItem.variationType,
          tx,
        });

        await deleteCartItem(id, tx);
      });
    } else {
      newcartItem = await updateExistingCartItemQuantity(cartItemsWitNewVariationId.id, cartItemsWitNewVariationId.quantity + quantity);
      await db.transaction(async (tx) => {
        await deleteCartItem(id, tx);
      });
    }

    if (!newcartItem) {
      return {
        error: `Failed to update cart`,
      };
    }
    const result = await validateAndUpdateCartItem({
      productId: newcartItem.productId,
      quantity: newcartItem.quantity,
      variationId: newcartItem.variationId,
      nestedVariationId: newcartItem.nestedVariationId,
      variationType: newcartItem.variationType,
      cartItemId: newcartItem.id,
    });
    revalidatePath("/");
    return result;
  } catch (error: any) {
    return {
      error: `Failed to update cart: ${error?.message}`,
    };
  }
};

export const updatecartItemsByNestedVariation = async (formData: FormData): Promise<{ error?: string; success?: string }> => {
  try {
    const validatedData = updatecartItemsByNestedVariationSchema.safeParse(Object.fromEntries(formData));

    if (!validatedData.success) {
      console.log(validatedData.error.flatten());
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

    let newcartItem: CartItem | null = null;
    if (!cartItemsWitNewNestedVariationId) {
      newcartItem = await db.transaction(async (tx) => {
        const newItem = await addNewCartItem({
          cartId: cart.id,
          quantity: existingCartItem.quantity,
          productId: existingCartItem.productId,
          variationId: existingCartItem.variationId,
          nestedVariationId: newNestedVariationId,
          variationType: existingCartItem.variationType,
          tx,
        });

        await deleteCartItem(id, tx);

        return newItem;
      });
    } else {
      newcartItem = await db.transaction(async (tx) => {
        const newItem = await addNewCartItem({
          cartId: cart.id,
          quantity: cartItemsWitNewNestedVariationId.quantity + quantity,
          productId: cartItemsWitNewNestedVariationId.productId,
          variationId: cartItemsWitNewNestedVariationId.variationId,
          nestedVariationId: newNestedVariationId,
          variationType: cartItemsWitNewNestedVariationId.variationType,
          tx,
        });

        await deleteCartItem(id, tx);
        await deleteCartItem(cartItemsWitNewNestedVariationId.id, tx);
        return newItem;
      });
    }

    if (!newcartItem) {
      return {
        error: `Failed to update cart`,
      };
    }

    const result = await validateAndUpdateCartItem({
      productId: newcartItem.productId,
      quantity: newcartItem.quantity,
      variationId: newcartItem.variationId,
      nestedVariationId: newcartItem.nestedVariationId,
      variationType: newcartItem.variationType,
      cartItemId: newcartItem.id,
    });
    revalidatePath("/");
    return result;
  } catch (error: any) {
    return {
      error: `Failed to update cart: ${error?.message}`,
    };
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
    console.log("id", id);
    await db.transaction(async (tx) => {
      return await deleteCartItem(id, tx);
    });

    revalidatePath("/");
    return {
      success: "cart item deleted",
    };
  } catch (error) {
    console.log(`Failed to delete cart: ${error}`);
    return {
      error: "Failed to delete cart",
    };
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
      await db.transaction(async (tx) => {
        await deleteCartItem(cartItem.id, tx);
      });
    }
    revalidatePath("/");
    return {
      success: "cart item deleted",
    };
  } catch (error: any) {
    return {
      error: `Failed to delete cart: ${error?.message}`,
    };
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

    let result = { error: "", success: "" };
    if (existingProductInCartItem) {
      const validationResult = await validateAndUpdateCartItem({
        productId: existingProductInCartItem.productId,
        quantity: existingProductInCartItem.quantity + 1,
        variationId: existingProductInCartItem.variationId,
        nestedVariationId: existingProductInCartItem.nestedVariationId,
        variationType: existingProductInCartItem.variationType,
        cartItemId: existingProductInCartItem.id,
      });
      result = {
        error: validationResult.error || "",
        success: validationResult.success || "",
      };
    } else {
      await db.transaction(async (tx) => {
        await addNewCartItem({
          cartId: cart.id,
          quantity: 1,
          productId: productId,
          variationId: selectedVariationId,
          nestedVariationId: selectedNestedVariationId,
          variationType,
          tx,
        });
      });
    }

    revalidatePath("/");
    return result;
  } catch (error) {
    console.log("Failed add to cart", error);
    return {
      error: "Failed add to cart",
    };
  }
};
