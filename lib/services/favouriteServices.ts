import { eq } from "drizzle-orm";
import { db } from "../db";
import { favourites as favouritesTable } from "../db/schema/favourites";

export const removeFavourite = async (favouriteId: string) => {
  try {
    await db.delete(favouritesTable).where(eq(favouritesTable.id, favouriteId));
    return {
      success: "Removed from favourite",
    };
  } catch (error) {
    return {
      error: "Failed remove favourite",
    };
  }
};

export const createFavourite = async (productId: string, variationType: string, userId: string) => {
  try {
    await db.insert(favouritesTable).values({
      productId,
      variationType,
      userId,
    });
    return {
      success: "Added to favourite",
    };
  } catch (error) {
    return {
      error: "Failed add favourite",
    };
  }
};
