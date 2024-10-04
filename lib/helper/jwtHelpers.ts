import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/dist/client/components/headers";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export const createJWT = async (newCartId: string, expirationTime: Date) => {
  const jwt = await new SignJWT({ cartId: newCartId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(Math.floor(expirationTime.getTime() / 1000))
    .sign(secret);

  return jwt;
};


export const verifyJWT = async (jwt: string) => {
  const { payload } = await jwtVerify(jwt, secret);
  return payload;
};

export const getJWT = (name: string) => {
  const jwt = cookies().get(name)?.value;
  return jwt;
};
