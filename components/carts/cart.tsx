"use client";

import CartList from "./cart-list";
import NoCart from "./no-cart";
import { useCartContext } from "./cart.context";

const Cart = () => {
  const { cartItems } = useCartContext();

  return (
    <>
      {!cartItems || cartItems.length === 0 ? (
        <NoCart />
      ) : (
        <div className={"flex flex-col max-w-3xl mx-auto"}>
          This is a test branch
          <CartList />
        </div>
      )}
    </>
  );
};

export default Cart;
