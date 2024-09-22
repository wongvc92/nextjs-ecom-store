"use client";

import CartCard from "./cart-card";
import { useCartContext } from "./cart.context";

const CartList = () => {
  const { cartItems } = useCartContext();
  return (
    <div className="flex flex-col gap-2 p-2 w-full">
      <h4 className="font-bold">Cart items</h4>
      {cartItems && cartItems.length > 0 && cartItems.map((cartItem) => <CartCard key={cartItem.id} cartItem={cartItem} />)}
    </div>
  );
};

export default CartList;
