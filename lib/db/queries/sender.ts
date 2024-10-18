import { Sender } from "@/lib/types";

const BASE_URL = process.env.NEXT_PUBLIC_ADMIN_URL!;

export const getSender = async (): Promise<Sender | null> => {
  const url = new URL(`${BASE_URL}/api/sender`);
  try {
    const res = await fetch(url);
    if (!res.ok) {
      const error = await res.json();
      console.log("Failed fetch sender: ", `${res.status} - ${res.statusText}`, error);
      return null;
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.log("Failed fetch sender: ", error);
    return null;
  }
};
