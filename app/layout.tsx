import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { ProductFilterProvider } from "@/providers/product.filter.provider";
import { FavouriteProvider } from "@/providers/favourite.provider";
import Footer from "@/components/footer";
import { CartProvider } from "@/providers/cart.provider";
import { getFavouritesByUserId } from "@/lib/db/queries/favourites";
import { getCategories, getColors, getSizes } from "@/lib/db/queries/filters";
import { Toaster } from "sonner";
import { getCart } from "@/lib/db/queries/carts";
import { SessionProvider } from "next-auth/react";
import { ModalProvider } from "@/providers/modal.provider";
import { auth } from "@/auth";
import { unstable_cache } from "next/cache";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Shop the Best Products | Ecom Store",
  description:
    "Explore a wide variety of top-quality products at unbeatable prices. Shop the latest trends in various category and enjoy fast shipping and great customer service.",
  keywords: "ecommerce, online store, buy products, best prices, fast shipping",
};

const getCachedFavouritesByUserId = unstable_cache(
  async (userId: string) => {
    return await getFavouritesByUserId(userId);
  },
  ["favourites"],
  {
    tags: ["favourites"],
  }
);

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const categories = await getCategories();
  const sizes = await getSizes();
  const colors = await getColors();
  const favouriteProducts = (await getCachedFavouritesByUserId(session?.user.id as string)) ?? [];
  const cart = await getCart();

  return (
    <html lang="en">
      <body className={inter.className}>
        <ModalProvider>
          <ThemeProvider attribute="class" defaultTheme="system">
            <SessionProvider>
              <Toaster richColors position="top-center" />
              <FavouriteProvider value={favouriteProducts}>
                <CartProvider cart={cart}>
                  <ProductFilterProvider value={{ categories, sizes, colors }}>
                    <Navbar />
                    <div className="min-h-screen">{children}</div>
                    <Footer />
                  </ProductFilterProvider>
                </CartProvider>
              </FavouriteProvider>
            </SessionProvider>
          </ThemeProvider>
        </ModalProvider>
      </body>
    </html>
  );
}
