import { and, eq } from "drizzle-orm";
import { db } from "..";
import { IProduct } from "@/lib/types";
import { Favourite, favourites } from "../schema/favourites";
import { getProductById } from "./products";
import { removeFavourite } from "@/lib/services/favouriteServices";

export interface FavouriteItemWithProduct extends Favourite {
  product?: IProduct;
  isLiked: boolean;
}

export const getFavouritesByUserId = async (userId: string): Promise<FavouriteItemWithProduct[] | null> => {
  if (!userId) return null;

  const userFavouritesProductId = await db.select().from(favourites).where(eq(favourites.userId, userId));

  if (!userFavouritesProductId) {
    return null;
  }
  let itemsWithProducts: FavouriteItemWithProduct[] | null;
  try {
    itemsWithProducts = await Promise.all(
      userFavouritesProductId.map(async (item) => {
        const product = await getProductById(item.productId);
        return { ...item, product: (product as IProduct) || null, isLiked: true };
      })
    );

    const itemWithNullProducts = itemsWithProducts.filter((item) => item.product === null);
    const itemWithOutNullProducts = itemsWithProducts.filter((item) => item.product !== null);
    for (const item of itemWithNullProducts) {
      await removeFavourite(item.id);
    }
    return itemWithOutNullProducts;
  } catch (error) {
    console.error("Failed get favourites by user Id: ", error);
    return null;
  }
};

// export const getUserFavouriteCounts = unstable_cache(
//   async (): Promise<{ favouriteCounts?: number; error?: string } | null> => {
//     try {
//       const session = await auth();
//       if (!session) return null;
//       const [favouriteCounts] = await db.select({ count: count() }).from(favourites);

//       return { favouriteCounts: favouriteCounts.count };
//     } catch (error: any) {
//       return {
//         error: `Failed add to favourite`,
//       };
//     }
//   },
//   ["favourites"],
//   { tags: ["favourites"] }
// );

// interface UserFavourites {
//   userFavourites?: {
//     id: string;
//     productId: string;
//   }[];
//   favouriteCounts?: number;
//   error?: string;
// }
// export const getUserFavourites = async (): Promise<UserFavourites | null> => {
//   try {
//     const session = await auth();
//     if (!session) return null;

//     const existingFavourite = await db
//       .select({
//         id: favourites.id,
//         productId: favourites.productId,
//       })
//       .from(favourites)
//       .where(eq(favourites.userId, session?.user.id));

//     if (!existingFavourite) {
//       return {
//         error: "no favourites for this product",
//       };
//     }

//     const [favouriteCounts] = await db.select({ count: count() }).from(favourites).where(eq(favourites.userId, session?.user.id));

//     return { userFavourites: existingFavourite, favouriteCounts: favouriteCounts.count };
//   } catch (error: any) {
//     return {
//       error: `Failed add to favourite`,
//     };
//   }
// };

export const getUserFavouriteByProductId = async (productId: string, userId: string) => {
  try {
    const [existingFavourite] = await db
      .select({
        id: favourites.id,
        productId: favourites.productId,
      })
      .from(favourites)
      .where(and(eq(favourites.userId, userId), eq(favourites.productId, productId)));

    if (!existingFavourite) return null;

    return existingFavourite;
  } catch (error: any) {
    console.error("Failed get User Favourite By ProductId: ", error);
    return null;
  }
};
