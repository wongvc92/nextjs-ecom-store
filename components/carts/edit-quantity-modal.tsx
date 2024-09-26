"use client";

import { updateCartQuantity } from "@/actions/cart";
import { Button } from "@/components/ui/button";
import { DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useRef, useTransition } from "react";
import { toast } from "sonner";
import { useCartItemContext } from "../../providers/cart.item.provider";
import { useCartContext } from "../../providers/cart.provider";
import { useModal } from "@/providers/modal.provider";
import { CartItemWithProduct } from "@/lib/db/queries/carts";
import Modal from "../ui/modal";

interface EditQuantityModalProps {
  cartItem?: CartItemWithProduct;
}

const EditQuantityModal: React.FC<EditQuantityModalProps> = () => {
  const newQuantityRef = useRef<HTMLInputElement>(null);
  const { dispatch } = useCartContext();
  const [isPending, startTransition] = useTransition();
  const { closeModal, openModal } = useModal();
  const { cartItem } = useCartItemContext();

  const handleUpdateCarttQuantity = async () => {
    if (newQuantityRef.current === null) return;
    if (!cartItem) return;

    dispatch({
      type: "UPDATE_CART_QUANTITY",
      payload: {
        ...cartItem,
        id: cartItem.id,
        product: cartItem.product,
        productId: cartItem.productId,
        quantity: cartItem.quantity,
        variationType: cartItem.variationType,
        variationId: cartItem.variationId,
        nestedVariationId: cartItem.nestedVariationId,
      },
    });
    closeModal();
    const formData = new FormData();
    formData.append("id", cartItem.id);
    formData.append("newQuantity", newQuantityRef.current.value);
    const res = await updateCartQuantity(formData);
    if (res?.error) {
      toast.error(res.error);
    }
    newQuantityRef.current.value = "";
  };

  return (
    <>
      <div
        className="flex justify-center items-center border-l border-r h-full px-2 text-muted-foreground text-xs cursor-pointer"
        onClick={() => {
          openModal("editQuantityModal");
        }}
      >
        {cartItem?.quantity}
      </div>
      <Modal modalName="editQuantityModal">
        <DialogHeader>
          <DialogTitle className="text-left">Edit quantity</DialogTitle>
        </DialogHeader>
        <form action={handleUpdateCarttQuantity} className="space-y-4">
          <Input type="number" ref={newQuantityRef} required />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="destructive" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              Confirm
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};
export default EditQuantityModal;
