import { Boxes, Frown, ShoppingBag, SmileIcon } from "lucide-react";

const NoProducts = () => {
  return (
    <div className="min-h-screen mx-auto px-4">
      <div className=" flex justify-center items-center py-10">
        <div className="flex flex-col justify-center items-center gap-4 border w-[600px] h-[500px] rounded-md">
          <div className="relative">
            <Boxes className="w-20 h-20" />
            <div className="absolute -top-1 -right-1 p-2 rounded-full w-5 h-5 flex justify-center items-center bg-black text-white z-10">0</div>
          </div>
          <p className="flex items-center gap-2">
            Stay tuned! <SmileIcon />
          </p>
          <p className="text-sm text-muted-foreground"> Exciting products coming soon!</p>
        </div>
      </div>
    </div>
  );
};

export default NoProducts;
