"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useWallet } from "@/lib/wallet-provider";

interface WalletContextType {
  isConnected: boolean;
  address: string | null;
}

const WalletContext = createContext<WalletContextType>({
  isConnected: false,
  address: null,
});

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const { isConnected: libIsConnected, address: libAddress } = useWallet();

  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    setIsConnected(libIsConnected);
    setAddress(libAddress || null);
  }, [libIsConnected, libAddress]);

  return (
    <WalletContext.Provider value={{ isConnected, address }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWalletContext = () => useContext(WalletContext);
