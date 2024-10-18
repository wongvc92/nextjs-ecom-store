"use client";

import { Sender } from "@/lib/types";
import { createContext, useContext, useMemo } from "react";

interface SenderContextType {
  sender: Sender | null;
}

const SenderContext = createContext<SenderContextType | null>(null);

interface SenderProviderProps {
  sender: Sender | null;
  children: React.ReactNode;
}
export const SenderProvider = ({ sender, children }: SenderProviderProps) => {
  const contextValue = useMemo(
    () => ({
      sender,
    }),
    [sender]
  );
  return <SenderContext.Provider value={contextValue}>{children}</SenderContext.Provider>;
};

export const useSender = () => {
  const currentUserContext = useContext(SenderContext);

  if (!currentUserContext) {
    throw new Error("useCurrentUser has to be used within <CurrentUserContext.Provider>");
  }

  return currentUserContext;
};
