"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useContract } from "./contract-provider"
import type { Badge, Credential } from "@/types"
import { mockCompletedQuests } from "@/lib/mock-data"
import { useAccount } from "@starknet-react/core"

interface UserContextType {
  badges: Badge[]
  credentials: Credential[]
  completedQuests: string[]
  claimableItems: Credential[]
  xp: number
  level: number
  isLoading: boolean
  completeQuest: (questId: string) => Promise<void>
  claimCredential: (credentialId: string) => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const { address, isConnected } = useAccount()
  const { getUserBadges, getUserCredentials, mintBadge, mintCredential } = useContract()
  const [badges, setBadges] = useState<Badge[]>([])
  const [credentials, setCredentials] = useState<Credential[]>([])
  const [completedQuests, setCompletedQuests] = useState<string[]>([])
  const [claimableItems, setClaimableItems] = useState<Credential[]>([])
  const [xp, setXp] = useState(0)
  const [level, setLevel] = useState(1)
  const [isLoading, setIsLoading] = useState(true)

  // Load user data when wallet is connected
  useEffect(() => {
    const loadUserData = async () => {
      if (!isConnected || !address) {
        // Reset state when disconnected
        setBadges([])
        setCredentials([])
        setCompletedQuests([])
        setClaimableItems([])
        setXp(0)
        setLevel(1)
        setIsLoading(false)
        return
      }

      if (isConnected && address) {
        setIsLoading(true)

        try {
          // Fetch badges from contract
          const userBadges = await getUserBadges(address)
          setBadges(userBadges)

          // Fetch credentials from contract
          const userCredentials = await getUserCredentials(address)
          setCredentials(userCredentials)

          // For now, we'll still use mock data for completed quests
          // In a real implementation, this would be fetched from a database or contract
          setCompletedQuests(mockCompletedQuests)

          // Generate some claimable items
          // In a real implementation, this would be fetched from a database or contract
          const claimable = [
            {
              id: "claimable-cred-1",
              name: "Starknet Hackathon 2025",
              description: "Participated in the Starknet Hackathon 2025",
              image: "/placeholder.svg?height=300&width=300",
              issuer: "Starknet Foundation",
              issuedAt: new Date().toISOString(),
              tokenId: "1234",
              contractAddress: "0x1234567890abcdef",
            },
            {
              id: "claimable-cred-2",
              name: "Cairo Workshop",
              description: "Completed the Cairo Smart Contract Workshop",
              image: "/placeholder.svg?height=300&width=300",
              issuer: "StarkWare",
              issuedAt: new Date().toISOString(),
              tokenId: "5678",
              contractAddress: "0x1234567890abcdef",
            },
          ]
          setClaimableItems(claimable)

          // Calculate XP and level
          const totalXp = completedQuests.length * 100
          setXp(totalXp)
          setLevel(Math.floor(totalXp / 500) + 1)
        } catch (error) {
          console.error("Failed to load user data:", error)
        } finally {
          setIsLoading(false)
        }
      } else {
        // Reset state when disconnected
        setBadges([])
        setCredentials([])
        setCompletedQuests([])
        setClaimableItems([])
        setXp(0)
        setLevel(1)
        setIsLoading(false)
      }
    }

    loadUserData()
  }, [isConnected, address, getUserBadges, getUserCredentials])

  // Complete a quest
  const completeQuest = async (questId: string) => {
    if (!isConnected || !address) throw new Error("Wallet not connected")

    try {
      // In a real implementation, this would interact with a smart contract
      // For now, we'll update the state and mint a badge
      setCompletedQuests((prev) => [...prev, questId])
      setXp((prev) => prev + 100)

      // Check if level up
      const newXp = xp + 100
      const newLevel = Math.floor(newXp / 500) + 1
      if (newLevel > level) {
        setLevel(newLevel)
      }

      // Mint a badge for completing the quest
      const badgeUri = `https://starkpass.example/badge/${questId}`
      await mintBadge(address, questId, badgeUri)

      // Fetch updated badges
      const userBadges = await getUserBadges(address)
      setBadges(userBadges)

      return Promise.resolve()
    } catch (error) {
      console.error("Failed to complete quest:", error)
      throw error
    }
  }

  // Claim a credential
  const claimCredential = async (credentialId: string) => {
    if (!isConnected || !address) throw new Error("Wallet not connected")

    try {
      // Find the credential in claimable items
      const credential = claimableItems.find((item) => item.id === credentialId)
      if (!credential) throw new Error("Credential not found")

      // Mint the credential
      const credentialUri = `https://starkpass.example/credential/${credentialId}`

      // For development, simulate a delay
      if (process.env.NODE_ENV === "development") {
        await new Promise((resolve) => setTimeout(resolve, 1500))
      } else {
        await mintCredential(address, credentialId, credentialUri)
      }

      // Update state
      setCredentials((prev) => [...prev, credential])
      setClaimableItems((prev) => prev.filter((item) => item.id !== credentialId))

      return Promise.resolve()
    } catch (error) {
      console.error("Failed to claim credential:", error)
      throw error
    }
  }

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
        completeQuest,
        claimCredential,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
