import { updateExistingCartItemQuantity } from "./cartItemServices";

const baseUrl = process.env.NEXT_PUBLIC_ADMIN_URL;
const url = `${baseUrl}/api/checkProduct`;

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

export const handleStockErrors = async (stockCount: number, isArchived: boolean, maxPurchase: number, quantity: number, cartItemId: string) => {
  if (quantity > maxPurchase) {
    await updateExistingCartItemQuantity(cartItemId, maxPurchase);
    return `Only ${maxPurchase} item per single variation or product allowed`;
  }
  if (quantity > stockCount) {
    await updateExistingCartItemQuantity(cartItemId, stockCount);
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
