import { Skeleton } from "@/components/ui/skeleton";

const OrderPageLoading = () => {
  return (
    <div className="flex flex-col md:flex-row gap-8 px-4">
      <div className="w-full md:w-2/3 space-y-8">
        <div>
          <Skeleton className="w-1/3 h-6 mb-4" />
          <Skeleton className="w-full h-8" />
        </div>
        <div>
          <Skeleton className="w-1/3 h-6 mb-4" />
          <Skeleton className="w-full h-20" />
        </div>
        <div>
          <Skeleton className="w-1/3 h-6 mb-4" />
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Skeleton className="w-4 h-4 rounded-full" />
              <div className="w-full">
                <Skeleton className="w-1/3 h-4 mb-1" />
                <Skeleton className="w-1/2 h-4" />
              </div>
            </div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-2">
                <Skeleton className="w-4 h-4 rounded-full" />
                <div className="w-full">
                  <Skeleton className="w-1/3 h-4 mb-1" />
                  <Skeleton className="w-1/2 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full md:w-1/3 space-y-8">
        <div className="text-center">
          <Skeleton className="w-2/3 h-6 mx-auto mb-6" />
        </div>
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex space-x-3 items-start">
              <Skeleton className="w-6 h-6 rounded-full" />
              <div className="w-full">
                <Skeleton className="w-2/3 h-4 mb-2" />
                <Skeleton className="w-full h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderPageLoading;
