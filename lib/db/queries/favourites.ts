import { and, count, eq } from "drizzle-orm";
import { db } from "..";
import { IProduct } from "@/lib/types";
import { Favourite, favourites } from "../schema/favourites";
import { getProductById } from "./products";
import { auth } from "@/auth";

export interface FavouriteItemWithProduct extends Favourite {
  product?: IProduct;
  isLiked: boolean;
}

export const getFavouritesByUserId = async (): Promise<FavouriteItemWithProduct[]> => {
  const session = await auth();
  if (!session) return [];
  const userFavouritesProductId = await db.select().from(favourites).where(eq(favourites.userId, session?.user.id));

  if (!userFavouritesProductId) {
    return [];
  }

  const itemsWithProducts: FavouriteItemWithProduct[] = await Promise.all(
    userFavouritesProductId.map(async (item) => {
      const res = await getProductById(item.productId);
      return { ...item, product: res.product, isLiked: true };
    })
  );
  return itemsWithProducts;
};

export const getUserFavouriteCounts = async (): Promise<{ favouriteCounts?: number; error?: string } | null> => {
  try {
    const session = await auth();
    if (!session) return null;
    const [favouriteCounts] = await db.select({ count: count() }).from(favourites);

    return { favouriteCounts: favouriteCounts.count };
  } catch (error: any) {
    return {
      error: `Failed add to favourite`,
    };
  }
};

interface UserFavourites {
  userFavourites?: {
    id: string;
    productId: string;
  }[];
  favouriteCounts?: number;
  error?: string;
}
export const getUserFavourites = async (): Promise<UserFavourites | null> => {
  try {
    const session = await auth();
    if (!session) return null;

    const existingFavourite = await db
      .select({
        id: favourites.id,
        productId: favourites.productId,
      })
      .from(favourites)
      .where(eq(favourites.userId, session?.user.id));

    if (!existingFavourite) {
      return {
        error: "no favourites for this product",
      };
    }

    const [favouriteCounts] = await db.select({ count: count() }).from(favourites).where(eq(favourites.userId, session?.user.id));

    return { userFavourites: existingFavourite, favouriteCounts: favouriteCounts.count };
  } catch (error: any) {
    return {
      error: `Failed add to favourite`,
    };
  }
};

export const getUserFavouriteByProductId = async (productId: string) => {
  try {
    const session = await auth();
    if (!session) return null;

    const [existingFavourite] = await db
      .select({
        id: favourites.id,
        productId: favourites.productId,
      })
      .from(favourites)
      .where(and(eq(favourites.userId, session?.user.id), eq(favourites.productId, productId)));

    if (!existingFavourite) return null;

    return existingFavourite;
  } catch (error: any) {
    return null;
  }
};
