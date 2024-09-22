import React from "react";
import FavouriteList from "./favourite-list";
import MaxWrapper from "@/components/max-wrapper";

const Favourite = () => {
  return (
    <MaxWrapper className="min-h-screen w-full md:container px-4 py-10">
      <FavouriteList />
    </MaxWrapper>
  );
};

export default Favourite;
