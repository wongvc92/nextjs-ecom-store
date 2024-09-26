import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { IProduct } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalizeFirstChar(letter: string): string {
  if (!letter) return "";
  return letter.charAt(0).toUpperCase() + letter.slice(1).toLowerCase();
}

export function capitalizeSentenceFirstChar(sentence: string): string {
  if (!sentence) return "";
  return sentence
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export const convertCentsToTwoDecimal = (priceInCents: number): string => {
  return (priceInCents / 100).toFixed(2);
};

export const currencyFormatter = (priceInCents: number): string => {
  return `RM ${convertCentsToTwoDecimal(priceInCents)}`;
};

export const getMinMaxPrices = (product: IProduct): string => {
  let minPrice = Infinity;
  let maxPrice = -Infinity;
  if (product?.variationType === "NESTED_VARIATION") {
    product?.variations.forEach((variationItem) => {
      variationItem.nestedVariations.forEach((nested) => {
        const price = nested.priceInCents!;
        if (price < minPrice) minPrice = price;
        if (price > maxPrice) maxPrice = price;
      });
    });
    return `${currencyFormatter(minPrice)} -${currencyFormatter(maxPrice)}`;
  } else if (product?.variationType === "VARIATION") {
    product?.variations.forEach((variationItem) => {
      const price = variationItem.priceInCents!;
      if (price < minPrice) minPrice = price;
      if (price > maxPrice) maxPrice = price;
    });
    return `${currencyFormatter(minPrice)} -${currencyFormatter(maxPrice)}`;
  } else if (product?.variationType === "NONE") {
    return `${currencyFormatter(product?.priceInCents)}`;
  }
  return "0";
};

export const addSearchParams = (url: URL, searchParams: Record<string, any>) => {
  Object.entries(searchParams).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => url.searchParams.append(key, String(item)));
    } else if (value !== null && value !== undefined && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });
};

export const convertCentsToTwoDecimalNumber = (priceInCents: number): number => {
  return priceInCents / 100;
};

export const convertCentsToTwoDecimalString = (priceInCents: number): string => {
  if (!priceInCents) return "0";
  return (priceInCents / 100).toFixed(2);
};
