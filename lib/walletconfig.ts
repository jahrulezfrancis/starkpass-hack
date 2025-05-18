"use client"

import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
} from 'wagmi/chains';




export const rainbow_custom_config = getDefaultConfig({
  appName: 'My RainbowKit App',
  projectId: 'b5fea332e6fd1d988eeaecd68cad5fac',
  chains: [mainnet, polygon, optimism, arbitrum, base],
  ssr: true, 
});