import Link from "next/link";
import React from "react";
import { ThemeToggle } from "./theme-toggle";

const Footer = () => {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p className="text-center text-sm leading-loose text-gray-500 md:text-left">
          &copy; {new Date().getFullYear()} StarkPass. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <Link href="/stats" className="text-sm text-gray-500 hover:underline">
            Stats
          </Link>
          <Link
            href="/sponsor"
            className="text-sm text-gray-500 hover:underline"
          >
            For Sponsors
          </Link>
          <Link
            href="/dashboard/settings"
            className="text-sm text-gray-500 hover:underline"
          >
            Settings
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
