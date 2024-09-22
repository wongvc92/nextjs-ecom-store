import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const Loading = () => {
  return (
    <div className="min-h-screen w-full px-4 md:max-w-3xl mx-auto py-10">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="grid gap-10 w-full">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="grid grid-cols-3  h-[100px] md:h-[200px] rounded-md gap-4">
              <Skeleton className=" aspect-square rounded-md w-full h-[100ox]  md:h-full "></Skeleton>
              <div className="space-y-2 px-4">
                <Skeleton className="h-5 rounded-md"></Skeleton>
                <Skeleton className="h-5 rounded-md"></Skeleton>
                <Skeleton className="h-5  rounded-md"></Skeleton>
                <Skeleton className="h-5 rounded-md"></Skeleton>
              </div>
              <div className="flex flex-col justify-between items-end">
                <Skeleton className="h-5 rounded-md w-20"></Skeleton>
                <Skeleton className="h-5  rounded-md  w-20"></Skeleton>
              </div>
            </div>
          ))}
        </div>
        <div className="hidden md:block h-[400px] w-[500px] space-y-4">
          <Skeleton className="h-10  rounded-md w-[200px]"></Skeleton>
          <div className="flex justify-between gap-4">
            <Skeleton className="h-5 w-full  rounded-md "></Skeleton>
            <Skeleton className="h-5 w-[100px] rounded-md"></Skeleton>
          </div>
          <div className="flex justify-between gap-4">
            <Skeleton className="h-5 w-full  rounded-md "></Skeleton>
            <Skeleton className="h-5 w-[100px] rounded-md"></Skeleton>
          </div>
          <div className="flex justify-between gap-4">
            <Skeleton className="h-5 w-full rounded-md "></Skeleton>
            <Skeleton className="h-5 w-[100px]  rounded-md"></Skeleton>
          </div>
          <Skeleton className="h-10 w-full  rounded-md "> </Skeleton>
        </div>
      </div>
    </div>
  );
};

export default Loading;
