'use client'

import '@rainbow-me/rainbowkit/styles.css'
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { useAccount, WagmiProvider } from 'wagmi'
import {
    mainnet,
    polygon,
    optimism,
    arbitrum,
    base,
} from 'wagmi/chains'
import { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const config = getDefaultConfig({
    appName: 'Starkpass',
    projectId: 'b5fea332e6fd1d988eeaecd68cad5fac',
    chains: [mainnet, polygon, optimism, arbitrum, base],
    ssr: true,
})

const queryClient = new QueryClient()

export function CustomWalletProvider({ children }: { children: ReactNode }) {

    const {address, isConnected} = useAccount()

    console.log("Wallet address:", address)
    console.log("Wallet connected:", isConnected)
    return (
            <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
                <RainbowKitProvider>{children}</RainbowKitProvider>
        </QueryClientProvider>
            </WagmiProvider>
    )
}
