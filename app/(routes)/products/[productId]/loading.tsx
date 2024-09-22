import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const Loading = () => {
  return (
    <div className="min-h-screen w-full md:container py-10">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="w-full h-[600px] flex flex-col gap-4">
          <Skeleton className="h-[400px]  rounded-md  "></Skeleton>
          <div className="grid grid-cols-5 gap-2 h-[200px]">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="w-full aspect-square rounded-md  "></Skeleton>
            ))}
          </div>
        </div>
        <div className="w-full h-[600px] rounded-md">
          <div className="flex flex-col gap-8 px-4 ">
            <div className="space-y-2 relative">
              <Skeleton className="h-10 w-[200px]"></Skeleton>
              <Skeleton className="h-5 w-[100px]"></Skeleton>
              <Skeleton className="h-5 w-[150px]"></Skeleton>
              <div className="absolute top-0 right-0 items-baseline">
                <Skeleton className="h-8 w-8 rounded-full"></Skeleton>
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-10 w-[200px] rounded-full"></Skeleton>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-5 w-full"></Skeleton>
              <Skeleton className="h-5 w-full"></Skeleton>
              <Skeleton className="h-5 w-full"></Skeleton>
              <Skeleton className="h-5 w-[200px]"></Skeleton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
