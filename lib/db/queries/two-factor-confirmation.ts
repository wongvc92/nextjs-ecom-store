import { eq } from "drizzle-orm";
import { db } from "..";
import { TwoFactorConfirmation, twoFactorConfirmations } from "../schema/users";

export const getTwoFactorConfirmationByUserId = async (userId: string): Promise<TwoFactorConfirmation | null> => {
  try {
    const [twoFactorConfirmation] = await db.select().from(twoFactorConfirmations).where(eq(twoFactorConfirmations.userId, userId));
    return twoFactorConfirmation;
  } catch (error) {
    return null;
  }
};
