"use client";

import { createContext, useContext, useState } from "react";

interface IProductFilterContext {
  categories: string[];
  sizes: string[];
  colors: string[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const ProductFilterContext = createContext<IProductFilterContext | undefined>(undefined);

interface ProductFilterProviderProps {
  children: React.ReactNode;
  value: {
    categories: string[];
    sizes: string[];
    colors: string[];
  };
}

export const ProductFilterProvider: React.FC<ProductFilterProviderProps> = ({ children, value }) => {
  const [isOpen, setIsOpen] = useState(false);

  const contextValue = {
    ...value,
    isOpen,
    setIsOpen,
  };

  return <ProductFilterContext.Provider value={contextValue}>{children}</ProductFilterContext.Provider>;
};

export const useProductFilter = () => {
  const context = useContext(ProductFilterContext);

  if (!context) {
    throw new Error("useProductFilter must be used within a ProductFilterProvider");
  }
  return context;
};
