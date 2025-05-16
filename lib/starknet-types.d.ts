// Type definitions for starknet.js and starknetkit
declare module "starknetkit" {
  export interface StarknetWindowObject {
    id: string
    name: string
    version: string
    icon: string
    isConnected: boolean
    isPreauthorized: boolean
    provider: {
      getChainId: () => Promise<string>
      [key: string]: any
    }
    account?: {
      address: string
      chainId?: string
      signMessage: (params: {
        message: string
        domain?: {
          name: string
          version: string
          chainId: string
        }
      }) => Promise<string | string[]>
      [key: string]: any
    }
    request: (params: { method: string; params?: any }) => Promise<any>
    on: (event: string, handleEvent: (...args: any[]) => void) => void
    off: (event: string, handleEvent: (...args: any[]) => void) => void
    [key: string]: any
  }

  export interface ConnectOptions {
    modalMode?: "alwaysAsk" | "neverAsk"
    modalTheme?: "light" | "dark" | "system"
    webWalletUrl?: string
    dappName?: string
    [key: string]: any
  }

  export interface ConnectResponse {
    wallet: StarknetWindowObject | null
    isConnected: boolean
    address?: string
    [key: string]: any
  }

  export function connect(options?: ConnectOptions): Promise<ConnectResponse>
  export function disconnect(options: { wallet: StarknetWindowObject }): Promise<void>
}

// Extend window with starknet property
interface Window {
  starknet?: any
}
