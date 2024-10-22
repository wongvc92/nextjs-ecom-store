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
