import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const Loading = () => {
  return (
    <div className="min-h-screen w-full md:container py-10">
      <div className="flex flex-col gap-10">
        <div>
          <Skeleton className="w-full h-[200px] md:h-[400px]"></Skeleton>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center px-4">
            <Skeleton className="h-5 w-[200px]"></Skeleton>
            <div className="flex items-center justify-between gap-4">
              <Skeleton className="h-8 w-8 rounded-full"></Skeleton>
              <Skeleton className="h-8 w-8 rounded-full"></Skeleton>
            </div>
          </div>
          <div className="flex  overflow-hidden pl-4 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-2">
                <Skeleton className="w-[300px] aspect-square"></Skeleton>
                <Skeleton className="h-5 w-[200px]"></Skeleton>
                <Skeleton className="h-5 w-[100px]"></Skeleton>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center px-4">
            <Skeleton className="h-5 w-[200px]"></Skeleton>
            <div className="flex items-center justify-between gap-4">
              <Skeleton className="h-8 w-8 rounded-full"></Skeleton>
              <Skeleton className="h-8 w-8 rounded-full"></Skeleton>
            </div>
          </div>
          <div className="flex  overflow-hidden pl-4 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-2">
                <Skeleton className="w-[300px] aspect-square"></Skeleton>
                <Skeleton className="h-5 w-[200px]"></Skeleton>
                <Skeleton className="h-5 w-[100px]"></Skeleton>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center px-4">
            <Skeleton className="h-5 w-[200px]"></Skeleton>
            <div className="flex items-center justify-between gap-4">
              <Skeleton className="h-8 w-8 rounded-full"></Skeleton>
              <Skeleton className="h-8 w-8 rounded-full"></Skeleton>
            </div>
          </div>
          <div className="flex  overflow-hidden pl-4 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-2">
                <Skeleton className="w-[300px] aspect-square"></Skeleton>
                <Skeleton className="h-5 w-[200px]"></Skeleton>
                <Skeleton className="h-5 w-[100px]"></Skeleton>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
