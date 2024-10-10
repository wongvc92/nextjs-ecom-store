import { IbannerImage } from "@/lib/types";

const baseUrl = process.env.NEXT_PUBLIC_ADMIN_URL!;

export const getBanners = async (): Promise<IbannerImage[] | null> => {
  const url = new URL(`${baseUrl}/api/banners`);
  try {
    const res = await fetch(url.toString(), {
      next: { tags: ["banners"], revalidate: false },
    });

    if (!res.ok) {
      return null;
    }
    const data = await res.json();

    return data.bannerImages;
  } catch (error) {
    console.error("Failed fetch banner images");
    return null;
  }
};
