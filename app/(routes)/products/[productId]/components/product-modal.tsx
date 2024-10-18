"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { IProduct } from "@/lib/types";
import { currencyFormatter, getMinMaxPrices } from "@/lib/utils";
import { useEffect, useState } from "react";

interface ProductModal {
  title: string;
  product: IProduct;
  description?: string;
  children?: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModal> = ({ title, product, description, isOpen, children, onClose }) => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  //not render any modal in server side
  if (!isMounted) {
    return null;
  }

  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onChange}>
      <DialogContent className="max-w-2xl rounded-md h-4/5 overflow-y-auto pt-10 ">
        <DialogHeader>
          <DialogTitle className="text-left">{title}</DialogTitle>
          <p className="text-left text-sm text-muted-foreground">{getMinMaxPrices(product)}</p>
          <DialogDescription className="text-left pt-5 break-all">{description}</DialogDescription>
        </DialogHeader>
        <div>{children}</div>
        <div>{`${product.height}cm x ${product.length}cm x ${product.width}cm`}</div>
      </DialogContent>
    </Dialog>
  );
};
export default ProductModal;
