"use client";

import React from "react";
import { MotionAnimation } from "@/motionsHoc/MotionAnimation";

import {
  Trophy,
  BadgeCheck,
  Globe,
  Sparkles,
  Shield,
  Users,
} from "lucide-react";
import Image from "next/image";
import logo from "../public/mainLogo.png";

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

const FeaturesSection = () => {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background image overlay */}
      <div className="absolute top-[10%] left-[-70%] md:top-0 md:left-0 bottom-0">
        <Image
          className="blur-sm"
          height={500}
          width={500}
          alt="logo"
          src={logo}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <MotionAnimation animation="slide-right">
          <div className="text-center mb-20">
            <div className="inline-block mb-4">
              <span className="px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-300">
                ✨ Next-Gen Web3 Platform
              </span>
            </div>
            <h2 className="section-title">
              <span className="text-3xl font-bold tracking-tight sm:text-5xl mb-6 block">
                Everything You Need for
              </span>
              <span className="text-4xl font-bold tracking-tight sm:text-6xl block bg-gradient-to-r from-[#667eea] via-[#764ba2] to-[#f093fb] bg-clip-text text-transparent">
                Web3 Credentials
              </span>
            </h2>
            <p className="hero-subtitle">
              StarkPass provides a complete platform for creating, earning, and
              managing on-chain credentials and quests in the decentralized
              future.
            </p>

            {/* Floating elements */}
            <div className="absolute top-10 left-1/4 w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
            <div className="absolute top-32 right-1/4 w-1.5 h-1.5 bg-pink-400 rounded-full animate-pulse delay-300"></div>
            <div className="absolute top-24 left-1/3 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse delay-700"></div>
          </div>
        </MotionAnimation>

        {/* Features Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, idx) => (
            <MotionAnimation key={idx} delay={0.15 * idx} animation="slide-up">
              <div className="group min-h-[300px]  relative overflow-hidden rounded-2xl bg-none p-6 border border-gray-700 shadow-md hover:shadow-purple-500/20 transition-all duration-300">
                <div className="mb-5 flex items-center gap-4">
                  <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-gradient-to-r from-[#667eea] via-[#764ba2] to-[#f093fb] text-white shadow-lg">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold  group-hover:text-purple-300 transition">
                    {feature.title}
                  </h3>
                </div>

                <p className="text-sm  mb-3">{feature.description}</p>
                <p className="text-sm text-gray-400 mb-5">{feature.content}</p>

                <a
                  href={feature.link}
                  className="inline-flex items-center text-sm font-medium text-purple-400 hover:text-pink-400 transition"
                >
                  {feature.buttonText}
                  <svg
                    className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </a>
              </div>
            </MotionAnimation>
          ))}
        </div>
      </div>
    </section>
  );
};
export default FeaturesSection;
