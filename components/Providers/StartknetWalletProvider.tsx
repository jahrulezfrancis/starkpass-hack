'use client'

import { StarknetConfig, publicProvider } from '@starknet-react/core'
import { ReactNode } from 'react'
import { mainnet, sepolia } from '@starknet-react/chains'

export function StarknetWalletProvider({ children }: { children: ReactNode }) {
  return (
    <StarknetConfig
      chains={[mainnet, sepolia]}
      provider={publicProvider()}
      autoConnect
    >
      {children}
    </StarknetConfig>
  )
}
