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
import { ThemeToggle } from "@/components/theme-toggle";
import { MobileNav } from "@/components/mobile-nav";
import { StarknetWalletConnect } from "@/components/StartknetWalletConnect";
import { MotionAnimation } from "@/motionsHoc/MotionAnimation";
import { FeatureCard } from "@/components/FeatureCard";
import {
  Trophy,
  BadgeCheck,
  Globe,
  Sparkles,
  Shield,
  Users,
  ArrowRight,
  Rocket,
} from "lucide-react";

const features = [
  {
    icon: Trophy,
    title: "Complete Quests",
    description:
      "Participate in educational quests and challenges to earn on-chain credentials.",
    content:
      "From beginner tutorials to advanced challenges, our quests help you learn while earning verifiable credentials.",
    link: "/quests",
    buttonText: "Browse Quests",
  },
  {
    icon: BadgeCheck,
    title: "Earn Credentials",
    description:
      "Collect verifiable on-chain credentials that prove your skills and achievements.",
    content:
      "All credentials are stored on StarkNet as NFTs, making them truly yours and verifiable by anyone.",
    link: "/claim",
    buttonText: "Claim Credentials",
  },
  {
    icon: Globe,
    title: "Showcase Profile",
    description:
      "Display your achievements and credentials with a personalized on-chain profile.",
    content:
      "Your StarkPass profile serves as your web3 resume, showcasing your journey and accomplishments.",
    link: "/dashboard",
    buttonText: "View Dashboard",
  },
  {
    icon: Sparkles,
    title: "Create Campaigns",
    description:
      "Sponsors can create custom credential campaigns and educational quests.",
    content:
      "Design your own credential programs to engage users, educate your community, and reward participation.",
    link: "/sponsor",
    buttonText: "Become a Sponsor",
  },
  {
    icon: Shield,
    title: "StarkNet Powered",
    description:
      "Built on StarkNet for security, scalability, and low transaction costs.",
    content:
      "StarkNet's Layer 2 technology ensures your credentials are secure and affordable to mint and transfer.",
    link: "/stats",
    buttonText: "View Stats",
  },
  {
    icon: Users,
    title: "Community Driven",
    description:
      "Join a community of learners, builders, and web3 enthusiasts.",
    content:
      "Connect with others, share your achievements, and collaborate on projects within our growing community.",
    link: "/quests",
    buttonText: "Join Community",
  },
];

const stats = [
  { label: "Total Users", value: "5,000+" },
  { label: "Quests Completed", value: "12,500+" },
  { label: "Credentials Issued", value: "8,200+" },
  { label: "Active Sponsors", value: "120+" },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-background to-muted py-20 px-4 sm:px-6 lg:px-8 md:min-h-screen">
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
          <MotionAnimation delay={0.4} animation={"slide-up"}>
            {" "}
            <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-3xl mx-auto">
              StarkPass is a web3 platform for collecting verifiable
              credentials, participating in quests, and showcasing your
              blockchain journey - all powered by StarkNet.
            </p>
          </MotionAnimation>

          <MotionAnimation delay={0.6} animation="slide-up">
            {" "}
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
          </MotionAnimation>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {stats.map((stat, i) => (
              <MotionAnimation delay={0.2 * i} animation="slide-down">
                <div
                  key={i}
                  className="bg-background rounded-lg p-6 shadow-sm border border-border min-h-[140px] flex flex-col justify-center"
                >
                  <p className="text-sm text-muted-foreground">{stat.label}</p>

                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
              </MotionAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <MotionAnimation animation="slide-right">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                Everything You Need for Web3 Credentials
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                StarkPass provides a complete platform for creating, earning,
                and managing on-chain credentials and quests.
              </p>
            </div>
          </MotionAnimation>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, idx) => (
              <MotionAnimation delay={0.2 * idx} animation="slide-up">
                <FeatureCard key={idx} {...feature} />
              </MotionAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-16 px-4 sm:px-6 lg:px-8 mt-8">
        <div className="max-w-7xl mx-auto text-center">
          <MotionAnimation>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Ready to Start Your Web3 Journey?
            </h2>
          </MotionAnimation>
          <MotionAnimation delay={0.4} animation="slide-up">
            <p className="text-lg max-w-3xl mx-auto mb-8 opacity-90">
              Join thousands of users collecting credentials, completing quests,
              and building their on-chain reputation.
            </p>
          </MotionAnimation>
          <MotionAnimation delay={0.6}>
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
          </MotionAnimation>
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
