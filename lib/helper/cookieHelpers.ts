import { cookies } from "next/dist/client/components/headers";

export const setCookie = (jwt: string, expirationTime: Date) => {
  cookies().set("guestCartId", jwt, {
    expires: expirationTime,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
};

export const resetCookie = (name: string) => {
  cookies().set(name, "");
};
