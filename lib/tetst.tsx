"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { Account, Contract, Provider, RpcProvider, constants, shortString } from "starknet"
import { useWallet } from "./wallet-provider"
import { StarknetChainIds } from "@/contants/starknet"

const ERC721_ABI = [
  {
    name: "balanceOf",
    type: "function",
    inputs: [{ name: "owner", type: "felt" }],
    outputs: [{ name: "balance", type: "felt" }],
    stateMutability: "view",
  },
  {
    name: "ownerOf",
    type: "function",
    inputs: [{ name: "tokenId", type: "felt" }],
    outputs: [{ name: "owner", type: "felt" }],
    stateMutability: "view",
  },
  {
    name: "tokenURI",
    type: "function",
    inputs: [{ name: "tokenId", type: "felt" }],
    outputs: [{ name: "tokenURI", type: "felt" }],
    stateMutability: "view",
  },
  {
    name: "mint",
    type: "function",
    inputs: [
      { name: "to", type: "felt" },
      { name: "tokenId", type: "felt" },
      { name: "tokenURI", type: "felt" },
    ],
    outputs: [],
    stateMutability: "external",
  },
]

const CONTRACT_ADDRESSES = {
  BADGE_CONTRACT: "0x123456789abcdef",
  CREDENTIAL_CONTRACT: "0xfedcba987654321",
}

interface ContractWrapper {
  read: Contract
  write: Contract
}

interface ContractContextType {
  provider: Provider | null
  badgeContract: ContractWrapper | null
  credentialContract: ContractWrapper | null
  getUserBadges: (address: string) => Promise<any[]>
  getUserCredentials: (address: string) => Promise<any[]>
  mintBadge: (to: string, questId: string, uri: string) => Promise<any>
  mintCredential: (to: string, campaignId: string, uri: string) => Promise<any>
  isEligibleForClaim: (address: string, campaignId: string) => Promise<boolean>
  isLoading: boolean
  error: string | null
  resetError: () => void
}

const ContractContext = createContext<ContractContextType | undefined>(undefined)

export function ContractProvider({ children }: { children: ReactNode }) {
  const { wallet, isConnected, chainId } = useWallet()
  const [provider, setProvider] = useState<Provider | null>(null)
  const [badgeContract, setBadgeContract] = useState<ContractWrapper | null>(null)
  const [credentialContract, setCredentialContract] = useState<ContractWrapper | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const RPC_URLS = {
    // [StarknetChainIds.SN_GOERLI]: "https://starknet-goerli.infura.io/v3/YOUR_INFURA_KEY",
    [StarknetChainIds.SN_MAIN]: "https://starknet-mainnet.blastapi.io/6be68b1a-f540-4fd4-89a9-3af01c63aba1",
    [StarknetChainIds.SN_SEPOLIA]: "https://starknet-sepolia.blastapi.io/6be68b1a-f540-4fd4-89a9-3af01c63aba1",
  }

  const resetError = () => setError(null)

  useEffect(() => {
    const initializeContracts = async () => {
      if (!isConnected || !wallet || !wallet.account?.address) {
        setProvider(null)
        setBadgeContract(null)
        setCredentialContract(null)
        return
      }

      try {
        if (!chainId || !(chainId in RPC_URLS)) {
          throw new Error("Invalid or missing chainId for RPC URL")
        }

        const rpcUrl = RPC_URLS[chainId as keyof typeof RPC_URLS]
        const rpcProvider = new RpcProvider({ nodeUrl: rpcUrl })
        const signerAccount = new Account(rpcProvider, wallet.account.address, wallet.account as any)

        setProvider(rpcProvider)

        setBadgeContract({
          read: new Contract(ERC721_ABI, CONTRACT_ADDRESSES.BADGE_CONTRACT, rpcProvider),
          write: new Contract(ERC721_ABI, CONTRACT_ADDRESSES.BADGE_CONTRACT, signerAccount),
        })

        setCredentialContract({
          read: new Contract(ERC721_ABI, CONTRACT_ADDRESSES.CREDENTIAL_CONTRACT, rpcProvider),
          write: new Contract(ERC721_ABI, CONTRACT_ADDRESSES.CREDENTIAL_CONTRACT, signerAccount),
        })
      } catch (error) {
        console.error("Failed to initialize contracts:", error)
        setError("Failed to initialize contracts")
      }
    }

    initializeContracts()
  }, [isConnected, wallet, chainId])

  const getUserBadges = async (address: string) => {
    if (!badgeContract?.read) return []

    setIsLoading(true)
    setError(null)

    try {
      const balanceResponse = await badgeContract.read.balanceOf(address)
      const balance = Number(balanceResponse.balance)
      const badges = []

      for (let i = 0; i < balance; i++) {
        badges.push({
          id: `badge-${i}`,
          name: `Badge ${i}`,
          description: "A badge earned on StarkPass",
          image: "/placeholder.svg?height=200&width=200",
          issuer: "StarkPass",
          issuedAt: new Date().toISOString(),
        })
      }

      return badges
    } catch (error) {
      console.error("Failed to get user badges:", error)
      setError("Failed to get user badges")
      return []
    } finally {
      setIsLoading(false)
    }
  }

  const getUserCredentials = async (address: string) => {
    if (!credentialContract?.read) return []

    setIsLoading(true)
    setError(null)

    try {
      const balanceResponse = await credentialContract.read.balanceOf(address)
      const balance = Number(balanceResponse.balance)
      const credentials = []

      for (let i = 0; i < balance; i++) {
        credentials.push({
          id: `cred-${i}`,
          name: `Credential ${i}`,
          description: "A credential earned on StarkPass",
          image: "/placeholder.svg?height=300&width=300",
          issuer: "StarkPass",
          issuedAt: new Date().toISOString(),
          tokenId: `${i}`,
          contractAddress: CONTRACT_ADDRESSES.CREDENTIAL_CONTRACT,
        })
      }

      return credentials
    } catch (error) {
      console.error("Failed to get user credentials:", error)
      setError("Failed to get user credentials")
      return []
    } finally {
      setIsLoading(false)
    }
  }

  const mintBadge = async (to: string, questId: string, uri: string) => {
    if (!badgeContract?.write) {
      throw new Error("Badge contract not initialized")
    }

    setIsLoading(true)
    setError(null)

    try {
      const tokenId = shortString.encodeShortString(`${questId}-${Date.now()}`)
      const { transaction_hash } = await badgeContract.write.mint(
        to,
        tokenId,
        shortString.encodeShortString(uri),
      )
      await badgeContract.write.waitForTransaction(transaction_hash)

      return { transactionHash: transaction_hash, tokenId }
    } catch (error) {
      console.error("Failed to mint badge:", error)
      setError("Failed to mint badge")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const mintCredential = async (to: string, campaignId: string, uri: string) => {
    if (!credentialContract?.write) {
      throw new Error("Credential contract not initialized")
    }

    setIsLoading(true)
    setError(null)

    try {
      const tokenId = shortString.encodeShortString(`${campaignId}-${Date.now()}`)
      const { transaction_hash } = await credentialContract.write.mint(
        to,
        tokenId,
        shortString.encodeShortString(uri),
      )
      await credentialContract.write.waitForTransaction(transaction_hash)

      return { transactionHash: transaction_hash, tokenId }
    } catch (error) {
      console.error("Failed to mint credential:", error)
      setError("Failed to mint credential")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const isEligibleForClaim = async (address: string, campaignId: string) => {
    return true // placeholder logic
  }

  return (
    <ContractContext.Provider
      value={{
        provider,
        badgeContract,
        credentialContract,
        getUserBadges,
        getUserCredentials,
        mintBadge,
        mintCredential,
        isEligibleForClaim,
        isLoading,
        error,
        resetError,
      }}
    >
      {children}
    </ContractContext.Provider>
  )
}

export function useContract() {
  const context = useContext(ContractContext)
  if (!context) throw new Error("useContract must be used within a ContractProvider")
  return context
}