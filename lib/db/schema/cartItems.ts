import { relations } from "drizzle-orm";
import { integer, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { carts } from "./carts";

export const cartItems = pgTable("cart_item", {
  id: uuid("id").primaryKey().defaultRandom(),
  variationType: varchar("variation_type").notNull(),
  quantity: integer("quantity").notNull(),
  productId: varchar("product_id").notNull(),
  variationId: varchar("variation_id"),
  nestedVariationId: varchar("nested_variation_id"),
  cartId: uuid("cart_id")
    .references(() => carts.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Define relations for cartItems
export const cartItemRelations = relations(cartItems, ({ one }) => ({
  cart: one(carts, {
    fields: [cartItems.cartId],
    references: [carts.id],
  }),
}));

export type CartItem = typeof cartItems.$inferSelect;
