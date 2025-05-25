"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useContract } from "./contract-provider";
import type { Badge, Credential } from "@/types";
import { mockCompletedQuests } from "@/lib/mock-data";
import { useAccount } from "@starknet-react/core";
import { useToast } from "@/components/ui/use-toast";

interface UserContextType {
  badges: Badge[];
  credentials: Credential[];
  completedQuests: string[];
  claimableItems: Credential[];
  xp: number;
  level: number;
  isLoading: boolean;
  error: string | null;
  completeQuest: (questId: string) => Promise<void>;
  claimCredential: (credentialId: string) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const { address, status } = useAccount();
  const { getUserBadges, getUserCredentials, mintBadge, mintCredential } =
    useContract();
  const [badges, setBadges] = useState<Badge[]>([]);
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [completedQuests, setCompletedQuests] = useState<string[]>([]);
  const [claimableItems, setClaimableItems] = useState<Credential[]>([]);
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load user data when wallet is connected
  useEffect(() => {
    const loadUserData = async () => {
      if (status !== "connected" || !address) {
        // Reset state when disconnected
        setBadges([]);
        setCredentials([]);
        setCompletedQuests([]);
        setClaimableItems([]);
        setXp(0);
        setLevel(1);
        setError(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Fetch badges from contract
        const userBadges = await getUserBadges(address);
        setBadges(userBadges);

        // Fetch credentials from contract
        const userCredentials = await getUserCredentials(address);
        setCredentials(userCredentials);

        // Set completed quests (mock for now)
        setCompletedQuests(mockCompletedQuests);

        // Set claimable items (mock for now)
        const claimable: Credential[] = [
          {
            id: "claimable-cred-campaign-1",
            name: "Starknet Hackathon 2025",
            description: "Participated in the Starknet Hackathon 2025",
            image: "/placeholder.svg?height=300&width=300",
            issuer: "Starknet Foundation",
            issuedAt: new Date().toISOString(),
            tokenId: "1234",
            contractAddress:
              process.env.NEXT_PUBLIC_CREDENTIAL_CONTRACT_ADDRESS ||
              "0x1234567890abcdef",
          },
          {
            id: "claimable-cred-campaign-2",
            name: "Cairo Workshop",
            description: "Completed the Cairo Smart Contract Workshop",
            image: "/placeholder.svg?height=300&width=300",
            issuer: "StarkWare",
            issuedAt: new Date().toISOString(),
            tokenId: "5678",
            contractAddress:
              process.env.NEXT_PUBLIC_CREDENTIAL_CONTRACT_ADDRESS ||
              "0x1234567890abcdef",
          },
          {
            id: "claimable-cred-campaign-3",
            name: "Starknet Community Contributor",
            description:
              "Recognition for active contributors to the Starknet ecosystem",
            image: "/placeholder.svg?height=300&width=300",
            issuer: "StarkWare",
            issuedAt: new Date().toISOString(),
            tokenId: "5678",
            contractAddress:
              process.env.NEXT_PUBLIC_CREDENTIAL_CONTRACT_ADDRESS ||
              "0x1234567890abcdef",
          },
        ];
        setClaimableItems(claimable);

        // Calculate XP and level after setting completedQuests
        const totalXp = mockCompletedQuests.length * 100;
        setXp(totalXp);
        setLevel(Math.floor(totalXp / 500) + 1);
      } catch (err) {
        console.error("Failed to load user data:", err);
        const errorMessage = "Failed to load user data. Please try again.";
        setError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [status, address, getUserBadges, getUserCredentials, toast]);

  // Complete a quest
  const completeQuest = async (questId: string) => {
    if (status !== "connected" || !address) {
      const errorMessage = "Wallet not connected";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw new Error(errorMessage);
    }

    setIsLoading(true);
    setError(null);

    try {
      // Update state
      setCompletedQuests((prev) => [...prev, questId]);
      const newXp = xp + 100;
      setXp(newXp);

      // Check if level up
      const newLevel = Math.floor(newXp / 500) + 1;
      if (newLevel > level) {
        setLevel(newLevel);
      }

      // Mint a badge
      const badgeUri = `https://starkpass.example/badge/${questId}`;
      await mintBadge(address, questId, badgeUri);

      // Fetch updated badges
      const userBadges = await getUserBadges(address);
      setBadges(userBadges);

      toast({
        title: "Quest Completed",
        description: `Quest ${questId} completed successfully!`,
      });
    } catch (err) {
      console.error("Failed to complete quest:", err);
      const errorMessage = "Failed to complete quest. Please try again.";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Claim a credential
  const claimCredential = async (credentialId: string) => {
    if (status !== "connected" || !address) {
      const errorMessage = "Wallet not connected";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw new Error(errorMessage);
    }

    setIsLoading(true);
    setError(null);

    try {
      // Find the credential
      const credential = claimableItems.find(
        (item) => item.id === credentialId
      );
      console.log("Claiming credential Provider:", credential);
      if (!credential) {
        const errorMessage = "Credential not found";
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        throw new Error(errorMessage);
      }

      // Mint the credential
      const credentialUri = `https://starkpass.example/credential/${credentialId}`;
      if (process.env.NODE_ENV === "development") {
        await new Promise((resolve) => setTimeout(resolve, 1500));
      } else {
        await mintCredential(address, credentialId, credentialUri);
      }

      // Update state
      setCredentials((prev) => [...prev, credential]);
      setClaimableItems((prev) =>
        prev.filter((item) => item.id !== credentialId)
      );

      toast({
        title: "Credential Claimed",
        description: `Credential ${credential.name} claimed successfully!`,
      });
    } catch (err) {
      console.error("Failed to claim credential:", err);
      const errorMessage = "Failed to claim credential. Please try again.";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <UserContext.Provider
      value={{
        badges,
        credentials,
        completedQuests,
        claimableItems,
        xp,
        level,
        isLoading,
        error,
        completeQuest,
        claimCredential,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
