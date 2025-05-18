"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Rocket } from "lucide-react";

import { MobileNav } from "./mobile-nav";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "@/lib/utils";

import { StarknetWalletConnect } from "./StartknetWalletConnect";
import { useStarkPass } from "@/context/WalletContext";

export const Nav = () => {
  const pathname = usePathname();
  const { isConnected } = useStarkPass();

  const loggedInLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact us" },
  ];

  const guestLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/quests", label: "Quests" },
    { href: "/claim", label: "Claim" },
    { href: "/sponsor", label: "Sponsors" },
    { href: "/stats", label: "Stats" },
  ];

  const navLinks = isConnected ? loggedInLinks : guestLinks;

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
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "text-sm font-medium transition-colors px-3 py-1 rounded-md",
                pathname === href
                  ? "bg-gradient-to-r from-[#ff80b5] to-purple-600 bg-clip-text text-transparent  font-semibold"
                  : "hover:text-primary"
              )}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <StarknetWalletConnect />
        </div>
      </div>
    </header>
  );
};
