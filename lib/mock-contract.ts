// Define mock implementations for contracts and providers
import type { Badge, Credential } from "@/types"
import { mockBadges, mockCredentials } from "@/lib/mock-data"

// Mock Provider interface
export interface MockProvider {
  getChainId: () => Promise<string>
  callContract: (call: any) => Promise<{ result: string[] }>
}

// Mock Contract interface
export interface MockContract {
  balanceOf: (address: string) => Promise<{ balance: string }>
  mint: (to: string, tokenId: string, uri: string) => Promise<{ transaction_hash: string }>
  connect?: (account: any) => void
}

// Create a mock provider
export function createMockProvider(): MockProvider {
  return {
    getChainId: async () => "0x534e5f474f45524c49", // SN_GOERLI
    callContract: async () => ({ result: ["1"] }),
  }
}

// Create a mock badge contract
export function createMockBadgeContract(): MockContract {
  return {
    balanceOf: async () => ({ balance: "2" }),
    mint: async (to, tokenId, uri) => ({ transaction_hash: "0x" + Math.random().toString(16).slice(2) }),
    connect: (account) => console.log("Mock badge contract connected to account"),
  }
}

// Create a mock credential contract
export function createMockCredentialContract(): MockContract {
  return {
    balanceOf: async () => ({ balance: "2" }),
    mint: async (to, tokenId, uri) => ({ transaction_hash: "0x" + Math.random().toString(16).slice(2) }),
    connect: (account) => console.log("Mock credential contract connected to account"),
  }
}

// Export the functions that are being imported elsewhere
export function getMockBadges(): Badge[] {
  return mockBadges
}

export function getMockCredentials(): Credential[] {
  return mockCredentials
}
