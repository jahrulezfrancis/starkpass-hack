import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { ThemeProvider } from "@/components/theme-provider";
import { WalletProvider } from "@/lib/wallet-provider";
import { ContractProvider } from "@/lib/contract-provider";
import { UserProvider } from "@/lib/user-provider";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { Nav } from "@/components/nav-bar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "StarkPass - Web3 Credentials & Quest Platform",
  description:
    "Collect on-chain credentials, participate in quests, and showcase your web3 journey with StarkPass.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning={true}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <WalletProvider>
            <ContractProvider>
              <UserProvider>
                <WalletProvider>
                  <Nav />
                  {children}
                </WalletProvider>
              </UserProvider>
            </ContractProvider>
          </WalletProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
