'use client'

import { createContext, useContext, useEffect, useMemo, useState, useRef, type ReactNode } from "react";
import { useAccount, useNetwork } from '@starknet-react/core';
import { useToast } from "@/components/ui/use-toast";
import type { Badge, Credential } from "@/types";
import {
  createMockProvider,
  createMockBadgeContract,
  createMockCredentialContract,
  getMockBadges,
  getMockCredentials,
} from "@/lib/mock-contract";
import { getNetworkUrl, StarknetChainIds } from "@/contants/starknet";
import { Contract, RpcProvider } from "starknet";

// ABI for ERC721 contract
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
];

// Contract addresses (use environment variables in production)
const CONTRACT_ADDRESSES = {
  BADGE_CONTRACT: process.env.NEXT_PUBLIC_BADGE_CONTRACT_ADDRESS || "0x123456789abcdef",
  CREDENTIAL_CONTRACT: process.env.NEXT_PUBLIC_CREDENTIAL_CONTRACT_ADDRESS || "0xfedcba987654321",
};

// Interfaces
interface MockContract {
  balanceOf: (address: string) => Promise<{ balance: string }>;
  mint: (to: string, tokenId: string, uri: string) => Promise<{ transaction_hash: string }>;
  waitForTransaction?: (transactionHash: string) => Promise<void>;
}

interface ContractWrapper {
  read: Contract | MockContract;
  write: Contract | MockContract;
}

interface MockProvider {
  getChainId: () => Promise<string>;
  callContract: (call: any) => Promise<{ result: string[] }>;
}

interface ContractContextType {
  provider: RpcProvider | MockProvider | null;
  badgeContract: ContractWrapper | null;
  credentialContract: ContractWrapper | null;
  getUserBadges: (address: string) => Promise<Badge[]>;
  getUserCredentials: (address: string) => Promise<Credential[]>;
  mintBadge: (to: string, questId: string, uri: string) => Promise<any>;
  mintCredential: (to: string, campaignId: string, uri: string) => Promise<any>;
  isEligibleForClaim: (address: string, campaignId: string) => Promise<boolean>;
  exportData: (dataType: string) => Promise<string>;
  createCampaign: (campaignMetadata: any) => Promise<any>;
  createQuest: (questMetadata: any) => Promise<any>;
  isLoading: boolean;
  error: string | null;
  resetError: () => void;
}

const ContractContext = createContext<ContractContextType | undefined>(undefined);

export function ContractProvider({ children }: { children: ReactNode }) {
  const { account, status, address } = useAccount();
  const { chain } = useNetwork();
  const { toast } = useToast();
  const [provider, setProvider] = useState<RpcProvider | MockProvider | null>(null);
  const [badgeContract, setBadgeContract] = useState<ContractWrapper | null>(null);
  const [credentialContract, setCredentialContract] = useState<ContractWrapper | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const badgeCache = useRef<Map<string, Badge[]>>(new Map());
  const credentialCache = useRef<Map<string, Credential[]>>(new Map());

  const setLoadingDebounced = (value: boolean) => {
    if (loadingTimeoutRef.current) clearTimeout(loadingTimeoutRef.current);
    loadingTimeoutRef.current = setTimeout(() => setIsLoading(value), 100);
  };

  const resetError = () => setError(null);

  useEffect(() => {
    console.log("ContractProvider useEffect triggered", { status, address, chainId: chain?.id });
    const initializeContracts = async () => {
      if (status !== "connected" || !account || !address) {
        setProvider(null);
        setBadgeContract(null);
        setCredentialContract(null);
        return;
      }

      try {
        if (process.env.NODE_ENV === "development") {
          console.log("Using mock provider for development");
          const mockProvider = createMockProvider();
          const mockBadgeContract = createMockBadgeContract();
          const mockCredentialContract = createMockCredentialContract();

          // Add waitForTransaction for mock compatibility
          const enhancedMockBadgeContract: MockContract = {
            ...mockBadgeContract,
            waitForTransaction: async () => {}, // Mock empty wait
          };
          const enhancedMockCredentialContract: MockContract = {
            ...mockCredentialContract,
            waitForTransaction: async () => {}, // Mock empty wait
          };

          setProvider(mockProvider);
          setBadgeContract({ read: enhancedMockBadgeContract, write: enhancedMockBadgeContract });
          setCredentialContract({ read: enhancedMockCredentialContract, write: enhancedMockCredentialContract });
          return;
        }

        const nodeUrl = chain?.id ? getNetworkUrl(chain.id.toString()) : getNetworkUrl(StarknetChainIds.SN_MAIN);
        const rpcProvider = new RpcProvider({ nodeUrl });
        setProvider(rpcProvider);

        setBadgeContract({
          read: new Contract(ERC721_ABI, CONTRACT_ADDRESSES.BADGE_CONTRACT, rpcProvider),
          write: new Contract(ERC721_ABI, CONTRACT_ADDRESSES.BADGE_CONTRACT, account),
        });

        setCredentialContract({
          read: new Contract(ERC721_ABI, CONTRACT_ADDRESSES.CREDENTIAL_CONTRACT, rpcProvider),
          write: new Contract(ERC721_ABI, CONTRACT_ADDRESSES.CREDENTIAL_CONTRACT, account),
        });
      } catch (error) {
        console.error("Failed to initialize contracts:", error);
        setError("Failed to initialize contracts");
        toast({
          title: "Contract Initialization Failed",
          description: "Using mock data for development.",
          variant: "destructive",
        });

        if (process.env.NODE_ENV === "development") {
          const mockProvider: MockProvider = {
            getChainId: async () => "0x534e5f474f45524c49",
            callContract: async () => ({ result: ["1"] }),
          };
          setProvider(mockProvider);

          const mockBadgeContract: MockContract = {
            balanceOf: async () => ({ balance: "2" }),
            mint: async (to, tokenId, uri) => ({
              transaction_hash: "0x" + Math.random().toString(16).slice(2),
            }),
            waitForTransaction: async () => {},
          };
          setBadgeContract({ read: mockBadgeContract, write: mockBadgeContract });

          const mockCredentialContract: MockContract = {
            balanceOf: async () => ({ balance: "2" }),
            mint: async (to, tokenId, uri) => ({
              transaction_hash: "0x" + Math.random().toString(16).slice(2),
            }),
            waitForTransaction: async () => {},
          };
          setCredentialContract({ read: mockCredentialContract, write: mockCredentialContract });
        }
      }
    };

    initializeContracts();
  }, [status, account, address, chain?.id, toast]);

  const getUserBadges = async (address: string): Promise<Badge[]> => {
    if (badgeCache.current.has(address)) {
      return badgeCache.current.get(address)!;
    }
    setLoadingDebounced(true);
    setError(null);

    try {
      if (process.env.NODE_ENV === "development") {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const badges = getMockBadges();
        badgeCache.current.set(address, badges);
        return badges;
      }

      if (!badgeContract?.read) {
        throw new Error("Badge contract not initialized");
      }

      const balanceResponse = await badgeContract.read.balanceOf(address);
      const balance = Number(balanceResponse.balance);
      const badges: Badge[] = [];

      for (let i = 0; i < balance; i++) {
        badges.push({
          id: `badge-${i}`,
          name: `Badge ${i}`,
          description: "A badge earned on StarkPass",
          image: "/placeholder.svg?height=200&width=200",
          issuer: "StarkPass",
          issuedAt: new Date().toISOString(),
        });
      }

      badgeCache.current.set(address, badges);
      return badges;
    } catch (error) {
      console.error("Failed to get user badges:", error);
      setError("Failed to get user badges");
      return [];
    } finally {
      setLoadingDebounced(false);
    }
  };

  const getUserCredentials = async (address: string): Promise<Credential[]> => {
    if (credentialCache.current.has(address)) {
      return credentialCache.current.get(address)!;
    }
    setLoadingDebounced(true);
    setError(null);

    try {
      if (process.env.NODE_ENV === "development") {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const credentials = getMockCredentials();
        credentialCache.current.set(address, credentials);
        return credentials;
      }

      if (!credentialContract?.read) {
        throw new Error("Credential contract not initialized");
      }

      const balanceResponse = await credentialContract.read.balanceOf(address);
      const balance = Number(balanceResponse.balance);
      const credentials: Credential[] = [];

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
        });
      }

      credentialCache.current.set(address, credentials);
      return credentials;
    } catch (error) {
      console.error("Failed to get user credentials:", error);
      setError("Failed to get user credentials");
      return [];
    } finally {
      setLoadingDebounced(false);
    }
  };

  const mintBadge = async (to: string, questId: string, uri: string) => {
    setLoadingDebounced(true);
    setError(null);

    try {
      if (process.env.NODE_ENV === "development") {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        const result = {
          transactionHash: "0x" + Math.random().toString(16).slice(2),
          tokenId: `${questId}-${Date.now()}`,
        };
        badgeCache.current.delete(to); // Invalidate cache
        return result;
      }

      if (!badgeContract?.write) {
        throw new Error("Badge contract not initialized");
      }

      const tokenId = `0x${(questId + "-" + Date.now()).padStart(64, "0")}`;
      const { transaction_hash } = await badgeContract.write.mint(to, tokenId, uri);

      if (badgeContract.write.waitForTransaction) {
        await badgeContract.write.waitForTransaction(transaction_hash);
      }
      badgeCache.current.delete(to); // Invalidate cache
      return { transactionHash: transaction_hash, tokenId };
    } catch (error) {
      console.error("Failed to mint badge:", error);
      setError("Failed to mint badge");
      throw error;
    } finally {
      setLoadingDebounced(false);
    }
  };

  const mintCredential = async (to: string, campaignId: string, uri: string) => {
    setLoadingDebounced(true);
    setError(null);

    try {
      if (process.env.NODE_ENV === "development") {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        const result = {
          transactionHash: "0x" + Math.random().toString(16).slice(2),
          tokenId: `${campaignId}-${Date.now()}`,
        };
        credentialCache.current.delete(to); // Invalidate cache
        return result;
      }

      if (!credentialContract?.write) {
        throw new Error("Credential contract not initialized");
      }

      const tokenId = `0x${(campaignId + "-" + Date.now()).padStart(64, "0")}`;
      const { transaction_hash } = await credentialContract.write.mint(to, tokenId, uri);

      if (credentialContract.write.waitForTransaction) {
        await credentialContract.write.waitForTransaction(transaction_hash);
      }
      credentialCache.current.delete(to); // Invalidate cache
      return { transactionHash: transaction_hash, tokenId };
    } catch (error) {
      console.error("Failed to mint credential:", error);
      setError("Failed to mint credential");
      throw error;
    } finally {
      setLoadingDebounced(false);
    }
  };

  const isEligibleForClaim = async (address: string, campaignId: string): Promise<boolean> => {
    setLoadingDebounced(true);
    setError(null);

    try {
      if (process.env.NODE_ENV === "development") {
        await new Promise((resolve) => setTimeout(resolve, 800));
        return true;
      }

      return true; // Placeholder
    } catch (error) {
      console.error("Failed to check eligibility:", error);
      setError("Failed to check eligibility");
      return false;
    } finally {
      setLoadingDebounced(false);
    }
  };

  const exportData = async (dataType: string): Promise<string> => {
    setLoadingDebounced(true);
    setError(null);

    try {
      if (process.env.NODE_ENV === "development") {
        await new Promise((resolve) => setTimeout(resolve, 800));
        let exportData = {};
        switch (dataType) {
          case "users":
            exportData = {
              totalUsers: 1250,
              activeUsers: { daily: 120, weekly: 450, monthly: 850 },
              userGrowth: [
                { date: "2025-01", users: 250 },
                { date: "2025-02", users: 450 },
                { date: "2025-03", users: 650 },
                { date: "2025-04", users: 850 },
                { date: "2025-05", users: 1050 },
                { date: "2025-06", users: 1250 },
              ],
              topUsers: [
                { address: "0x1234...5678", completedQuests: 12, credentials: 8 },
                { address: "0x2345...6789", completedQuests: 10, credentials: 7 },
                { address: "0x3456...7890", completedQuests: 9, credentials: 6 },
              ],
            };
            break;
          case "quests":
            exportData = {
              totalQuests: 15,
              questCompletions: 2250,
              averageCompletionRate: "45%",
              quests: [
                { id: "quest-1", title: "Welcome to StarkPass", completions: 850, conversionRate: "85%" },
                { id: "quest-2", title: "Starknet Explorer", completions: 650, conversionRate: "65%" },
                { id: "quest-3", title: "Cairo Smart Contract Basics", completions: 250, conversionRate: "25%" },
              ],
            };
            break;
          case "campaigns":
            exportData = {
              totalCampaigns: 8,
              totalClaims: 3500,
              averageClaimRate: "70%",
              campaigns: [
                { id: "campaign-1", title: "Starknet Hackathon 2025 POAP", claims: 450, claimRate: "90%" },
                { id: "campaign-2", title: "Cairo Workshop Certificate", claims: 180, claimRate: "60%" },
                { id: "campaign-3", title: "Starknet Community Contributor", claims: 75, claimRate: "75%" },
              ],
            };
            break;
          default:
            exportData = {
              ecosystem: { totalUsers: 1250, totalQuests: 15, totalCampaigns: 8, totalCredentials: 3500 },
            };
        }
        return JSON.stringify(exportData, null, 2);
      }

      throw new Error("Not implemented for production");
    } catch (error) {
      console.error(`Failed to export ${dataType} data:`, error);
      setError(`Failed to export ${dataType} data`);
      throw error;
    } finally {
      setLoadingDebounced(false);
    }
  };

  const createCampaign = async (campaignMetadata: any) => {
    setLoadingDebounced(true);
    setError(null);

    try {
      if (process.env.NODE_ENV === "development") {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        return {
          transactionHash: "0x" + Math.random().toString(16).slice(2),
          campaignId: "campaign-" + Date.now(),
        };
      }

      throw new Error("Not implemented for production");
    } catch (error) {
      console.error("Failed to create campaign:", error);
      setError("Failed to create campaign");
      throw error;
    } finally {
      setLoadingDebounced(false);
    }
  };

  const createQuest = async (questMetadata: any) => {
    setLoadingDebounced(true);
    setError(null);

    try {
      if (process.env.NODE_ENV === "development") {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        return {
          transactionHash: "0x" + Math.random().toString(16).slice(2),
          questId: "quest-" + Date.now(),
        };
      }

      throw new Error("Not implemented for production");
    } catch (error) {
      console.error("Failed to create quest:", error);
      setError("Failed to create quest");
      throw error;
    } finally {
      setLoadingDebounced(false);
    }
  };

  const contextValue = useMemo(
    () => ({
      provider,
      badgeContract,
      credentialContract,
      getUserBadges,
      getUserCredentials,
      mintBadge,
      mintCredential,
      isEligibleForClaim,
      exportData,
      createCampaign,
      createQuest,
      isLoading,
      error,
      resetError,
    }),
    [
      provider,
      badgeContract,
      credentialContract,
      isLoading,
      error,
    ]
  );

  return <ContractContext.Provider value={contextValue}>{children}</ContractContext.Provider>;
}

export function useContract() {
  const context = useContext(ContractContext);
  if (context === undefined) {
    throw new Error("useContract must be used within a ContractProvider");
  }
  return context;
}