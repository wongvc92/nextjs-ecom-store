const baseUrl = process.env.NEXT_PUBLIC_ADMIN_URL!;

export const getColors = async () => {
  const url = `${baseUrl}/api/filter/colors`;
  try {
    const response = await fetch(url, { cache: "force-cache" });
    if (!response.ok) {
      throw new Error("Failed fetch colors variations from server");
    }
    const { colorNames } = await response.json();

    return colorNames;
  } catch (error) {
    return {
      error: "Failed fetch colors variations",
    };
  }
};

export const getSizes = async () => {
  const url = `${baseUrl}/api/filter/sizes`;
  try {
    const response = await fetch(url, { cache: "force-cache" });
    if (!response.ok) {
      throw new Error("Failed fetch colors variations from server");
    }
    const { sizeNames } = await response.json();

    return sizeNames;
  } catch (error) {
    return {
      error: "Failed fetch colors variations",
    };
  }
};

export const getCategories = async () => {
  const url = `${baseUrl}/api/filter/categories`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed fetch colors variations from server");
    }

    const { categories } = await response.json();

    return categories;
  } catch (error) {
    return {
      error: "Failed fetch colors variations",
    };
  }
};
