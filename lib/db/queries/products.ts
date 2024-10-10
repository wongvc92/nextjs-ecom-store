import { IProduct } from "@/lib/types";
import { addSearchParams } from "@/lib/utils";
import { IProductsQuery, productsQuerySchema } from "@/lib/validation/productSchemas";
import { validate as isUuid } from "uuid";

const BASE_URL = process.env.NEXT_PUBLIC_ADMIN_URL!;

export const getProductIds = async (): Promise<{ id: string }[] | []> => {
  const url = new URL(`${BASE_URL}/api/productsId`);
  try {
    const response = await fetch(url.toString());
    if (!response.ok) {
      return [];
    }
    const data = await response.json();

    if (!data) {
      console.error("Unexpected response format:", data);
      return [];
    }

    return data;
  } catch (error) {
    console.error("failed fetch product ids:", error);
    return [];
  }
};

export const getProducts = async (searchParams: IProductsQuery): Promise<{ products: IProduct[]; productCounts: number; perPage: number }> => {
  const parseResult = productsQuerySchema.safeParse(searchParams);
  if (!parseResult.success) {
    // Handle validation errors
    const errors = parseResult.error.errors.map((err) => `${err.path.join(".")} - ${err.message}`);
    console.error(errors);
    return {
      products: [],
      productCounts: 0,
      perPage: 0,
    };
  }

  let url = new URL(`${BASE_URL}/api/products`);

  addSearchParams(url, searchParams);

  try {
    const response = await fetch(url.toString(), { cache: "no-store" });

    if (!response.ok) {
      console.error(`Fetch error: ${response.statusText}`);
      return {
        products: [],
        productCounts: 0,
        perPage: 0,
      };
    }

    const data = await response.json();

    return { products: data.products as IProduct[], productCounts: data.productCounts, perPage: data.perPage };
  } catch (error) {
    console.error("Failed fetch products :", error);
    return {
      products: [],
      productCounts: 0,
      perPage: 0,
    };
  }
};

export const getFeaturedProduct = async () => {
  const url = new URL(`${BASE_URL}/api/products/featured`);

  try {
    const response = await fetch(url.toString(), {
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error(`Fetch error: ${response.statusText}`);
    }

    const data = await response.json();

    return { featuredProducts: data.featuredProducts };
  } catch (error) {
    console.error("Failed fetch featured products :", error);
    return { error: "Failed fetch featured products" };
  }
};

export const getProductById = async (productId: string): Promise<IProduct | null> => {
  if (!isUuid(productId)) {
    console.error("Invalid product Id");
    return null;
  }

  const url = new URL(`${BASE_URL}/api/products/${encodeURIComponent(productId)}`);

  try {
    const response = await fetch(url.toString());
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Fetch Error]: Failed to fetch product (${response.status} - ${response.statusText}): ${errorText}`);
      return null;
    }

    const data = await response.json();

    return data.product;
  } catch (error) {
    console.error("Failed  to fetch product by Id: ", error);
    return null;
  }
};
