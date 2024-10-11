const baseUrl = process.env.NEXT_PUBLIC_ADMIN_URL!;

export const getColors = async () => {
  const url = new URL(`${baseUrl}/api/filter/colors`);
  try {
    const response = await fetch(url.toString());
    if (!response.ok) {
      return [];
    }
    const data = await response.json();

    return data.colorNames as string[];
  } catch (error) {
    console.log("Failed fetch colors variations: ", error);
    return [];
  }
};

export const getSizes = async () => {
  const url = new URL(`${baseUrl}/api/filter/sizes`);
  try {
    const response = await fetch(url.toString());
    if (!response.ok) {
      return [];
    }

    const data = await response.json();

    return data.sizeNames as string[];
  } catch (error) {
    console.error("Failed fetch sizes variations: ", error);
    return [];
  }
};

export const getCategories = async () => {
  const url = new URL(`${baseUrl}/api/filter/categories`);
  try {
    const response = await fetch(url.toString());
    if (!response.ok) {
      return [];
    }

    const data = await response.json();

    return data.categories as string[];
  } catch (error) {
    console.error("Failed fetch categories");
    return [];
  }
};
