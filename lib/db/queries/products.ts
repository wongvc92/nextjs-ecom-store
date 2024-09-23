import { addSearchParams } from "@/lib/utils";
import { IProductsQuery, productsQuerySchema } from "@/lib/validation/productSchemas";
import { validate as isUuid } from "uuid";

const BASE_URL = process.env.NEXT_PUBLIC_ADMIN_URL!;

export const getProductIds = async (): Promise<{ id: string }[] | []> => {
  const url = new URL(`${BASE_URL}/api/productsId`);
  try {
    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error("failed fetch productIds, please try again later");
    }
    const data = await response.json();

    if (!data.productsId || !Array.isArray(data.productsId)) {
      console.error("Unexpected response format:", data);
      return [];
    }

    return data.productsId;
  } catch (error) {
    return [];
  }
};
export async function getProducts(searchParams: IProductsQuery) {
  const parseResult = productsQuerySchema.safeParse(searchParams);
  if (!parseResult.success) {
    // Handle validation errors
    const errors = parseResult.error.errors.map((err) => `${err.path.join(".")} - ${err.message}`);

    return { error: `Invalid search parameters: ${errors.join("; ")}` };
  }

  let url = new URL(`${BASE_URL}/api/products`);

  addSearchParams(url, searchParams);

  try {
    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`Fetch error: ${response.statusText}`);
    }

    const data = await response.json();

    return { products: data.products, productCounts: data.productCounts, perPage: data.perPage };
  } catch (error) {
    return { error: "Failed fetch products" };
  }
}

export const getFeaturedProduct = async () => {
  const url = `${BASE_URL}/api/products/featured`;

  try {
    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`Fetch error: ${response.statusText}`);
    }

    const data = await response.json();

    return { featuredProducts: data.featuredProducts };
  } catch (error) {
    return { error: "Failed fetch product" };
  }
};

export const getProductById = async (productId: string) => {
  if (!isUuid(productId)) {
    return {
      error: "Invalid product Id",
    };
  }

  const url = new URL(`${BASE_URL}/api/products/${encodeURIComponent(productId)}`);

  try {
    const response = await fetch(url.toString(), { cache: "force-cache" });
    if (!response.ok) {
      throw new Error(`Fetch error: ${response.statusText}`);
    }

    const data = await response.json();

    return { product: data.product };
  } catch (error) {
    return { error: "Failed fetch product" };
  }
};
