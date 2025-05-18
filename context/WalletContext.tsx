// context/StarkPassContext.tsx

"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface StarkPassContextType {
  isConnected: boolean;
  setIsConnected: (val: boolean) => void;
  address: string;
  setAddress: (val: string) => void;
}

const StarkPassContext = createContext<StarkPassContextType | undefined>(
  undefined
);

export const StarkPassProvider = ({ children }: { children: ReactNode }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState("");

  return (
    <StarkPassContext.Provider
      value={{
        isConnected,
        setIsConnected,
        address,
        setAddress,
      }}
    >
      {children}
    </StarkPassContext.Provider>
  );
};

export const useStarkPass = () => {
  const context = useContext(StarkPassContext);
  if (!context) {
    throw new Error("useStarkPass must be used within a StarkPassProvider");
  }
  return context;
};
