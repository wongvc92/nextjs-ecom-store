import { eq } from "drizzle-orm";
import { db } from "..";
import { verificationTokens } from "../schema/users";

export const getVerificationTokenByToken = async (token: string) => {
  try {
    const [verificationToken] = await db.select().from(verificationTokens).where(eq(verificationTokens.token, token));
    return verificationToken;
  } catch (error) {
    return null;
  }
};

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const [verificationToken] = await db.select().from(verificationTokens).where(eq(verificationTokens.email, email));
    return verificationToken;
  } catch (error) {
    return null;
  }
};
