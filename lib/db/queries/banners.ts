const baseUrl = process.env.NEXT_PUBLIC_ADMIN_URL!;

export async function getBanners() {
  try {
    const url = `${baseUrl}/api/banners`;

    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("Failed fetch banner images");
    }
    const data = await res.json();

    return {
      bannerImages: data.bannerImages,
    };
  } catch (error) {
    throw new Error("Failed fetch banner images");
  }
}
