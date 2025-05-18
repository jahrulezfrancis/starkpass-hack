import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  BadgeCheck,
  Globe,
  Rocket,
  Shield,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import WalletConnect from "@/components/wallet-connect";
import { MobileNav } from "@/components/mobile-nav";
import { MotionAnimation } from "@/motionsHoc/MotionAnimation";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
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

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-background to-muted py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 blur-3xl opacity-20">
            <div className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30" />
          </div>
        </div>
        <div className="relative max-w-7xl mx-auto text-center">
          <MotionAnimation>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              Collect On-Chain Credentials & Complete Quests
            </h1>
          </MotionAnimation>
          <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-3xl mx-auto">
            StarkPass is a web3 platform for collecting verifiable credentials,
            participating in quests, and showcasing your blockchain journey -
            all powered by StarkNet.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/quests">
              <Button size="lg" className="rounded-full px-8">
                Explore Quests
              </Button>
            </Link>
            <Link
              href="/sponsor"
              className="text-sm font-semibold leading-6 flex items-center gap-1"
            >
              Become a Sponsor <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="bg-background rounded-lg p-6 shadow-sm border border-border">
              <p className="text-sm text-muted-foreground">Total Users</p>
              <p className="text-3xl font-bold">5,000+</p>
            </div>
            <div className="bg-background rounded-lg p-6 shadow-sm border border-border">
              <p className="text-sm text-muted-foreground">Quests Completed</p>
              <p className="text-3xl font-bold">12,500+</p>
            </div>
            <div className="bg-background rounded-lg p-6 shadow-sm border border-border">
              <p className="text-sm text-muted-foreground">
                Credentials Issued
              </p>
              <p className="text-3xl font-bold">8,200+</p>
            </div>
            <div className="bg-background rounded-lg p-6 shadow-sm border border-border">
              <p className="text-sm text-muted-foreground">Active Sponsors</p>
              <p className="text-3xl font-bold">120+</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Everything You Need for Web3 Credentials
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              StarkPass provides a complete platform for creating, earning, and
              managing on-chain credentials and quests.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border border-border hover:shadow-md transition-shadow">
              <CardHeader>
                <Trophy className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Complete Quests</CardTitle>
                <CardDescription>
                  Participate in educational quests and challenges to earn
                  on-chain credentials.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  From beginner tutorials to advanced challenges, our quests
                  help you learn while earning verifiable credentials.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/quests">
                  <Button variant="outline" className="w-full">
                    Browse Quests
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card className="border border-border hover:shadow-md transition-shadow">
              <CardHeader>
                <BadgeCheck className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Earn Credentials</CardTitle>
                <CardDescription>
                  Collect verifiable on-chain credentials that prove your skills
                  and achievements.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  All credentials are stored on StarkNet as NFTs, making them
                  truly yours and verifiable by anyone.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/claim">
                  <Button variant="outline" className="w-full">
                    Claim Credentials
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card className="border border-border hover:shadow-md transition-shadow">
              <CardHeader>
                <Globe className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Showcase Profile</CardTitle>
                <CardDescription>
                  Display your achievements and credentials with a personalized
                  on-chain profile.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Your StarkPass profile serves as your web3 resume, showcasing
                  your journey and accomplishments.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/dashboard">
                  <Button variant="outline" className="w-full">
                    View Dashboard
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card className="border border-border hover:shadow-md transition-shadow">
              <CardHeader>
                <Sparkles className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Create Campaigns</CardTitle>
                <CardDescription>
                  Sponsors can create custom credential campaigns and
                  educational quests.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Design your own credential programs to engage users, educate
                  your community, and reward participation.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/sponsor">
                  <Button variant="outline" className="w-full">
                    Become a Sponsor
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card className="border border-border hover:shadow-md transition-shadow">
              <CardHeader>
                <Shield className="h-10 w-10 text-primary mb-2" />
                <CardTitle>StarkNet Powered</CardTitle>
                <CardDescription>
                  Built on StarkNet for security, scalability, and low
                  transaction costs.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  StarkNet's Layer 2 technology ensures your credentials are
                  secure and affordable to mint and transfer.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/stats">
                  <Button variant="outline" className="w-full">
                    View Stats
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card className="border border-border hover:shadow-md transition-shadow">
              <CardHeader>
                <Users className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Community Driven</CardTitle>
                <CardDescription>
                  Join a community of learners, builders, and web3 enthusiasts.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Connect with others, share your achievements, and collaborate
                  on projects within our growing community.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/quests">
                  <Button variant="outline" className="w-full">
                    Join Community
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-16 px-4 sm:px-6 lg:px-8 mt-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Ready to Start Your Web3 Journey?
          </h2>
          <p className="text-lg max-w-3xl mx-auto mb-8 opacity-90">
            Join thousands of users collecting credentials, completing quests,
            and building their on-chain reputation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/quests">
              <Button
                size="lg"
                variant="secondary"
                className="rounded-full px-8"
              >
                Explore Quests
              </Button>
            </Link>
            <Link href="/sponsor">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8 bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary"
              >
                Become a Sponsor
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-gray-500 md:text-left">
            &copy; {new Date().getFullYear()} StarkPass. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/stats"
              className="text-sm text-gray-500 hover:underline"
            >
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
    </div>
  );
}
