import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"

import { ThemeProvider } from "@/components/theme-provider"
import { WalletProvider } from "@/lib/wallet-provider"
import { ContractProvider } from "@/lib/contract-provider"
import { UserProvider } from "@/lib/user-provider"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "StarkPass - Web3 Credentials & Quest Platform",
  description: "Collect on-chain credentials, participate in quests, and showcase your web3 journey with StarkPass.",
}

// This component will help prevent theme flickering
function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            try {
              var theme = localStorage.getItem('theme') || 
                         (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
              var systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
              
              document.documentElement.classList.add(theme === 'system' ? systemTheme : theme);
              document.documentElement.style.colorScheme = theme === 'system' ? systemTheme : theme;
            } catch (e) {}
          })();
        `,
      }}
    />
  )
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className={inter.className}>
        <ThemeProvider 
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="theme"
        >
          <WalletProvider>
            <ContractProvider>
              <UserProvider>{children}</UserProvider>
            </ContractProvider>
          </WalletProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}