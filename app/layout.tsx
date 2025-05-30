import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Head from "next/head";
import { ThemeProvider } from "@/components/theme-provider";
import { ContractProvider } from "@/lib/contract-provider";
import { UserProvider } from "@/lib/user-provider";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { Nav } from "@/components/nav-bar";
import { StarkPassProvider } from "@/context/WalletContext";
import { StarknetWalletProvider } from "@/components/Providers/StartknetWalletProvider";
import Footer from "@/components/Footer";

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
      <Head>
        <link rel="icon" href="/public/mainLogo.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Collect on-chain credentials, participate in quests, and showcase your web3 journey with StarkPass."
        />
        <meta name="theme-color" content="#000000" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <body className={inter.className} suppressHydrationWarning={true}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <StarknetWalletProvider>
            <ContractProvider>
              <UserProvider>
                <StarkPassProvider>
                  <Nav />
                  {children}
                  <Footer />
                </StarkPassProvider>
              </UserProvider>
            </ContractProvider>
          </StarknetWalletProvider>

          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
