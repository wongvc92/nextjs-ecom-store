import React, { Suspense } from "react";
import Favourite from "./components/favourite";

import Loading from "./loading";

const FavouritePage = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Favourite />
    </Suspense>
  );
};

export default FavouritePage;
