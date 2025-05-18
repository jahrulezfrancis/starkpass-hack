"use client";

import React from "react";
import { MobileNav } from "./mobile-nav";
import Link from "next/link";
import { Rocket } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import WalletConnect from "./wallet-connect";
import { usePathname } from "next/navigation";

export const Nav = () => {
  const pathName = usePathname();
  //   console.log("pathname: ", pathName);

  return (
    <header className="border-b sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center">
          <MobileNav />
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold ml-2 md:ml-0"
          >
            <Rocket className="h-6 w-6 text-primary" />
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent font-bold">
              StarkPass
            </span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/quests"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Quests
          </Link>
          <Link
            href="/claim"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Claim
          </Link>
          <Link
            href="/sponsor"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            For Sponsors
          </Link>
          <Link
            href="/stats"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Stats
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <WalletConnect />
        </div>
      </div>
    </header>
  );
};
