"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useModal } from "@/providers/modal.provider";

const Modal = ({ children, modalName }: { children: React.ReactNode; modalName: string }) => {
  const { closeModal, isOpen } = useModal();
  return (
    <Dialog open={isOpen === modalName} onOpenChange={closeModal}>
      <DialogContent>
        <div>{children}</div>
      </DialogContent>
    </Dialog>
  );
};
export default Modal;
