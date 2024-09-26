"use client";
import React, { createContext, ReactNode, useContext, useState } from "react";

interface ModalContext {
  openModal: (name: string) => void;
  closeModal: () => void;
  isOpen: string | null;
}
const ModalContext = createContext<ModalContext | null>(null);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState<string | null>(null);

  const openModal = (name: string) => {
    setIsOpen(name);
  };
  const closeModal = () => {
    setIsOpen(null);
  };

  const contextValue = {
    openModal,
    closeModal,
    isOpen,
  };
  return <ModalContext.Provider value={contextValue}>{children}</ModalContext.Provider>;
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within ModalProvider");
  }
  return context;
};
