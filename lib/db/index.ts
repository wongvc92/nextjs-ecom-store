import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { users } from "@/lib/db/schema/users";
import pg, { Pool } from "pg";
import * as favourites from "./schema/favourites";
import * as shippings from "./schema/shippings";
import * as carts from "./schema/carts";
import * as cartItems from "./schema/cartItems";

export const schema = { ...users, ...carts, ...cartItems, ...favourites, ...shippings };

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});
export const db = drizzle(pool, { schema }) as NodePgDatabase<typeof schema>;
