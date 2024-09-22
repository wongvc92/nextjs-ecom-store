import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { users } from "./users";
import { relations } from "drizzle-orm";

export const shippings = pgTable("shipping", {
  id: uuid("id").primaryKey().defaultRandom(),
  line1: varchar("line1"),
  line2: varchar("line2"),
  city: varchar("city"),
  state: varchar("state"),
  postal_code: varchar("postal_code"),
  country: varchar("country"),
  userId: text("user_id")
    .references(() => users.id)
    .notNull(),
  phoneNumber: varchar("phone_number"),
  email: varchar("email"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const shippingRelations = relations(shippings, ({ one }) => ({
  user: one(users, {
    fields: [shippings.userId],
    references: [users.id],
  }),
}));
