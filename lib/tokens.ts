import { v4 as uuidv4 } from "uuid";
import { getVerificationTokenByEmail } from "./db/queries/verification-token";
import { db } from "./db";
import { PasswordResetToken, passwordResetTokens, TwoFactorToken, twoFactorTokens, VerificationToken, verificationTokens } from "./db/schema/users";
import { eq } from "drizzle-orm";
import { getPasswordResetTokenByEmail, getTwoFactorTokenByEmail } from "./db/queries/auth";
import crypto from "crypto";

export const generateVerificationToken = async (email: string): Promise<VerificationToken> => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getVerificationTokenByEmail(email);
  if (existingToken) {
    await db.delete(verificationTokens).where(eq(verificationTokens.id, existingToken.id));
  }

  const [verificationToken] = await db.insert(verificationTokens).values({ token, email, expires }).returning();

  return verificationToken;
};

export const generatePasswordResetToken = async (email: string): Promise<PasswordResetToken> => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);
  const existingToken = await getPasswordResetTokenByEmail(email);
  if (existingToken) {
    await db.delete(passwordResetTokens).where(eq(passwordResetTokens.id, existingToken.id));
  }
  const [passwordResetToken] = await db.insert(passwordResetTokens).values({ token, email, expires }).returning();
  return passwordResetToken;
};

export const generateTwoFactorToken = async (email: string): Promise<TwoFactorToken> => {
  const token = crypto.randomInt(100_00, 1_000_000).toString();
  const expires = new Date(new Date().getTime() + 5 * 60 * 1000); //5 minutes
  const existingToken = await getTwoFactorTokenByEmail(email);
  if (existingToken) {
    await db.delete(twoFactorTokens).where(eq(twoFactorTokens.id, existingToken.id));
  }

  const [towFactorToken] = await db
    .insert(twoFactorTokens)
    .values({
      email,
      token,
      expires,
    })
    .returning();

  return towFactorToken;
};
