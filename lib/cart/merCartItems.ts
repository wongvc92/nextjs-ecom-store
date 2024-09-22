import { CartItem } from "../db/schema/cartItems";

export const mergecartItem = (...cartItem: CartItem[][]): CartItem[] => {
  return cartItem.reduce((acc, items) => {
    items.forEach((item) => {
      let existingItem;
      if (item.variationType === "NONE") {
        existingItem = acc.find((i) => i.productId === item.productId);
      } else if (item.variationType === "VARIATION") {
        existingItem = acc.find((i) => i.productId === item.productId && i.variationId === item.variationId);
      } else if (item.variationType === "NESTED_VARIATION") {
        existingItem = acc.find(
          (i) => i.productId === item.productId && i.variationId === item.variationId && i.nestedVariationId === item.nestedVariationId
        );
      }

      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        acc.push(item);
      }
    });
    return acc;
  }, [] as CartItem[]);
};
