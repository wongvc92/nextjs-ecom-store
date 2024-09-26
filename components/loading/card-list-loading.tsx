import React from "react";
import { Skeleton } from "../ui/skeleton";

const CardListLoading = () => {
  const rows = Array.from({ length: 12 });
  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
      {rows.map((_, i) => (
        <Skeleton key={i} className="aspect-square"></Skeleton>
      ))}
    </div>
  );
};

export default CardListLoading;
