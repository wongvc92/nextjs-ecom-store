"use server";

import { auth } from "@/auth";
import { getUserFavouriteByProductId } from "@/lib/db/queries/favourites";
import { createFavourite, removeFavourite } from "@/lib/services/favouriteServices";
import { favouriteSchema } from "@/lib/validation/favouriteSchemas";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export const switchFavourite = async (formData: FormData) => {
  const session = await auth();
  if (!session) {
    redirect("/auth/sign-in");
  }
  const validatedData = favouriteSchema.safeParse(Object.fromEntries(formData));

  if (!validatedData.success) {
    const textError = validatedData.error.flatten().fieldErrors;
    return {
      error: `validate failed,${textError}`,
    };
  }

  const { productId, variationType } = validatedData.data;
  
  try {
    const existingFavourite = await getUserFavouriteByProductId(productId, session.user.id);

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
