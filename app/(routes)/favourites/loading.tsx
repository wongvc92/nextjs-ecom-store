import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const Loading = () => {
  return (
    <div className="min-h-screen w-full px-4 md:container py-10">
      <div className="w-full h-[600px] flex flex-col gap-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 h-[200px]">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-4">
              <Skeleton className="w-full  aspect-square rounded-md  "></Skeleton>
              <Skeleton className="h-5 w-[300px]"></Skeleton>
              <Skeleton className="h-5 w-[100px]"></Skeleton>
              <Skeleton className="h-10 w-full rounded-full"></Skeleton>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loading;
