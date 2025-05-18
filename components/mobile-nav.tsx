"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
export function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="md:hidden p-0 w-10 h-10">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <VisuallyHidden>
          <SheetTitle>Mobile Navigation Menu</SheetTitle>
          <SheetDescription>
            Navigate through the StarkPass website using the mobile menu.
          </SheetDescription>
        </VisuallyHidden>
        <div className="flex flex-col gap-6 px-2 py-6">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold" onClick={() => setOpen(false)}>
            <span>StarkPass</span>
          </Link>
          <nav className="flex flex-col gap-4">
            <Link
              href="/quests"
              className="text-base font-medium hover:text-primary transition-colors"
              onClick={() => setOpen(false)}
            >
              Quests
            </Link>
            <Link
              href="/claim"
              className="text-base font-medium hover:text-primary transition-colors"
              onClick={() => setOpen(false)}
            >
              Claim
            </Link>
            <Link
              href="/sponsor"
              className="text-base font-medium hover:text-primary transition-colors"
              onClick={() => setOpen(false)}
            >
              For Sponsors
            </Link>
            <Link
              href="/stats"
              className="text-base font-medium hover:text-primary transition-colors"
              onClick={() => setOpen(false)}
            >
              Stats
            </Link>
            <Link
              href="/dashboard"
              className="text-base font-medium hover:text-primary transition-colors"
              onClick={() => setOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/settings"
              className="text-base font-medium hover:text-primary transition-colors"
              onClick={() => setOpen(false)}
            >
              Settings
            </Link>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  )
}
