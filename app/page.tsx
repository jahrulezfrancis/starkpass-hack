import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Award, BadgeCheck, Rocket } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import WalletConnect from "@/components/wallet-connect"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex items-center justify-between h-16 px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
            <Rocket className="h-6 w-6" />
            <span>StarkPass</span>
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <WalletConnect />
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Your Web3 Identity & Achievements
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                    Collect on-chain credentials, participate in quests, and showcase your web3 journey with StarkPass.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/dashboard">
                    <Button className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1">
                      Launch App
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/quests">
                    <Button
                      variant="outline"
                      className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1"
                    >
                      Explore Quests
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <Image
                  src="https://i.ibb.co/wr01twyW/user-illustration.png?height=450&width=450"
                  width={550}
                  height={550}
                  alt="StarkPass Hero"
                  className="rounded-lg object-cover"
                />
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted-foreground/20 px-3 py-1 text-sm">Key Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Everything You Need for Web3 Engagement
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  StarkPass combines credentials, quests, and airdrops in one seamless platform.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 bg-background shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <BadgeCheck className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">On-Chain Credentials</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Collect and showcase verifiable credentials from events and achievements.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 bg-background shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Award className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Quest Board</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Complete challenges, earn rewards, and level up your on-chain presence.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border rounded-lg p-6 bg-background shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Rocket className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">StarkClaim</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Seamless airdrop and claim experience for projects and their communities.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-gray-500 md:text-left">
            &copy; {new Date().getFullYear()} StarkPass. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/stats" className="text-sm text-gray-500 hover:underline">
              Stats
            </Link>
            <Link href="/sponsor" className="text-sm text-gray-500 hover:underline">
              For Sponsors
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </footer>
    </div>
  )
}
