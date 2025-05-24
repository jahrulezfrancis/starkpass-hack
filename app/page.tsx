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

import HeroSection from "@/components/HeroSection";
import { StatSection } from "@/components/StatSection";
import FeaturesSection from "@/components/FeaturesSection";
import CTASection from "@/components/CTASection";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Stats Section */}
      <StatSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* CTA Section */}
      <CTASection />
    </div>
  );
}
