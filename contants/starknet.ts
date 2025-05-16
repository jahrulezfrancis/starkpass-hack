// Define constants for Starknet chain IDs and network names
// These are used to avoid TypeScript errors with the starknet.js library

export const StarknetChainIds = {
  SN_MAIN: "0x534e5f4d41494e",
  SN_GOERLI: "0x534e5f474f45524c49",
  SN_SEPOLIA: "0x534e5f5345504f4c4941",
}

export const NetworkNames = {
  SN_MAIN: "mainnet",
  SN_GOERLI: "goerli-alpha",
  SN_SEPOLIA: "sepolia-alpha",
}

// Helper function to get network URL based on chain ID
export function getNetworkUrl(chainId: string): string {
  switch (chainId) {
    case StarknetChainIds.SN_MAIN:
      return "https://starknet-mainnet.blastapi.io/6be68b1a-f540-4fd4-89a9-3af01c63aba1"
    case StarknetChainIds.SN_GOERLI:
      return "https://starknet-testnet.public.blastapi.io"
    case StarknetChainIds.SN_SEPOLIA:
      return "https://starknet-sepolia.blastapi.io/6be68b1a-f540-4fd4-89a9-3af01c63aba1"
    default:
      return "https://starknet-mainnet.blastapi.io/6be68b1a-f540-4fd4-89a9-3af01c63aba1"
  }
}



