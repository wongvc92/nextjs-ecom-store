import React, { memo } from "react";
import EditQuantityModal from "./edit-quantity-modal";
import IncreaseCartCounter from "./increase-cart-counter";
import DecreaseCartCounter from "./decrease-cart-counter";

const CartCounter = () => {
  return (
    <div className="flex border rounded-sm w-fit">
      <DecreaseCartCounter />
      <EditQuantityModal />
      <IncreaseCartCounter />
    </div>
  );
};

export default memo(CartCounter);
