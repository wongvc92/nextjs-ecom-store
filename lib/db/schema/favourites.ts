import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { users } from "./users";
import { relations } from "drizzle-orm";

export const favourites = pgTable("favourite", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .references(() => users.id)
    .notNull(),
  productId: varchar("product_id").notNull(),
  variationType: varchar("variation_type").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const favouriteRelations = relations(favourites, ({ one }) => ({
  user: one(users, {
    fields: [favourites.userId],
    references: [users.id],
  }),
}));

export type Favourite = typeof favourites.$inferSelect;
