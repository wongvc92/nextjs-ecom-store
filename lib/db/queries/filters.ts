import { cache } from "react";

const baseUrl = process.env.NEXT_PUBLIC_ADMIN_URL!;

export const getColors = cache(async () => {
  const url = new URL(`${baseUrl}/api/filter/colors`);
  try {
    const response = await fetch(url, { cache: "force-cache" });
    if (!response.ok) {
      return [];
    }
    const { colorNames } = await response.json();

    return colorNames as string[];
  } catch (error) {
    console.error("Failed fetch colors variations: ", error);
    return [];
  }
});

export const getSizes = cache(async () => {
  const url = new URL(`${baseUrl}/api/filter/sizes`);
  try {
    const response = await fetch(url, { cache: "force-cache" });
    if (!response.ok) {
      return [];
    }

    const { sizeNames } = await response.json();

    return sizeNames as string[];
  } catch (error) {
    console.error("Failed fetch sizes variations: ", error);
    return [];
  }
});

export const getCategories = cache(async () => {
  const url = new URL(`${baseUrl}/api/filter/categories`);
  try {
    const response = await fetch(url.toString(), {
      cache: "force-cache",
    });
    if (!response.ok) {
      return [];
    }

    const { categories } = await response.json();

    return categories as string[];
  } catch (error) {
    console.error("Failed fetch categories");
    return [];
  }
});
