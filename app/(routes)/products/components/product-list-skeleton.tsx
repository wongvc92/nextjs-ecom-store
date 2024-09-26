import { Skeleton } from "@/components/ui/skeleton";

const ProductListSkeleton = () => {
  return (
    <div className="min-h-screen w-full px-4 md:container ">
      <div className="flex gap-4 h-10 mb-10 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i}>
            <Skeleton className="rounded-md w-[100px] h-10"></Skeleton>
          </div>
        ))}
      </div>
      <div className="flex gap-4">
        <div className="hidden md:flex md:flex-col min-h-screen w-[300px] gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-4">
              <Skeleton className="w-full  rounded-md h-10"></Skeleton>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-4">
              <Skeleton className="w-full rounded-md aspect-square"></Skeleton>
              <Skeleton className="h-5  w-[200px] rounded-md"></Skeleton>
              <Skeleton className="h-5  w-[100px] rounded-md"></Skeleton>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductListSkeleton;
