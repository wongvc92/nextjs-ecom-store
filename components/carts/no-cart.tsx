import { Frown, ShoppingBag } from "lucide-react";

const NoCart = () => {
  return (
    <div className="min-h-screen  mx-auto">
      <div className=" flex justify-center items-center py-10">
        <div className="flex flex-col justify-center items-center gap-4 border w-[600px] h-[500px] rounded-md">
          <div className="relative">
            <ShoppingBag className="w-20 h-20" />
            <div className="absolute -top-1 -right-1 p-2 rounded-full w-5 h-5 flex justify-center items-center bg-black text-white z-10">0</div>
          </div>
          <p className="flex items-center gap-2">
            Your cart is empty <Frown />
          </p>
          <p className="text-sm text-muted-foreground">You have no items in your shopping cart</p>
        </div>
      </div>
    </div>
  );
};

export default NoCart;
