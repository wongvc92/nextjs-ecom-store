"use server";

import { auth } from "@/auth";
import { getUserFavouriteByProductId } from "@/lib/db/queries/favourites";
import { createFavourite, removeFavourite } from "@/lib/favourite/favouriteHelpers";
import { favouriteSchema } from "@/lib/validation/favouriteSchemas";

import { revalidateTag } from "next/cache";

export const switchFavourite = async (formData: FormData) => {
  try {
    const session = await auth();
    if (!session) {
      return null;
    }
    const validatedData = favouriteSchema.safeParse(Object.fromEntries(formData));

    if (!validatedData.success) {
      const textError = validatedData.error.flatten().fieldErrors;
      return {
        error: `validate failed,${textError}`,
      };
    }

    const { productId, variationType } = validatedData.data;

    const existingFavourite = await getUserFavouriteByProductId(productId);

    if (!existingFavourite) {
      await createFavourite(productId, variationType, session?.user.id);
    } else {
      await removeFavourite(existingFavourite.id);
    }
  } catch (error: any) {
    return {
      error: `Failed delete favourite`,
    };
  } finally {
    revalidateTag("favourites");
  }
};
