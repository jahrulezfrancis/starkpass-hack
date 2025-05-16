"use client"

import { StarknetChainIds } from "@/contants/starknet"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { ConnectOptions, StarknetWindowObject } from "starknetkit"

// Type for mock wallet implementation
interface MockWallet extends Partial<StarknetWindowObject> {
  id: string
  isConnected: boolean
  account: {
    address: string
    signMessage: (params: any) => Promise<string>
  }
  provider: {
    getChainId: () => Promise<string>
  }
  on: (event: string, callback: (...args: any[]) => void) => void
  off: (event: string, callback: (...args: any[]) => void) => void
}

interface WalletContextType {
  address: string | null
  isConnected: boolean
  wallet: StarknetWindowObject | MockWallet | null
  connect: (options?: ConnectOptions) => Promise<void>
  disconnect: () => Promise<void>
  signMessage: (message: string) => Promise<string>
  chainId: string | null
  networkName: string
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [wallet, setWallet] = useState<StarknetWindowObject | MockWallet | null>(null)
  const [chainId, setChainId] = useState<string | null>(null)
  const [networkName, setNetworkName] = useState<string>("Unknown Network")

  useEffect(() => {
    let mounted = true

    async function checkConnection() {
      try {
        const savedWalletName = localStorage.getItem("starkpass_wallet_name")

        if (!savedWalletName || !mounted) return

        if (savedWalletName === "mock") {
          createMockWalletConnection()
          return
        }

        const starknetkit = await import("starknetkit")
        const connection = await starknetkit.connect({
          modalMode: "neverAsk",
          webWalletUrl: savedWalletName,
        })

        if (connection?.wallet && connection.isConnected && mounted) {
          handleSuccessfulConnection(connection.wallet)
        } else {
          localStorage.removeItem("starkpass_wallet_name")
        }
      } catch (error) {
        console.error("Failed to reconnect wallet:", error)
        localStorage.removeItem("starkpass_wallet_name")
      }
    }

    checkConnection()

    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    if (!wallet) return

    const handleNetworkChange = () => {
      updateWalletInfo(wallet)
    }

    wallet.on("networkChanged", handleNetworkChange)

    return () => {
      wallet.off("networkChanged", handleNetworkChange)
    }
  }, [wallet])

  const createMockWalletConnection = () => {
    // Generate a mock address (40 hex chars)
    const randomHex = () => Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(16).padStart(16, "0")
    const mockAddress = "0x" + randomHex() + randomHex().slice(0, 8)

    const mockWallet: MockWallet = {
      id: "mock",
      isConnected: true,
      account: {
        address: mockAddress,
        signMessage: async () => "0x" + Math.random().toString(16).slice(2),
      },
      provider: {
        getChainId: async () => StarknetChainIds.SN_GOERLI, // Hex string from your constants
      },
      on: () => {},
      off: () => {},
    }

    setWallet(mockWallet)
    setAddress(mockAddress)
    setIsConnected(true)
    setNetworkName("Development")
    setChainId(StarknetChainIds.SN_GOERLI)
    localStorage.setItem("starkpass_wallet_name", "mock")
  }

  const updateWalletInfo = async (walletObj: StarknetWindowObject | MockWallet) => {
    if (!walletObj || !walletObj.isConnected) return

    try {
      const chainId = await walletObj.provider.getChainId()
      setChainId(chainId)

      let network = "Unknown Network"
      switch (chainId) {
        case StarknetChainIds.SN_MAIN:
          network = "Mainnet"
          break
        case StarknetChainIds.SN_GOERLI:
          network = "Goerli Testnet"
          break
        case StarknetChainIds.SN_SEPOLIA:
          network = "Sepolia Testnet"
          break
      }
      setNetworkName(network)

      if (walletObj.account?.address) {
        setAddress(walletObj.account.address)
      }
    } catch (error) {
      console.error("Error updating wallet info:", error)
    }
  }

  const handleSuccessfulConnection = (walletObj: StarknetWindowObject | MockWallet) => {
    setWallet(walletObj)
    setIsConnected(true)

    if (walletObj.account?.address) {
      setAddress(walletObj.account.address)
    }

    if (walletObj.id) {
      localStorage.setItem("starkpass_wallet_name", walletObj.id)
    }

    updateWalletInfo(walletObj)
  }

  const connectWallet = async (options?: ConnectOptions) => {
    try {
      if (
        options?.webWalletUrl === "mock" ||
        (typeof window !== "undefined" && process.env.NODE_ENV === "development" && !window.starknet)
      ) {
        createMockWalletConnection()
        return
      }

      const defaultOptions: ConnectOptions = {
        modalMode: "alwaysAsk",
        modalTheme: "system",
      }

      const starknetkit = await import("starknetkit")

      let connectOptions = { ...defaultOptions, ...options }

      // Clear conflicting options for specific wallets
      if (options?.webWalletUrl === "argentX" || options?.webWalletUrl === "braavos") {
        connectOptions = {
          ...connectOptions,
          webWalletUrl: undefined,
          modalMode: "neverAsk",
          walletConnectProjectId: undefined,
        }
      }

      const connection = await starknetkit.connect(connectOptions)

      if (connection?.wallet) {
        handleSuccessfulConnection(connection.wallet)
      } else {
        if (process.env.NODE_ENV === "development") {
          createMockWalletConnection()
        } else {
          throw new Error("Failed to connect wallet - no wallet returned")
        }
      }
    } catch (error) {
      console.error("Error connecting wallet:", error)
      if (process.env.NODE_ENV === "development") {
        createMockWalletConnection()
      } else {
        throw error
      }
    }
  }

  const disconnectWallet = async () => {
    try {
      if (wallet && wallet.id !== "mock") {
        const starknetkit = await import("starknetkit")
        await starknetkit.disconnect({ wallet: wallet as StarknetWindowObject })
      }

      setWallet(null)
      setAddress(null)
      setIsConnected(false)
      setChainId(null)
      setNetworkName("Unknown Network")

      localStorage.removeItem("starkpass_wallet_name")
    } catch (error) {
      console.error("Error disconnecting wallet:", error)
      throw error
    }
  }

  const signMessage = async (message: string): Promise<string> => {
    if (!wallet || !wallet.account) {
      if (process.env.NODE_ENV === "development") {
        return "0x" + Math.random().toString(16).slice(2)
      }
      throw new Error("Wallet not connected")
    }

    try {
      if (wallet.id === "mock") {
        return "0x" + Math.random().toString(16).slice(2)
      }

      // Convert message string to hex with 0x prefix
      const messageToSign = "0x" + Buffer.from(message).toString("hex")

      const signature = await wallet.account.signMessage({
        message: messageToSign,
        domain: {
          name: "StarkPass",
          version: "1",
          chainId: chainId || "Unknown",
        },
      })

      return Array.isArray(signature) ? signature[0] : signature
    } catch (error) {
      console.error("Error signing message:", error)
      if (process.env.NODE_ENV === "development") {
        return "0x" + Math.random().toString(16).slice(2)
      }
      throw error
    }
  }

  return (
    <WalletContext.Provider
      value={{
        address,
        isConnected,
        wallet,
        connect: connectWallet,
        disconnect: disconnectWallet,
        signMessage,
        chainId,
        networkName,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}
