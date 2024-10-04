import React, { Suspense } from "react";
import MaxWrapper from "@/components/max-wrapper";
import FavouriteList from "./components/favourite-list";
import { Metadata } from "next";
import CardListLoading from "@/components/loading/card-list-loading";

export const metadata: Metadata = {
  title: "Favourites",
  description: "View and manage your favorite products. Explore the items you love and easily access them anytime.",
};

export const dynamic = "force-dynamic";

const FavouritePage = () => {
  return (
    <MaxWrapper className="min-h-screen w-full md:container px-4 py-10">
      <Suspense fallback={<CardListLoading />}>
        <FavouriteList />
      </Suspense>
    </MaxWrapper>
  );
};

export default FavouritePage;
